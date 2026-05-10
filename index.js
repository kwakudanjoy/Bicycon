const profile = document.querySelector(".profile");
const ProfileImage = document.querySelector(".profile > img");
const UserIcon = document.querySelector(".user");
const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");
const keySearch = document.querySelector(".key-search");
const Main = document.querySelector(".main");
const Auth = document.querySelector("#auth");

const Loading = document.querySelector("#loading-overlay");

const NoFoundProduct = document.querySelector(".no-found-products");
const NoInternet = document.querySelector(".no-internet");
const OrderSuccess = document.querySelector(".success-overlay");

//Buying cart
const Cart_Overlay = document.querySelector(".cart-overlay"); // whole cart
const Cart_close = Cart_Overlay.querySelector(".cart-close-btn");
const Cart_Order_Minus = Cart_Overlay.querySelector(".minus");
const Cart_Order_Quantity = Cart_Overlay.querySelector(".qty-number");
const Cart_Order_Add = Cart_Overlay.querySelector(".plus");
const Cart_Buy_Order = Cart_Overlay.querySelector(".cart-buy-btn");
const Car_Total_Amount = Cart_Overlay.querySelector(".total-amount");
let unitPrice = 0; // store this when item loads
let counryCode = null;
const toast = document.querySelector(".toast");
const toastIcon = document.querySelector(".toast-icon > i");
const toastHeader = document.querySelector(".toast-content > h4");
const toastText = document.querySelector(".toast-text");

const input = document.querySelector(".customer-number-input");

const ipAddress = "https://reasonably-sink-weekend-retrieved.trycloudflare.com";
//const ipAddress = "http://10.66.103.228:8080";
//const ipAddress = "http://localhost:8080";
// Initially hide elements
const User = JSON.parse(localStorage.getItem("user") || "null");

document.addEventListener("DOMContentLoaded", async () => {
    toast.classList.add("hide");
    Loading.style.display = "flex";
    await Insert_Categories();
    Loading.style.display = "none";
    const storedCategories = getLocalCategories();
    keySearch.firstChild.classList.add("selected");
    await GetProducts(storedCategories[0]);
});

function showToast(icon, header, text, iconColor) {
    toastIcon.className = "toast-icon"; // safe reset
    toastIcon.className = "";
    icon.split(" ").forEach(cls => {
        toastIcon.classList.add(cls);
    });

    toastIcon.style.color = iconColor;
    toastHeader.textContent = header;
    toastText.textContent = text;
    toast.classList.remove("hide");

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
    }, 3000);
}

async function Load_Image(Url) {
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
    if (User && User.profilePic) {
        UserIcon.style.display = "none";
        profile.style.display = "block";
        ProfileImage.src = `${ipAddress}/profile/${User.profilePic}`;

    } else {
        UserIcon.style.display = "flex";
        profile.style.display = "none";  // use correct variable
        ProfileImage.src = "https://via.placeholder.com/35"; // optional fallback
    }
}

CheckUser();

keySearch.addEventListener("click", async (e) => {
    const Key = e.target.closest(".key");
    if (!Key) return;

    document.querySelectorAll(".key").forEach(el => {
        el.classList.remove("selected");
    });

    Key.classList.add("selected");
    const p = Key.querySelector("p");

    Loading.style.display = "flex";
    await GetProducts(p.textContent);
    Loading.style.display = "none";
});

let searchOpen = false;

searchIcon.addEventListener("click", () => {

    if (!searchOpen) {
        searchInput.style.display = "block";
        keySearch.style.display = "none";
        searchInput.focus();
        searchOpen = true;
        return;
    }

    let input = searchInput.value.trim();

    if (input !== "") {
        MakeSearch(input); // run search
    } else {
        searchInput.style.display = "none";
        keySearch.style.display = "flex";
        searchInput.value = "";
        searchOpen = false;
    }
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        let input = searchInput.value.trim();

        if (input !== "") {
            MakeSearch(input);
        }
    }
});

Auth.addEventListener("click", () => {

    if (User && User.account_completed === "YES") {

        window.location.href = "/main/main.html"
        window.history.clear();
    } else {
        window.location.href = "/auth/auth.html"
    }
});

