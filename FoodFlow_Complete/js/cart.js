document.addEventListener("DOMContentLoaded",()=>{
  const cart=FoodFlow.getCart();
  const wrap=document.getElementById("cartItems");
  const empty=document.getElementById("cartEmpty");
  const summary=document.getElementById("cartSummary");

  function render(){
    const current=FoodFlow.getCart();
    wrap.innerHTML="";
    if(!current.length){empty.style.display="block";summary.style.display="none";return}
    empty.style.display="none";summary.style.display="block";
    const groups={};
    current.forEach(i=>(groups[i.restaurantId]??=[]).push(i));
    Object.entries(groups).forEach(([restaurantId,items])=>{
      const box=document.createElement("div");box.className="panel";
      box.innerHTML=`<h3 style="margin-bottom:14px">${items[0].restaurantName||"Restaurant"}</h3>`;
      items.forEach(i=>{
        const row=document.createElement("div");row.className="cart-row";
        row.innerHTML=`<div class="cart-thumb">${i.emoji||"🍽️"}</div><div class="cart-info"><strong>${i.name}</strong><small>₹${i.price} each</small></div><div class="qty-box"><button data-d="-1">−</button><b>${i.qty}</b><button data-d="1">+</button></div><strong>₹${i.price*i.qty}</strong><button class="remove-item">✕</button>`;
        row.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{FoodFlow.changeQty(i.id,i.restaurantId,Number(b.dataset.d));render()});
        row.querySelector(".remove-item").onclick=()=>{FoodFlow.removeFromCart(i.id,i.restaurantId);render()};
        box.appendChild(row);
      });
      wrap.appendChild(box);
    });
    const subtotal=current.reduce((s,i)=>s+i.price*i.qty,0);
    const delivery=current.length?40:0;
    const fee=Math.round(subtotal*0.05);
    document.getElementById("subtotal").textContent=`₹${subtotal}`;
    document.getElementById("deliveryFee").textContent=`₹${delivery}`;
    document.getElementById("platformFee").textContent=`₹${fee}`;
    document.getElementById("grandTotal").textContent=`₹${subtotal+delivery+fee}`;
  }
  document.getElementById("clearCart").onclick=()=>{FoodFlow.clearCart();render()};
  document.getElementById("checkoutBtn").onclick=()=>{
    if(!localStorage.getItem("foodflowCurrentUser")) location.href="login.html?redirect=checkout";
    else location.href="checkout.html";
  };
  render();
});
