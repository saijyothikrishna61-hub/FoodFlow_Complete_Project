const MENU_DATA = {
  "spice-garden":[
    ["b1","Chicken Biryani","Main Course",249,"🍗","nonveg"],["b2","Paneer Butter Masala","Main Course",199,"🧀","veg"],["b3","Veg Fried Rice","Main Course",159,"🍚","veg"],["b4","Chicken Tikka","Starters",229,"🍢","nonveg"],["b7","Gulab Jamun","Desserts",99,"🍮","veg"],["b8","Fresh Lime Soda","Drinks",69,"🥤","veg"],["b9","Veg Manchurian","Starters",169,"🥟","veg"]
  ],
  "italiano-pizza":[
    ["p1","Margherita Pizza","Pizza",249,"🍕","veg"],["p2","Farmhouse Pizza","Pizza",299,"🍕","veg"],["p3","Cheese Burst Pizza","Pizza",329,"🍕","veg"],["p4","Garlic Bread","Starters",149,"🥖","veg"],["p5","Pasta Alfredo","Main Course",229,"🍝","veg"],["p6","Tiramisu","Desserts",159,"🍰","veg"],["p7","Fresh Lime Soda","Drinks",69,"🥤","veg"]
  ],
  "burger-hub":[
    ["h1","Cheese Burger","Burgers",179,"🍔","nonveg"],["h2","Double Patty Burger","Burgers",249,"🍔","nonveg"],["h3","Veg Supreme Burger","Burgers",169,"🥬","veg"],["h4","Loaded Fries","Starters",129,"🍟","veg"],["h5","Chicken Wings","Starters",219,"🍗","nonveg"],["h6","Chocolate Shake","Drinks",139,"🥤","veg"],["h7","Brownie","Desserts",109,"🍫","veg"]
  ],
  "dragon-bowl":[
    ["d1","Veg Manchurian","Starters",169,"🥟","veg"],["d2","Hakka Noodles","Main Course",179,"🍜","veg"],["d3","Chicken Fried Rice","Main Course",199,"🍚","nonveg"],["d4","Chilli Chicken","Starters",239,"🍗","nonveg"],["d5","Schezwan Rice","Main Course",189,"🍚","veg"],["d6","Mango Pudding","Desserts",129,"🥭","veg"],["d7","Lemon Tea","Drinks",79,"🍵","veg"]
  ],
  "sweet-treats":[
    ["s1","Gulab Jamun","Desserts",99,"🍮","veg"],["s2","Brownie","Desserts",129,"🍫","veg"],["s3","Chocolate Cake","Desserts",159,"🍰","veg"],["s4","Ice Cream Sundae","Desserts",149,"🍨","veg"],["s5","Fruit Cream","Desserts",119,"🍓","veg"],["s6","Cold Coffee","Drinks",109,"🥤","veg"]
  ],
  "royal-biryani":[
    ["r1","Hyderabadi Chicken Biryani","Main Course",279,"🍗","nonveg"],["r2","Mutton Biryani","Main Course",329,"🍖","nonveg"],["r3","Veg Biryani","Main Course",199,"🍚","veg"],["r4","Chicken 65","Starters",229,"🍗","nonveg"],["r5","Double Ka Meetha","Desserts",129,"🍮","veg"],["r6","Lassi","Drinks",89,"🥛","veg"]
  ],
  "green-bowl":[
    ["g1","Buddha Bowl","Main Course",239,"🥗","veg"],["g2","Paneer Salad","Main Course",219,"🥗","veg"],["g3","Veg Wrap","Main Course",159,"🌯","veg"],["g4","Grilled Corn","Starters",109,"🌽","veg"],["g5","Fruit Bowl","Desserts",129,"🍓","veg"],["g6","Green Smoothie","Drinks",139,"🥤","veg"]
  ],
  "cafe-mocha":[
    ["c1","Cappuccino","Drinks",109,"☕","veg"],["c2","Cold Coffee","Drinks",119,"🥤","veg"],["c3","Veg Sandwich","Main Course",149,"🥪","veg"],["c4","Pasta","Main Course",199,"🍝","veg"],["c5","Cheesecake","Desserts",169,"🍰","veg"],["c6","Brownie","Desserts",109,"🍫","veg"]
  ],
  "wok-express":[
    ["w1","Hakka Noodles","Main Course",169,"🍜","veg"],["w2","Schezwan Chicken","Main Course",229,"🍗","nonveg"],["w3","Veg Fried Rice","Main Course",159,"🍚","veg"],["w4","Chilli Paneer","Starters",189,"🧀","veg"],["w5","Spring Rolls","Starters",139,"🥟","veg"],["w6","Mango Pudding","Desserts",129,"🥭","veg"]
  ]
};
const RESTAURANT_META={
 "spice-garden":["Spice Garden","Indian","25-30 min","4.8"],
 "italiano-pizza":["Italiano Pizza","Pizza","20-25 min","4.7"],
 "burger-hub":["Burger Hub","Burgers","15-20 min","4.6"],
 "dragon-bowl":["Dragon Bowl","Chinese","30-35 min","4.5"],
 "sweet-treats":["Sweet Treats","Desserts","25-30 min","4.9"],
 "royal-biryani":["Royal Biryani","Indian","28-35 min","4.8"],
 "green-bowl":["Green Bowl","Healthy","22-28 min","4.7"],
 "cafe-mocha":["Cafe Mocha","Desserts","18-24 min","4.6"],
 "wok-express":["Wok Express","Chinese","17-23 min","4.4"]
};

