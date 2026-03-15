const profilePic = document.querySelector(".profile");
const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");
const keySearch = document.querySelector(".key-search");
const Main = document.querySelector(".main");
const Auth = document.getElementById("auth");

// Initially hide elements
profilePic.style.display = "none";
const User = localStorage.getItem("User");

document.addEventListener("DOMContentLoaded", async () => {
    await Insert_Categories();
    const storedCategories = getLocalCategories();
    await GetProducts(storedCategories[0]);
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

    if(text !== ""){
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
    if(User === null){
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
            const data = await Get({ INSTRUCTION: "GET-CATEGORIES" });
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

async function GetProducts(KeyWord) {

    const Payload = {
        INSTRUCTION: "GET-PRODUCT",
        KeySearch: KeyWord
    };

    const products = await Get(Payload);  // await if Get is async

    const Main = document.querySelector("main"); // select main
    const fragment = document.createDocumentFragment(); // create fragment

    products.forEach(prod => {
        const ProductCard = document.createElement("div");
        ProductCard.className = "product-card";

        ProductCard.innerHTML = `
            <div class="product-image">
                <img src="${prod.image}" alt="${prod.name}">
            </div>
            <div class="product-info">
                <div class="retailer">
                    <img src="" alt="Retailer Logo">
                    <div class="user-detail">
                        <span class="name">${prod.retailerName}</span>
                        <span>${prod.retailerID}</span>
                    </div>
                </div>
                <h4 class="product-name">${prod.name}</h4>
                <h3 class="product-price">${prod.price}</h3>
                <p class="product-description">${prod.description}</p>
            </div>
        `;

        fragment.appendChild(ProductCard); // add to fragment, not directly to DOM
    });

    Main.appendChild(fragment); // append all cards at once
}

async function Get(Payload) {
    try {
        const response = await fetch("http://10.124.175.228:8080/api/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Payload)
        });

        if (!response.ok) {
            throw new Error(`Network Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
            throw new Error("Server returned empty data");
        }

        return data; // ✅ Return the JSON to the caller

    } catch (err) {
        console.error("Fetch error:", err);
        alert("Error occured");
        throw err; // ✅ Propagate the error if you want the caller to handle it
    }
}
