document.addEventListener("DOMContentLoaded",()=>{
  const user=FoodFlowAuth.getCurrentUser();
  if(!user){location.href="login.html?redirect=checkout";return}
  const cart=FoodFlow.getCart();
  if(!cart.length){location.href="cart.html";return}
  document.getElementById("customerName").value=user.name;
  document.getElementById("customerEmail").value=user.email;

  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const delivery=40, fee=Math.round(subtotal*.05), total=subtotal+delivery+fee;
  document.getElementById("checkoutSubtotal").textContent=`₹${subtotal}`;
  document.getElementById("checkoutDelivery").textContent=`₹${delivery}`;
  document.getElementById("checkoutFee").textContent=`₹${fee}`;
  document.getElementById("checkoutTotal").textContent=`₹${total}`;

  document.getElementById("checkoutForm").addEventListener("submit",e=>{
    e.preventDefault();
    const orderId="FF"+Date.now().toString().slice(-8);
    const order={
      id:orderId,
      customer:{name:user.name,email:user.email,phone:document.getElementById("phone").value},
      address:{line:document.getElementById("address").value,city:document.getElementById("city").value,pincode:document.getElementById("pincode").value},
      items:cart,
      subtotal,deliveryFee:delivery,platformFee:fee,total,
      payment:document.getElementById("payment").value,
      status:"Placed",
      createdAt:new Date().toISOString(),
      eta:30,
      restaurantId:cart[0].restaurantId,
      restaurantName:cart[0].restaurantName||"Restaurant"
    };
    const orders=JSON.parse(localStorage.getItem("foodflowOrders")||"[]");
    orders.unshift(order);
    localStorage.setItem("foodflowOrders",JSON.stringify(orders));
    FoodFlow.clearCart();
    location.href=`tracking.html?order=${orderId}`;
  });
});
