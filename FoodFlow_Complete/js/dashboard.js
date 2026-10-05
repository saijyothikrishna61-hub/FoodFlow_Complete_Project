const FF={getOrders(){return JSON.parse(localStorage.getItem("foodflowOrders")||"[]")},save(o){localStorage.setItem("foodflowOrders",JSON.stringify(o))},fmt(n){return `₹${Number(n).toLocaleString("en-IN")}`}};

function setOrderStatus(orderId,status){
  const orders=FF.getOrders(); const o=orders.find(x=>x.id===orderId);
  if(!o)return;
  o.status=status;
  FF.save(orders);
  location.reload();
}

document.addEventListener("DOMContentLoaded",()=>{
  const user=FoodFlowAuth.getCurrentUser();
  const pageRole=document.body.dataset.role;
  if(!user||user.role!==pageRole){location.href="../pages/login.html";return}

  document.querySelectorAll("[data-logout]").forEach(b=>b.onclick=()=>{FoodFlowAuth.logout();location.href="../pages/login.html"});
  const orders=FF.getOrders();
  const statEls=document.querySelectorAll("[data-stat]");
  statEls.forEach(el=>{
    const type=el.dataset.stat;
    if(type==="orders")el.textContent=orders.length;
    if(type==="pending")el.textContent=orders.filter(o=>!["Delivered","Cancelled"].includes(o.status)).length;
    if(type==="sales")el.textContent=FF.fmt(orders.reduce((s,o)=>s+o.total,0));
    if(type==="customers")el.textContent=new Set(orders.map(o=>o.customer?.email)).size;
  });

  document.querySelectorAll("[data-order-list]").forEach(container=>{
    let visible=orders;
    if(pageRole==="restaurant") visible=orders.filter(o=>o.restaurantId==="spice-garden");
    if(pageRole==="delivery") visible=orders.filter(o=>["Ready for Pickup","Picked Up","Out for Delivery"].includes(o.status));
    container.innerHTML="";
    if(!visible.length){container.innerHTML='<div class="empty-state"><h3>No orders available</h3><p class="muted">Try again after a customer places an order.</p></div>';return}
    visible.forEach(o=>{
      const el=document.createElement("div");el.className="panel order-card";
      let actions="";
      if(pageRole==="restaurant"){
        const flow=["Placed","Confirmed","Preparing","Ready for Pickup"];
        const next=flow[Math.min(flow.indexOf(o.status)+1,flow.length-1)];
        if(o.status==="Placed") actions=`<button class="btn btn-small" onclick="setOrderStatus('${o.id}','Confirmed')">Confirm</button>`;
        else if(o.status==="Confirmed") actions=`<button class="btn btn-small" onclick="setOrderStatus('${o.id}','Preparing')">Start Preparing</button>`;
        else if(o.status==="Preparing") actions=`<button class="btn btn-success" onclick="setOrderStatus('${o.id}','Ready for Pickup')">Ready for Pickup</button>`;
        else if(o.status==="Ready for Pickup") actions='<span class="badge green">Waiting for delivery</span>';
        else actions='<span class="badge blue">In delivery</span>';
      } else {
        if(o.status==="Ready for Pickup") actions=`<button class="btn btn-small" onclick="setOrderStatus('${o.id}','Picked Up')">Pick Up</button>`;
        else if(o.status==="Picked Up") actions=`<button class="btn btn-small" onclick="setOrderStatus('${o.id}','Out for Delivery')">Start Delivery</button>`;
        else if(o.status==="Out for Delivery") actions=`<button class="btn btn-success" onclick="setOrderStatus('${o.id}','Delivered')">Mark Delivered</button>`;
      }
      el.innerHTML=`<div class="card-row"><div><h3>${o.restaurantName}</h3><p class="muted">#${o.id} • ${o.customer?.name||"Customer"}</p></div><span class="badge orange">${o.status}</span></div><div class="order-items">${o.items.map(i=>`<div>${i.emoji||"🍽️"} ${i.name} × ${i.qty}</div>`).join("")}</div><div class="card-row" style="margin-top:15px"><strong>${FF.fmt(o.total)}</strong><div style="display:flex;gap:8px;flex-wrap:wrap">${actions}<a class="btn btn-light" href="../pages/tracking.html?order=${o.id}">View</a></div></div>`;
      container.appendChild(el);
    });
  });
});