// search algorithm
async function MakeSearch(Input) {
    let Payload = {
        INSTRUCTION: "SEARCH",
        input: Input
    }

    let products = null;
    Loading.style.display = "flex";

    NoFoundProduct.style.display = "none";
    NoInternet.style.display = "none";
    Main.style.display = "none";

    try {
        products = await fetchData(Payload);
    } catch (err) {
        NoInternet.style.display = "flex";
    }

    if (Array.isArray(products) && products.length > 0) {
        Loading.style.display = "none";
        // SUCCESS: We have products
        Main.innerHTML = "";
        Main.style.display = "grid";
        const fragment = document.createDocumentFragment();

        products.forEach(prod => {
            const ProductCard = document.createElement("div");
            ProductCard.className = "product-card";
            ProductCard.dataset.productId = prod.prodID;
            // Note: Removed the redundant nested div.product-card inside the innerHTML
            ProductCard.innerHTML = `
            <div class="product-image">
                <img src="${ipAddress}/products/${prod.ImageUrl}" alt="image" class="prod-img">
            </div>
            <div class="product-info">
                <div class="retailer">
                    <img src="${ipAddress}/profile/${prod.profilePic}" 
                        alt="logo" 
                        class="retailer_profile_pic"
                        onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png';">
                    <div class="user-detail">
                        <span class="name">${prod.RetailerName}</span>
                        <span class="retailerID">${prod.RetailerID}</span>
                    </div>
                    <div class="view-page">
                        Visit Store <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </div>
                </div>
                <h4 class="product-name">${prod.Name}</h4>
                <h3 class="product-price">${prod.currencyCode} : ${prod.Price}</h3>
                <p class="product-description">${prod.Description}</p>
                <div class="prouduct-cart-bottom">
                    <p class="posted-at">posted ${prod.postedAt}</p>
                    <button class="cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            </div>`;
            fragment.appendChild(ProductCard);
        });

        Main.appendChild(fragment);

    } else if (Array.isArray(products) && products.length === 0) {
        // EMPTY: It is an array, but nothing is in it
        NoFoundProduct.style.display = "flex";
        Loading.style.display = "none";
    }
}

