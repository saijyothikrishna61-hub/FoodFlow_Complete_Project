(() => {
  const USERS_KEY = "foodflowUsers";
  const CURRENT_KEY = "foodflowCurrentUser";

  function seedUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([
        {name:"Demo Customer", email:"customer@foodflow.com", password:"123456", role:"customer"},
        {name:"Demo Restaurant", email:"restaurant@foodflow.com", password:"123456", role:"restaurant"},
        {name:"Demo Delivery", email:"delivery@foodflow.com", password:"123456", role:"delivery"}
      ]));
    }
  }
  function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  function getCurrentUser() { try{return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null")}catch{return null} }
  function login(email,password) {
    const user = getUsers().find(u => u.email.toLowerCase()===email.toLowerCase() && u.password===password);
    if (!user) return {ok:false,message:"Invalid email or password."};
    const safeUser = {name:user.name,email:user.email,role:user.role};
    localStorage.setItem(CURRENT_KEY, JSON.stringify(safeUser));
    return {ok:true,user:safeUser};
  }
  function register(name,email,password,role="customer") {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase()===email.toLowerCase())) return {ok:false,message:"Email already registered."};
    users.push({name,email,password,role});
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return login(email,password);
  }
  function logout() { localStorage.removeItem(CURRENT_KEY); }
  function roleHome(role) {
    if (role==="restaurant") return "../restaurant/dashboard.html";
    if (role==="delivery") return "../delivery/dashboard.html";
    return "../index.html";
  }
  function updateNav() {
    const user=getCurrentUser();
    document.querySelectorAll(".login-link").forEach(a=>{
      if(user){ a.textContent=`Hi, ${user.name.split(" ")[0]}`; a.href="#"; a.onclick=e=>{e.preventDefault(); logout(); location.reload();}; }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    seedUsers();
    updateNav();

    const loginForm=document.getElementById("loginForm");
    const registerForm=document.getElementById("registerForm");

    loginForm?.addEventListener("submit", e=>{
      e.preventDefault();
      const r=login(loginForm.email.value.trim(),loginForm.password.value);
      const msg=document.getElementById("authMessage");
      if(!r.ok){msg.textContent=r.message;msg.className="notice";return;}
      const redirect=new URLSearchParams(location.search).get("redirect");
      if(redirect==="checkout") location.href="checkout.html";
      else if(redirect==="orders") location.href="orders.html";
      else location.href=roleHome(r.user.role);
    });

    registerForm?.addEventListener("submit", e=>{
      e.preventDefault();
      const role=registerForm.role.value;
      const r=register(registerForm.name.value.trim(),registerForm.email.value.trim(),registerForm.password.value,role);
      const msg=document.getElementById("authMessage");
      if(!r.ok){msg.textContent=r.message;msg.className="notice";return;}
      location.href=roleHome(r.user.role);
    });
  });

  seedUsers();
  window.FoodFlowAuth={seedUsers,getUsers,getCurrentUser,login,register,logout,roleHome};
})();