document.addEventListener("DOMContentLoaded",()=>{
  const id=new URLSearchParams(location.search).get("restaurant")||"spice-garden";
  const meta=RESTAURANT_META[id]||RESTAURANT_META["spice-garden"];
  document.getElementById("restaurantName").textContent=meta[0];
  document.getElementById("restaurantMeta").textContent=`${meta[1]} • ${meta[2]} • ★ ${meta[3]}`;
  const grid=document.getElementById("menuGrid");
  const items=(MENU_DATA[id]||MENU_DATA["spice-garden"]).map(x=>({id:x[0],name:x[1],category:x[2],price:x[3],emoji:x[4],type:x[5]}));
  const tabs=[...document.querySelectorAll(".menu-tab")];
  const q=document.getElementById("menuSearch");

  function render(){
    const cat=document.querySelector(".menu-tab.active")?.dataset.category||"All";
    const query=(q?.value||"").toLowerCase();
    grid.innerHTML="";
    items.filter(i=>(cat==="All"||i.category===cat)&&i.name.toLowerCase().includes(query)).forEach(item=>{
      const cart=FoodFlow.getCart().find(c=>c.id===item.id&&c.restaurantId===id);
      const qty=cart?.qty||0;
      const el=document.createElement("article");
      el.className="menu-card";
      el.innerHTML=`<div class="menu-image"><span>${item.emoji}</span></div><div class="menu-body"><div class="menu-title-row"><h3>${item.name}</h3><span class="veg-dot ${item.type}"></span></div><p>${item.category}</p><div class="menu-bottom"><strong>₹${item.price}</strong><div class="qty-box">${qty?`<button data-action="dec">−</button><b>${qty}</b><button data-action="inc">+</button>`:`<button class="add-btn" data-action="add">Add</button>`}</div></div></div>`;
      el.querySelector('[data-action="add"]')?.addEventListener("click",()=>{FoodFlow.addToCart({...item,restaurantId:id,restaurantName:meta[0],qty:1});render()});
      el.querySelector('[data-action="inc"]')?.addEventListener("click",()=>{FoodFlow.changeQty(item.id,id,1);render()});
      el.querySelector('[data-action="dec"]')?.addEventListener("click",()=>{FoodFlow.changeQty(item.id,id,-1);render()});
      grid.appendChild(el);
    });
    const subtotal=FoodFlow.getCart().filter(c=>c.restaurantId===id).reduce((s,c)=>s+c.price*c.qty,0);
    document.getElementById("floatingTotal").textContent=`₹${subtotal}`;
  }
  tabs.forEach(t=>t.addEventListener("click",()=>{tabs.forEach(x=>x.classList.remove("active"));t.classList.add("active");render()}));
  q?.addEventListener("input",render);
  document.getElementById("viewCart").onclick=()=>location.href="cart.html";
  render();
});