async function Insert_Categories() {
    const keySearch = document.querySelector(".key-search");
    const storedCategories = getLocalCategories();

    // Check internet connection by pinging server
    let online = true;
    try {
        const pingResponse = await fetchData({ INSTRUCTION: "PING" });
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

    // await if Get is async
    // 1. First, hide all states to "reset" the view
    NoFoundProduct.style.display = "none";
    NoInternet.style.display = "none";
    Main.style.display = "none";

    let products = null;

    try {
        products = await fetchData(Payload);

    } catch (err) {
        NoInternet.style.display = "flex";
    }

    if (Array.isArray(products) && products.length > 0) {
        // SUCCESS: We have products
        Main.innerHTML = "";
        Main.style.display = "grid";
        const fragment = document.createDocumentFragment();

        products.forEach(prod => {
            const ProductCard = document.createElement("div");
            ProductCard.className = "product-card";
            ProductCard.dataset.productId = prod.prodID;
            // Note: Removed the redundant nested div.product-card inside the innerHTML
            ProductCard.innerHTML = `
            <div class="product-image">
                <img src="${ipAddress}/products/${prod.ImageUrl}" alt="image" class="prod-img">
            </div>
            <div class="product-info">
                <div class="retailer">
                    <img src="${ipAddress}/profile/${prod.profilePic}" 
                        alt="logo" 
                        class="retailer_profile_pic"
                        onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png';">
                    <div class="user-detail">
                        <span class="name">${prod.RetailerName}</span>
                        <span class="retailerID">${prod.RetailerID}</span>
                    </div>
                    <div class="view-page">
                        Visit Store <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </div>
                </div>
                <h4 class="product-name">${prod.Name}</h4>
                <h3 class="product-price">${prod.currencyCode} : ${prod.Price}</h3>
                <p class="product-description">${prod.Description}</p>
                <div class="prouduct-cart-bottom">
                    <p class="posted-at">posted ${prod.postedAt}</p>
                    <button class="cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            </div>`;
            fragment.appendChild(ProductCard);
        });

        Main.appendChild(fragment);

    } else if (Array.isArray(products) && products.length === 0) {
        // EMPTY: It is an array, but nothing is in it
        NoFoundProduct.style.display = "flex";
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

        let ProductID = productCard.dataset.productId;

        let Payload = {
            INSTRUCTION: "GET-RETAILER-EMAIL & PHONE",
            RetailerID: retailerID,
            productId: ProductID
        }

        try {
            Loading.style.display = "flex";
            let Result = await fetchData(Payload);
            if (Result) {
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
                Car_Total_Amount.textContent = productPrice;
                unitPrice = parseFloat(productPrice.replace(/[^\d.]/g, ""));
                counryCode = productPrice.split(":")[0].trim();

                Cart_Overlay.querySelector(".cart-buy-btn").onclick = () => {

                    let quantity = parseInt(Cart_Overlay.querySelector(".qty-number").textContent);

                    const Purchase_Overlay = document.querySelector(".payment-overlay");
                    const Customer_Numer_Input = Purchase_Overlay.querySelector(".customer-number-input");

                    const Purchase_Btn = Purchase_Overlay.querySelector(".purchase-btn");

                    const Cancel_Purchase = Purchase_Overlay.querySelector(".cancel-purchase");
                    Purchase_Overlay.querySelector(".customer-number-input").value = null;

                    Cart_Overlay.style.display = "none";
                    Purchase_Overlay.style.display = "flex";


                    Cancel_Purchase.onclick = () => {
                        Cart_Overlay.style.display = "flex";
                        Purchase_Overlay.style.display = "none";
                    };


                    Purchase_Btn.addEventListener("click", async () => {
                        if (!iti.isValidNumber()) {
                            alert("Please enter a valid phone number");
                            return;
                        }

                        let Phone = iti.getNumber();
                        let newProductPrice = parseFloat(productPrice.replace(/[^\d.]/g, ""));
                        let Payload = {
                            INSTRUCTION: "PLACE-ORDER",
                            ProductId: ProductID,
                            Quantity: quantity,
                            CustomerPhone: Phone,
                            ProductName: productName,
                            ProductPrice: newProductPrice
                        }

                        let Result = null;

                        Loading.style.display = "flex";
                        try {
                            Result = await fetchData(Payload);
                        } catch (err) {
                            showToast("fa-solid fa-shopping-cart", "Oder Placement", "Error ocured", "red");
                        }

                        if (Result && Result.status === "OK") {
                            Loading.style.display = "none";
                            Purchase_Overlay.style.display = "none";
                            OrderSuccess.style.display = "flex";
                            OrderSuccess.querySelector("#display-order-id").textContent = "#" + Result["orderID"];
                        }
                        // handle purchase
                    });
                };
            }
        } catch (err) {
            showToast(
                "fa-solid fa-exclamation",
                "Error",
                "Sorry error occurred",
                "red"
            );
            Loading.style.display = "none";
        }

        //alert(retailerID);

    } else if (e.target.closest(".view-page")) {
        const productCard = e.target.closest(".product-card");
        const AccountOverlay = document.querySelector(".account-overlay");

        let Retailer_ID = productCard.querySelector(".retailerID").textContent;
        let Retailer_Name = productCard.querySelector(".name").textContent;

        let Payload = {
            INSTRUCTION: "GET-PROD-BASE-ON-ID",
            Retailer_ID: Retailer_ID
        };

        let Result = null;

        Loading.style.display = "flex";
        try {
            Result = await fetchData(Payload);
        } catch (err) {
            showToast(
                "fa-solid fa-wifi",
                "Connection Error",
                "Sorry error occurred",
                "red"
            );
        }

        if (Result) {
            Loading.style.display = "none";

            let Account_Info = Result["Account_Info"];
            let Account_Products = Result["Account_Products"];

            if (Array.isArray(Account_Products) && Account_Products.length !== 0) {
                AccountOverlay.querySelector(".view-products").innerHTML = "";

                const fragment = document.createDocumentFragment();

                Account_Products.forEach(product => {
                    const ProductCard = document.createElement("div");
                    ProductCard.className = "a-product";
                    ProductCard.dataset.productId = product.Id;

                    ProductCard.innerHTML = `
                    <img src="${ipAddress}/products/${product.Url}" alt="">
                    <p class="view-prod-name">${product.name}</p>
                    <p class="view-prod-price">${product.currencyCode}: ${product.price}</p>
                    <p class="view-prod-description">${product.description}</p>
                    <div class="prouduct-cart-bottom">
                       <p class="posted-at">Posted ${product.postedAt}</p>
                       <div class="order"><i class="fa-solid fa-shopping-cart"></i></div>
                    </div>
                `;

                    fragment.appendChild(ProductCard);
                });



                AccountOverlay.querySelector(".view-products").appendChild(fragment);
                AccountOverlay.querySelector(".account-pro-pic").style.display = "flex";
                if (Account_Info && Account_Info.ProfilePic) {

                    AccountOverlay.querySelector(".account-pro-pic>img").style.display = "flex";
                    AccountOverlay.querySelector(".account-pro-pic>img").src =
                        `${ipAddress}/profile/${Account_Info.ProfilePic}`;
                    AccountOverlay.querySelector(".account-user").style.display = "none";
                } else {
                    AccountOverlay.querySelector(".account-pro-pic>img").style.display = "none";
                    AccountOverlay.querySelector(".account-user").style.display = "flex";
                }

                AccountOverlay.querySelector(".my-account-name").textContent = Retailer_Name;
                AccountOverlay.querySelector(".my-account-id").textContent = Retailer_ID;
                AccountOverlay.querySelector(".my-account-email").textContent = Account_Info.Email;
                AccountOverlay.querySelector(".my-account-phone").textContent = Account_Info.Phone;

                AccountOverlay.style.display = "flex";

                AccountOverlay.querySelector(".to-bottom > .fa-phone").addEventListener("click", () => {
                    let Phone = Account_Info.Phone;
                    window.location.href = `tel:${Phone}`;
                });

                AccountOverlay.querySelector(".view-products").addEventListener("click", async e => {
                    if (e.target.closest(".order")) {

                        const productCard = e.target.closest(".a-product");

                        if (!productCard) {
                            console.warn("Product card not found");
                            return;
                        }

                        // 🔥 SAFE EXTRACTION
                        const productName = productCard.querySelector(".view-prod-name")?.textContent || "";
                        const productPrice = productCard.querySelector(".view-prod-price")?.textContent || "0";
                        const productDescription = productCard.querySelector(".view-prod-description")?.textContent || "";
                        const productImage = productCard.querySelector(".a-product > img")?.src || "";


                        const ProductID = productCard.dataset.productId;

                        if (!ProductID) {
                            console.warn("Missing product ID");
                            return;
                        }

                        // 🔥 Populate UI safely
                        const profileImg = Cart_Overlay.querySelector(".cart-retailer__image");
                        const profilePicData = Account_Info.ProfilePic;

                        // Check if profilePic is valid and not the string "null"
                        if (profilePicData && profilePicData !== "null" && profilePicData !== "undefined") {
                            profileImg.src = `${ipAddress}/profile/${profilePicData}`;
                        } else {
                            // If no data, go straight to the fallback icon
                            profileImg.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                        }

                        Cart_Overlay.querySelector(".cart-product__image").src = productImage;
                        Cart_Overlay.querySelector(".cart-product__name").textContent = productName;
                        Cart_Overlay.querySelector(".cart-product__price").textContent = productPrice;
                        Cart_Overlay.querySelector(".cart-product__description").textContent = productDescription;

                        Cart_Overlay.querySelector(".cart-retailer__name").textContent = Retailer_Name;
                        Cart_Overlay.querySelector(".cart-retailer__email").textContent = Account_Info.Email;
                        Cart_Overlay.querySelector(".cart-retailer__phone").textContent = Account_Info.Phone;
                        Cart_Overlay.style.zIndex = "10000";

                        let Payload = {
                            INSTRUCTION: "INFLATE-TRY-TO-BUY",
                            productID: ProductID
                        }

                        let Result = null;
                        try {
                            Loading.style.display = "flex";
                            Loading.style.zIndex = "10100";
                            Result = await fetchData(Payload);
                            Loading.style.display = "none";
                            Loading.style.zIndex = "9999";
                        } catch (err) {
                            showToast(
                                "fa-solid fa-exclamation",
                                "Error",
                                "Sorry error occurred",
                                "red"
                            );
                            return;
                        }

                        if (Result && Result.status === "OK") {
                            Cart_Overlay.style.display = "flex";
                        }

                        // 🔥 Reset values
                        Cart_Overlay.querySelector(".qty-number").textContent = "1";

                        unitPrice = parseFloat(productPrice.replace(/[^\d.]/g, ""));
                        counryCode = productPrice.split(":")[0].trim();

                        Car_Total_Amount.textContent = productPrice;

                        const Purchase_Overlay = document.querySelector(".payment-overlay");
                        const Purchase_Btn = Purchase_Overlay.querySelector(".purchase-btn");
                        const Cancel_Purchase = Purchase_Overlay.querySelector(".cancel-purchase");

                        // 🔥 REMOVE OLD EVENT (VERY IMPORTANT)
                        Purchase_Btn.onclick = null;

                        Cart_Overlay.querySelector(".cart-buy-btn").onclick = () => {

                            let quantity = parseInt(
                                Cart_Overlay.querySelector(".qty-number").textContent
                            ) || 1;

                            Purchase_Overlay.style.display = "flex";
                            Purchase_Overlay.style.zIndex = "10000";
                            Cart_Overlay.style.display = "none";

                            Cancel_Purchase.onclick = () => {
                                Cart_Overlay.style.display = "flex";
                                Purchase_Overlay.style.display = "none";
                            };

                            Purchase_Btn.onclick = async () => {

                                if (!iti.isValidNumber()) {
                                    alert("Please enter a valid phone number");
                                    return;
                                }

                                let Phone = iti.getNumber();

                                let Payload = {
                                    INSTRUCTION: "PLACE-ORDER",
                                    ProductId: ProductID,
                                    Quantity: quantity,
                                    CustomerPhone: Phone,
                                    ProductName: productName,
                                    ProductPrice: unitPrice
                                };

                                try {
                                    Loading.style.display = "flex";

                                    let Result = await fetchData(Payload);

                                    Loading.style.display = "none";

                                    if (Result && Result.status === "OK") {
                                        Purchase_Overlay.style.display = "none";
                                        OrderSuccess.style.display = "flex";
                                        OrderSuccess.style.zIndex = "10000";
                                        OrderSuccess.querySelector("#display-order-id").textContent = "#" + Result["orderID"];
                                    }

                                } catch (err) {
                                    Loading.style.display = "none";
                                    showToast(
                                        "fa-solid fa-exclamation",
                                        "Error",
                                        "Error Occured",
                                        "red"
                                    );
                                }
                            };
                        };
                    }
                });
            }
        }

        AccountOverlay.querySelector(".cancel-product-view").addEventListener("click", () => {
            AccountOverlay.style.display = "none";
        })
    }
});

OrderSuccess.querySelector(".success-close-btn").addEventListener("click", () => {
    OrderSuccess.style.display = "none";
});

// cart execution
Cart_close.addEventListener("click", () => {
    Cart_Overlay.style.display = "none";
});

Cart_Order_Minus.addEventListener("click", () => {
    let Orderquantity = parseInt(Cart_Order_Quantity.textContent.trim());
    if (Orderquantity > 1) {
        Orderquantity--;
        Cart_Order_Quantity.textContent = Orderquantity;
        let total = unitPrice * Orderquantity;
        Car_Total_Amount.textContent = `${counryCode} : ${total}`;
    }
});

Cart_Order_Add.addEventListener("click", () => {
    let Orderquantity = parseInt(Cart_Order_Quantity.textContent.trim());
    Orderquantity++;
    Cart_Order_Quantity.textContent = Orderquantity;
    let total = unitPrice * Orderquantity;
    Car_Total_Amount.textContent = `${counryCode} : ${total}`;
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
        Loading.style.display = "none";
        throw err;
    }
}

const iti = window.intlTelInput(input, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        fetch("https://ipapi.co/json")
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback("us"));
    },
    separateDialCode: true,
    useFullscreenPopup: false,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.5/build/js/utils.js"
});

