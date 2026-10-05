document.addEventListener("DOMContentLoaded",()=>{
  const user=FoodFlowAuth.getCurrentUser();
  if(!user){location.href="login.html?redirect=orders";return}
  const orders=JSON.parse(localStorage.getItem("foodflowOrders")||"[]");
  const mine=orders.filter(o=>o.customer?.email===user.email);
  const wrap=document.getElementById("ordersList");
  if(!mine.length){wrap.innerHTML='<div class="empty-state"><div style="font-size:3rem">📦</div><h3>No orders yet</h3><p class="muted">Your placed orders will appear here.</p><a class="btn btn-primary" style="margin-top:15px" href="restaurants.html">Browse Restaurants</a></div>';return}
  mine.forEach(o=>{
    const el=document.createElement("div");el.className="panel order-card";
    el.innerHTML=`<div class="card-row"><div><h3>${o.restaurantName}</h3><p class="muted">Order #${o.id} • ${new Date(o.createdAt).toLocaleString()}</p></div><span class="badge orange">${o.status}</span></div><div class="order-items">${o.items.map(i=>`<div>${i.emoji||"🍽️"} ${i.name} × ${i.qty}</div>`).join("")}</div><div class="card-row" style="margin-top:15px"><strong>Total ₹${o.total}</strong><a class="btn btn-small" href="tracking.html?order=${o.id}">Track Order</a></div>`;
    wrap.appendChild(el);
  });
});
