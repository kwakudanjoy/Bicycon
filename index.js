const profile = document.querySelector(".profile");
const ProfileImage = document.querySelector(".profile > img");
const UserIcon = document.querySelector(".user");
const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");
const keySearch = document.querySelector(".key-search");
const Main = document.querySelector(".main");
const Auth = document.getElementById("auth");
 
const Loading = document.querySelector("#loading-overlay");

//Buying cart
const Cart_Overlay = document.querySelector(".cart-overlay"); // whole cart
const Cart_close = Cart_Overlay.querySelector(".cart-close-btn");
const Cart_Order_Minus = Cart_Overlay.querySelector(".minus");
const Cart_Order_Quantity = Cart_Overlay.querySelector(".qty-number");
const Cart_Order_Add = Cart_Overlay.querySelector(".plus");
const Cart_Buy_Order = Cart_Overlay.querySelector(".cart-buy-btn");

const ipAddress = "https://ea88-41-204-44-80.ngrok-free.app" ; //"http://localhost:8080";
// Initially hide elements
const User =JSON.parse(localStorage.getItem("user") || "null");

document.addEventListener("DOMContentLoaded", async () => {
    await Insert_Categories();
    const storedCategories = getLocalCategories();
    Loading.style.display = "flex";
    await GetProducts(storedCategories[0]);
    Loading.style.display = "none";
});

async function Load_Image (Url){
    const res = await fetch(`${ipAddress}/profile/${Url}`, {
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
});

    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
}


function CheckUser() {
    if(User && User.profilePic){
        UserIcon.style.display = "none";
        profile.style.display = "block";
        ProfileImage.src = `${ipAddress}/profile/${User.profilePic}`;
       // ProfileImage.src = Load_Image(User.profilePic);
    } else {
        UserIcon.style.display = "flex";
        profile.style.display = "none";  // use correct variable
        ProfileImage.src = "https://via.placeholder.com/35"; // optional fallback
    }
}

CheckUser();

keySearch.addEventListener("click", (e) => {
    const Key = e.target.closest(".key");
    if (!Key) return;

    document.querySelectorAll(".key").forEach(el => {
        el.classList.remove("selected");
    });

    Key.classList.add("selected");
    const p = Key.querySelector("p");
    Loading.style.display = "flex";
    GetProducts(p.textContent);
    Loading.style.display = "none";
});


let searchOpen = false;

searchIcon.addEventListener("click", () => {

    // FIRST CLICK → open search
    if(!searchOpen){
        searchInput.style.display = "block";
        keySearch.style.display = "none";
        searchInput.focus();
        searchOpen = true;
        return;
    }

    // SECOND CLICK
    const text = searchInput.value.trim();

    if(text){
        console.log("Searching for:", text);

        // your search logic here
    }else{
        // close search
        searchInput.style.display = "none";
        keySearch.style.display = "flex";
        searchInput.value = "";
        searchOpen = false;
    }

});

Auth.addEventListener("click",()=>{
   
    if(User && User.account_completed === "YES"){
        window.location.href = "/main/main.html"
    }else{
        window.location.href = "/auth/auth.html"
    }
});

async function Insert_Categories() {
    const keySearch = document.querySelector(".key-search");
    const storedCategories = getLocalCategories();

    // Check internet connection by pinging server
    let online = true;
    try {
        const pingResponse = await Get({ INSTRUCTION: "PING" });
        if (!pingResponse || pingResponse.status !== "OK") online = false;
    } catch {
        online = false;
    }

    if (online) {
        // Online → fetch categories from server
        try {
            const data = await fetchData({ INSTRUCTION: "GET-CATEGORIES" });
            if (data && data.Product_Categories) {
                displayCategories(data.Product_Categories, keySearch);
                saveLocalCategories(data.Product_Categories);
            }
        } catch (err) {
            console.error("Failed to fetch categories online:", err);

            // Fallback to localStorage if online fetch fails
            if (storedCategories) displayCategories(storedCategories, keySearch);
        }
    } else {
        // Offline → use localStorage
        if (storedCategories) {
            displayCategories(storedCategories, keySearch);
        } else {
            console.warn("No internet and no local data available");
            keySearch.innerHTML = `<p>No categories available</p>`;
        }
    }
}

// Helper: display categories in keySearch
function displayCategories(categories, container) {
    container.innerHTML = ""; // clear previous
    categories.forEach(cat => {
        const div = document.createElement("div");
        div.classList.add("key");
        div.innerHTML = `<p>${cat}</p>`;
        container.appendChild(div);
    });
}

// Helper: save to localStorage safely
function saveLocalCategories(categories) {
    try {
        localStorage.setItem("Product-Categories", JSON.stringify(categories));
    } catch (err) {
        console.warn("localStorage not available:", err);
    }
}

