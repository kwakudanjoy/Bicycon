// tag idetiites
document.addEventListener("DOMContentLoaded", () => {
    
const User_Icon = document.querySelector(".user-icon"); //user icon
const User_Pro_Pic = document.querySelector(".pro-pic"); //user profile pic
const User_Nmae = document.querySelector(".name"); //user name
const User_ID = document.querySelector(".id"); // user ID
const User_Email = document.querySelector(".email"); // user Email
const User_Tel = document.querySelector(".tel"); // User Tel 
const Map_Icon = document.querySelector(".location") // map
const Edith =document.querySelector(".edith"); // edith
const Menu = document.querySelector(".menu"); //menu 
const Shops = document.querySelector(".shops"); // shops
const Product = document.querySelector(".products"); // products Button
const Orders = document.querySelector(".orders"); // orders button
const Ads = document.querySelector(".ads"); // ads buttons
const Inventory = document.querySelector(".inventory"); // inventory buttons
const Customers = document.querySelector(".customers");
const Analytics = document.querySelector(".analytics"); // analutic button
const Settings = document.querySelector(".settings"); // settings button
const Map =document.querySelector(".map"); // map display

const ipAddress = "https://1376-41-204-44-1.ngrok-free.app";
//uploading the mape to the user
function UploadMap() {
    
}

// onclicks on memu muttons

Menu.addEventListener("click", (e) => {
    const child = e.target.closest(".menu-items");
    if (!child) return;

    // Remove the class from all items
     document.querySelectorAll(".menu-items").forEach(el => {
        el.classList.remove("show-menu-item"); // ✅ no dot
    });

    // Add the class to the clicked item
    child.classList.add("show-menu-item"); // ✅ no dot
});

// Shops
Shops.addEventListener("click", ()=>{
    alert("sds");
});

//Products
Product.addEventListener("click",()=>{

});

//orders
Orders.addEventListener("click",()=>{

});

//ads
Ads.addEventListener("click",()=>{

});

//Inventory
Inventory.addEventListener("click",()=>{

});

//Customers
Customers.addEventListener("click",()=>{

});

//Analytics
Analytics.addEventListener("click",()=>{

});

//Setting
Settings.addEventListener("click",()=>{

}); 
});
