document.addEventListener("DOMContentLoaded",()=>{
  const cards=[...document.querySelectorAll(".restaurant-card")];
  const search=document.getElementById("restaurantSearch");
  const sort=document.getElementById("sortRestaurants");
  const resultCount=document.getElementById("resultCount");
  const empty=document.getElementById("noRestaurants");
  let category=new URLSearchParams(location.search).get("category")||"All";
  let query=new URLSearchParams(location.search).get("search")||"";

  if(search) search.value=query;
  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.category===category);
    btn.onclick=()=>{category=btn.dataset.category;document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");render()};
  });
  search?.addEventListener("input",()=>{query=search.value.trim();render()});
  sort?.addEventListener("change",render);
  document.getElementById("clearRestaurantFilters")?.addEventListener("click",()=>{category="All";query="";search.value="";sort.value="recommended";document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("active",b.dataset.category==="All"));render()});

  function render(){
    const list=cards.filter(card=>{
      const catOk=category==="All"||card.dataset.category===category;
      const q=(card.dataset.search||card.innerText).toLowerCase().includes(query.toLowerCase());
      return catOk&&q;
    });
    const method=sort?.value;
    list.sort((a,b)=>{
      if(method==="rating") return Number(b.dataset.rating)-Number(a.dataset.rating);
      if(method==="delivery") return Number(a.dataset.delivery)-Number(b.dataset.delivery);
      if(method==="name") return a.dataset.name.localeCompare(b.dataset.name);
      return Number(b.dataset.rating)-Number(a.dataset.rating);
    });
    cards.forEach(c=>c.style.display="none");
    list.forEach(c=>{c.style.display="block";document.getElementById("restaurantGrid").appendChild(c)});
    resultCount.textContent=`${list.length} restaurant${list.length!==1?"s":""}`;
    empty.style.display=list.length?"none":"block";
  }
  render();
});