// Helper: get categories from localStorage safely
function getLocalCategories() {
    try {
        const stored = localStorage.getItem("Product-Categories");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

async function GetProducts(KeyWord1) {

    const Payload = {
        INSTRUCTION: "GET-PRODUCT",
        KeySearch: KeyWord1
    };

    const products = await fetchData(Payload);  // await if Get is async
    if(Array.isArray(products) || products.length !== 0){
    
        Main.innerHTML ="";
        const fragment = document.createDocumentFragment(); // create fragment

        products.forEach(prod => {
            const ProductCard = document.createElement("div");
            ProductCard.className = "product-card";

            ProductCard.innerHTML = `
                <div class="product-image">
                    <img src="${ipAddress}/products/${prod.ImageUrl}" alt="image" class="prod-img">
                </div>
                <div class="product-info">
                    <div class="retailer">
                        <img src="${ipAddress}/profile/${prod.profilePic} "alt="Retailer Logo" class="retailer_profile_pic">
                        <div class="user-detail">
                            <span class="name">${prod.RetailerName}</span>
                            <span class="retailerID">${prod.RetailerID}</span>
                        </div>
                    </div>
                    <h4 class="product-name">${prod.Name}</h4>
                    <h3 class="product-price">GHC : ${prod.Price}</h3>
                    <p class="product-description">${prod.Description}</p>
                    <button class="cart"><i class="fa-solid fa-cart-shopping"></i></button>
                </div>
            `;

        fragment.appendChild(ProductCard); // add to fragment, not directly to DOM
    });

    Main.appendChild(fragment); // append all cards at once
    }
}


Main.addEventListener("click", async e => {
    // check if a cart button was clicked
    if (e.target.closest(".cart")) {
        const productCard = e.target.closest(".product-card"); // this specific product
        const productName = productCard.querySelector(".product-name").textContent;
        const productPrice = productCard.querySelector(".product-price").textContent;
        const productDescription = productCard.querySelector(".product-description").textContent;
        const retailerName = productCard.querySelector(".name").textContent;
        const retailerID = productCard.querySelector(".retailerID").textContent;
        // ✅ Get product image URL
        const productImage = productCard.querySelector(".prod-img").src;
        const Retailer_Profile_Pic = productCard.querySelector(".retailer_profile_pic").src;
    
        let Payload = {
            INSTRUCTION : "GET-RETAILER-EMAIL & PHONE",
            RetailerID : retailerID
        }

        try{
            Loading.style.display = "flex";
            let Result = await fetchData(Payload);
            if(Result){
                Loading.style.display = "none";

                // populate your cart overlay
                Cart_Overlay.querySelector(".cart-retailer__image").src = Retailer_Profile_Pic;
                Cart_Overlay.querySelector(".cart-product__image").src = productImage;
                Cart_Overlay.querySelector(".cart-product__name").textContent = productName;
                Cart_Overlay.querySelector(".cart-product__price").textContent = productPrice;
                Cart_Overlay.querySelector(".cart-product__description").textContent = productDescription;
                Cart_Overlay.querySelector(".cart-retailer__name").textContent = retailerName;

                Cart_Overlay.querySelector(".cart-retailer__email").textContent = Result["Email"];
                Cart_Overlay.querySelector(".cart-retailer__phone").textContent = Result["Phone"];

                // show the overlay
                Cart_Overlay.style.display = "flex";

                // optionally reset quantity to 1
                Cart_Overlay.querySelector(".qty-number").textContent = "1";
            }
        }catch(err){
            alert("sorry Error cooured");
            Loading.style.display = "none";
        }
       
        //alert(retailerID);

    }else if(e.target.closest(".retailer")){

    }

});

// cart execution
Cart_close.addEventListener("click",()=>{
    Cart_Overlay.style.display = "none";
});

Cart_Order_Minus.addEventListener("click",()=>{
   let Orderquantity = parseInt(Cart_Order_Quantity.textContent.trim());
    if(Orderquantity > 1){
        Orderquantity -- ;
        Cart_Order_Quantity.textContent = Orderquantity; 
    }
});

Cart_Order_Add.addEventListener("click",()=>{
    //alert("click");
    let Orderquantity = parseInt(Cart_Order_Quantity.textContent.trim());
    Orderquantity++;
    Cart_Order_Quantity.textContent = Orderquantity;
});

// ====== FETCH HELPERS ======
async function fetchData(payload) {
    try {
        const response = await fetch(`${ipAddress}/api/process`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Network Error: ${response.status}`);
        const data = await response.json();
        if (!data) throw new Error("Server returned empty data");

        return data;

    } catch (err) {
        console.error("Fetch error:", err);
        alert("Sorry an error ocured. ! Please check your internet connect.");
        Loading.style.display = "none";
        return null;
    }
}
