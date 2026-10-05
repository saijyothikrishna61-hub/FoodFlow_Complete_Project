const STATUS_STEPS=["Placed","Confirmed","Preparing","Ready for Pickup","Picked Up","Out for Delivery","Delivered"];
document.addEventListener("DOMContentLoaded",()=>{
  const id=new URLSearchParams(location.search).get("order");
  const orders=JSON.parse(localStorage.getItem("foodflowOrders")||"[]");
  const order=orders.find(o=>o.id===id)||orders[0];
  const box=document.getElementById("trackingContent");
  if(!order){box.innerHTML='<div class="empty-state"><h3>Order not found</h3><a class="btn btn-primary" href="restaurants.html">Browse Restaurants</a></div>';return}
  document.getElementById("trackingOrderId").textContent=`Order #${order.id}`;
  document.getElementById("trackingRestaurant").textContent=order.restaurantName;
  document.getElementById("trackingTotal").textContent=`₹${order.total}`;

  const idx=Math.max(0,STATUS_STEPS.indexOf(order.status));
  document.getElementById("statusTimeline").innerHTML=STATUS_STEPS.map((s,i)=>`<div class="timeline-item ${i<=idx?"done":""}"><span>${i<=idx?"✓":i+1}</span><div><strong>${s}</strong>${i===idx?"<p>Current status</p>":""}</div></div>`).join("");
  document.getElementById("trackingItems").innerHTML=order.items.map(i=>`<div class="cart-row compact"><div class="cart-thumb">${i.emoji||"🍽️"}</div><div class="cart-info"><strong>${i.name}</strong><small>₹${i.price} × ${i.qty}</small></div><strong>₹${i.price*i.qty}</strong></div>`).join("");
});
