// ====== ELEMENTS ======
const ProductSection = document.querySelector(".product-section");
const Products = document.querySelector(".products");
const Orders = document.querySelector(".orders");
const ProductList = document.querySelector(".product-list");
const NoProduct = document.querySelector(".no-product-section");
const EdithProduct = document.querySelector(".edith-prod-overlay");
const AddProduct = document.querySelector(".add-prod-overlay");
const ProductCount = document.querySelector(".product-count > p");
const Plus = document.querySelector(".plus");
const Back = document.querySelector(".back");
const UserIcon = document.querySelector(".user-icon");
const ProfileImg = document.querySelector(".pro-pic > img");
const Pro_Pic = document.querySelector(".pro-pic");
const MyProfile = document.querySelector(".my-profile");

//Variable for add iv 
const prodProfile = AddProduct.querySelector('.prod-profile');
const prodIcon = prodProfile.querySelector('.prod-icon');
const prodImage = prodProfile.querySelector('.prod-pro-pic');
const ProdName = document.querySelector(".prod-name");
const cameraBtn = AddProduct.querySelector('.camera');
const cancelBtn = AddProduct.querySelector('.cancel');
const fileInput = AddProduct.querySelector('.file-input');
const AddNewProd = AddProduct.querySelector(".add-btn");
const ProdPrice = AddProduct.querySelector(".prod-price");
const PordCart = AddProduct.querySelector(".custom-select");
const ProdDiscription = AddProduct.querySelector(".prod-description");
const CancelNewProd = AddProduct.querySelector(".cancel-btn");
const Profile = document.querySelector(".profile");

const Loading = document.querySelector("#loading-overlay");

//Account Edithing element
const Edit_User_Icon = document.querySelector(".edith-user-icon"); // for displaying no file pic
const Display_Profile_Contanner = document.querySelector(".profile-pic") // profile containner
const Display_Profile_Image = document.querySelector(".profile-pic > img");
const PickNew_Image = document.querySelector(".select-new-profile"); // camera for piccking images
const PickNew_Image_Container = document.querySelector(".profile-actions");
const NewImage_Input = document.querySelector("#profile-file"); // input for taking image file for device
const Upload_New_Image = document.querySelector(".upload-new-profile");
const Edith_OldPro_file_Image = document.querySelector(".edith-old-profile");
const Cancel_New_Profile_Update = document.querySelector(".cance-profile-update");
const Display_Account_Id = document.querySelector(".display-account-id");
const Display_Account_Name = document.querySelector(".display-account-name");
const Display_Old_Email = document.querySelector(".display-email");
const New_Email_Input = document.querySelector(".new-email-input");
const Upload_New_Email = document.querySelector(".upload-new-email");
const Edit_Old_Email = document.querySelector(".edith-old-email");
const Cancel_New_Email_Upload = document.querySelector(".cancel-email-update");
const Display_Old_Phone = document.querySelector(".display-phone");
const New_Phone_Input = document.querySelector(".new-phone-input");
const Upload_New_Phone = document.querySelector(".upload-new-phone");
const Edit_Old_Phone = document.querySelector(".edith-old-phone");
const Cancel_New_Phone_Upload = document.querySelector(".cancel-phone-update");
const Upgrade_Overlay = document.querySelector(".upgrade-overlay");
const Upgrade = document.querySelector(".upgrade-btn");
const PlacedOrdersList = document.querySelector(".order-section");

const NoInternet = document.querySelector(".no-internet");
const NoFoundOrders = document.querySelector(".no-found-products");


const LogOut = document.querySelector(".log-out > button");

// ====== CONFIG ======
const User = JSON.parse(localStorage.getItem("user") || '{}');
//const ipAddress = "https://generic-sbjct-fancy-laugh.trycloudflare.com"; //"http://localhost:8080";
const ipAddress = "http://10.66.103.228:8080";
//const ipAddress = "http://localhost:8080";

// ====== DISPLAY FUNCTIONS ======

function showProducts() {
    NoProduct.style.display = "none";
    ProductList.style.display = "grid";
    Products.classList.add("active");
    Plus.style.display = "flex";
    MyProfile.style.display = "none";
    NoFoundOrders.style.display = "none";
    NoInternet.style.display = "none";

}

function showAddProduct() {
    AddProduct.style.display = "flex";
    // Reset image preview
    prodImage.src = '';
    prodImage.style.display = 'none';
    prodIcon.style.display = 'flex';
    cancelBtn.style.display = 'none';
    fileInput.value = '';
}

function showMyProfile() {
    ProductSection.style.display = "none";
    MyProfile.style.display = "block";
    Profile.classList.add("active-profile");
    Products.classList.remove("active");
    Orders.classList.remove("active");
    NoFoundOrders.style.display = "none";
    NoInternet.style.display = "none";
}

function SetProfile() {

    if (User && User.profilePic) {
        UserIcon.style.display = "none";
        Pro_Pic.style.display = "flex";
        ProfileImg.src = `${ipAddress}/profile/${User["profilePic"]}`;
    } else {
        UserIcon.style.display = "flex";
        Pro_Pic.style.display = "none";
    }
}

function showOrders() {
    ProductSection.style.display = "none";
    MyProfile.style.display = "none";
    PlacedOrdersList.style.display = "grid";
    NoFoundOrders.style.display = "none";
    NoInternet.style.display = "none";
}


async function Load_Image(Url) {

    const res = await fetch(`${ipAddress}/profile/${User["profilePic"]}`, {
        headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });

    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
}

SetProfile();

Back.addEventListener("click", () => {
    if (!window.history.back()) {
        location.href = "/index.html";
        window.history.clear();
    } else {
        window.history.back();
        window.history.clear();
    }
});

Products.addEventListener("click", () => {
    Profile.classList.remove("active-profile");
    //e.preventDefault();
    if (ProductList.innerHTML === "") {
        getMyProducts();
    } else {
        ProductSection.style.display = "flex";
        MyProfile.style.display = "none";
        PlacedOrdersList.style.display = "none";
        NoFoundOrders.style.display = "none";
        NoInternet.style.display = "none";
    }

});

Orders.addEventListener("click", () => {
    Profile.classList.remove("active-profile");
    if (PlacedOrdersList.children.length === 0) {
        getPlacedOrders();
    } else {
        ProductSection.style.display = "none";
        MyProfile.style.display = "none";
        PlacedOrdersList.style.display = "grid";
        NoOrderSection.style.display = "none";
    }
});

// ====== INITIAL LOAD ======

window.addEventListener("load", () => {
    setTimeout(() => {
        getMyProducts();
    }, 0);
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

async function UploadFileWithData(formData) {
    try {
        const response = await fetch(`${ipAddress}/api/file`, {
            method: "POST",
            body: formData
        });

        // ✅ Only fail if the network response itself failed
        if (!response.ok) {
            throw new Error(`Network Error: ${response.status}`);
        }

        // Try to parse JSON, but fallback to text if server returns something else
        let result;
        const text = await response.text();
        console.log("RAW RESPONSE:", text);

        try {
            result = JSON.parse(text); // attempt to parse JSON
        } catch {
            result = text; // fallback to raw text
        }

        // ✅ Return whatever server gave back
        return result;

    } catch (err) {
        console.error("Upload error:", err);
        throw err; // let caller decide what to do
    }
}


// ====== GET MY PRODUCTS ======
async function getMyProducts() {

    let User = JSON.parse(localStorage.getItem("user")); // get user data
    //Loading.style.display = "flex";
    if (!User["User-ID"]) return showNoProduct();

    let payload = {
        INSTRUCTION: "GET-MY-PRODUCTS",
        User_id: User["User-ID"]

    };

    Loading.style.display = "flex";

    const productList = await fetchData(payload);
    if (Array.isArray(productList) && productList.length > 0) {

        Loading.style.display = "none";

        //Loading.style.display = "flex";
    } else {
        Loading.style.display = "none";
    }

    ProductList.innerHTML = "";
    let count = 0;
    const fragment = document.createDocumentFragment();

    productList.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("list-card");
        card.innerHTML = `
            <img src="${ipAddress}/products/${prod.Url}" alt="image" class="prod-img">
            <p class="pord-name">${prod.name}</p>
            <p class="prod-id">${prod.Id}</p>
            <p class="prod-price">GHC: ${prod.price}</p>
            <p class="final-prod-description">${prod.description}</p>
            <div class="edith-delete-prod">
                <div class="edith-prod"><i class="fa-solid fa-pen"></i>Edit</div>
                <div class="delete-prod"><i class="fa-solid fa-x"></i>Delete</div>
            </div>
            <p class="posted-at">posted ${prod.postedAt}</p>
        `;
        fragment.appendChild(card);
        count++;
    });

    ProductList.appendChild(fragment);
    ProductCount.textContent = count;
    showProducts();
}
async function getPlacedOrders() {

    let User = JSON.parse(localStorage.getItem("user"));
    if (!User || !User["User-ID"]) return showNoProduct();

    let payload = {
        INSTRUCTION: "GET-MY-ORDERS",
        User_id: User["User-ID"]
    };

    Loading.style.display = "flex";

    let OrderList = [];

    try {
        OrderList = await fetchData(payload);

        Loading.style.display = "none";

        // ❌ No data case
        if (!Array.isArray(OrderList) || OrderList.length === 0) {
            ProductSection.style.display = "none";
            MyProfile.style.display = "none";
            PlacedOrdersList.style.display = "none";
            NoFoundOrders.style.display = "flex";
            return;
        }

    } catch (error) {
        alert(error);
        console.error("Network error:", error);

        Loading.style.display = "none";
        NoInternet.style.display = "flex";
        return;
    }

    // ✅ ONLY runs if data is valid
    PlacedOrdersList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    OrderList.forEach(ord => {

        let status = (ord.status || "").toLowerCase().trim();

        const card = document.createElement("div");
        card.classList.add("order-cart");

        card.innerHTML = `
            <div class="order-cart-top">

                <div class="order-header">
                    <span class="order-index">#${ord.index}</span>
                    <span class="order-id">Order #${ord.orderId}</span>
                    <span class="order-date">${ord.date}</span>
                    <span class="order-time">${ord.time}</span>
                </div>

                <div class="product-info">
                    <h4 class="product-name">${ord.productName}</h4>
                    <span class="product-id">Product id: #${ord.productId}</span>
                </div>

                <div class="customer-phone">
                    <span class="phone">${ord.customerPhone}</span>
                    <div class="phone-icon"><i class="fa-solid fa-phone"></i></div>
                </div>

                <div class="order-details">
                    <div class="detail">
                        <span>Quantity</span>
                        <strong>${ord.quantity}</strong>
                    </div>

                    <div class="detail">
                        <span>Price</span>
                        <strong>GHC: ${ord.amountPerProduct}</strong>
                    </div>

                    <div class="detail total">
                        <span>Total</span>
                        <strong>GHC: ${ord.totalAmount}</strong>
                    </div>
                </div>

            </div>

            <div class="order-cart-actions">
                <button type="button" class="accept-btn">Accept</button>
                <button type="button" class="reject-btn">Reject</button>
            </div>

            <div class="order-cart-status">
                <span class="status accepted">Accepted</span>
                <span class="status rejected">Rejected</span>
            </div>
        `;

        const actions = card.querySelector(".order-cart-actions");
        const statusBox = card.querySelector(".order-cart-status");
        const accepted = card.querySelector(".status.accepted");
        const rejected = card.querySelector(".status.rejected");

        actions.style.display = "none";
        statusBox.style.display = "none";
        accepted.style.display = "none";
        rejected.style.display = "none";

        if (!status) {
            actions.style.display = "flex";
        } else if (status === "accepted") {
            statusBox.style.display = "block";
            accepted.style.display = "inline-block";
        } else if (status === "rejected") {
            statusBox.style.display = "block";
            rejected.style.display = "inline-block";
        }

        fragment.appendChild(card);
    });

    PlacedOrdersList.appendChild(fragment);

    showOrders();
}

PlacedOrdersList.addEventListener("click", async (e) => {
    const Item = e.target.closest(".order-cart");


    let raw = Item.querySelector(".order-id").textContent;
    let orderId = raw.replace("Order #", "").trim();

    if (!Item) return;
    if (e.target.closest(".accept-btn")) {
        let Payload = {
            INSTRUCTION: "SET-ORDER-STATUS",
            OrderID: orderId,
            status: "accepted"
        }

        Loading.style.display = "flex";
        let Result = await fetchData(Payload);
        if (Result && Result.status === "OK") {
            Loading.style.display = "none";
            getPlacedOrders();
        }

    } else if (e.target.closest(".reject-btn")) {
        let Payload = {
            INSTRUCTION: "SET-ORDER-STATUS",
            OrderID: orderId,
            status: "rejected"
        }

        Loading.style.display = "flex";
        let Result = await fetchData(Payload);
        if (Result && Result.status === "OK") {
            Loading.style.display = "none";
            getPlacedOrders();
        }
    } else if (e.target.closest(".phone-icon")) {

        const phone = Item.querySelector(".phone").textContent.trim();

        window.location.href = `tel:${phone}`;
    }
});

async function Insert_Categories() {
    const selectWrapper = document.querySelector(".custom-select");
    const selected = selectWrapper.querySelector(".selected");
    const optionsContainer = selectWrapper.querySelector(".options");

    const storedCategories = getLocalCategories();

    let online = true;

    // Check internet connection
    try {
        const pingResponse = await Get({ INSTRUCTION: "PING" });
        Get
        if (!pingResponse || pingResponse.status !== "OK") online = false;
    } catch {
        online = false;
    }

    let categories = [];

    if (online) {
        // Online → fetch from server
        try {
            const data = await fetchData({ INSTRUCTION: "GET-CATEGORIES" });
            if (data && data.Product_Categories) {
                categories = data.Product_Categories;
                saveLocalCategories(categories);
            } else if (storedCategories) {
                categories = storedCategories;
            }
        } catch (err) {
            console.error("Failed to fetch categories online:", err);
            if (storedCategories) categories = storedCategories;
        }

    } else {
        // Offline → use localStorage
        if (storedCategories) categories = storedCategories;
    }

    // Fallback if no categories
    if (!categories || categories.length === 0) {

        optionsContainer.innerHTML = `<div class="option">No categories available</div>`;
        selected.textContent = "No categories available";
        return;
    }

    // Always add "All" at the top
    categories = [...categories.filter(cat => cat && cat !== "All")];

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Populate custom dropdown
    categories.forEach(cat => {
        const option = document.createElement("div");
        option.classList.add("option");
        option.textContent = cat;
        optionsContainer.appendChild(option);

        // Handle option click
        option.addEventListener("click", () => {
            selected.textContent = cat;

            // ✅ ADD THIS LINE (VERY IMPORTANT)
            selectWrapper.dataset.value = cat;

            optionsContainer.style.display = "none";

            console.log("Selected category:", cat);
        });
    });

    // Toggle dropdown when clicking the box
    selected.addEventListener("click", () => {
        optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!selectWrapper.contains(e.target)) {
            optionsContainer.style.display = "none";
        }
    });
}

// Save categories to localStorage
function saveLocalCategories(categories) {
    try {
        localStorage.setItem("Product-Categories", JSON.stringify(categories));
    } catch (err) {
        console.warn("localStorage not available:", err);
    }
}

// Get categories from localStorage
function getLocalCategories() {
    try {
        const stored = localStorage.getItem("Product-Categories");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

// ====== ADD PRODUCT UI ======
Plus.addEventListener("click", showAddProduct);
Loading.style.display = "flex";
Insert_Categories();
Loading.style.display = "none";
// ====== IMAGE HANDLING ======
cameraBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            prodImage.src = evt.target.result;
            prodImage.style.display = 'block';
            prodIcon.style.display = 'none';
            cancelBtn.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
});

cancelBtn.addEventListener('click', () => {

    prodImage.src = '';
    prodImage.style.display = 'none';
    prodIcon.style.display = 'flex';
    cancelBtn.style.display = 'none';
    fileInput.value = '';


});

AddNewProd.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get user from localStorage
    let User = JSON.parse(localStorage.getItem("user"));
    if (!User) return alert("User not logged in!");

    // DOM elements
    const selectWrapper = document.querySelector(".custom-select");
    const selected = selectWrapper.querySelector(".selected");
    const file = fileInput.files[0];
    const Value = selectWrapper.dataset.value;

    // Validation
    if (!file || !ProdName.value.trim() || !ProdPrice.value.trim() || Value === "Select Category" || !ProdDiscription.value.trim()) {
        alert("Fill all inputs and select a category for your new product");
        return;
    }

    // Prepare payload
    const payload = {
        INSTRUCTION: "UPLOAD-NEW-PROD",
        owner: User["User-ID"],
        name: ProdName.value.trim(),
        price: ProdPrice.value.trim(),
        Category: Value,
        Description: ProdDiscription.value.trim()
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("Data", JSON.stringify(payload));

    try {
        Loading.style.display = "flex";
        const uploadResult = await UploadFileWithData(formData);

        if (uploadResult && uploadResult.status === "OK") {
            // Hide loading
            Loading.style.display = "none";

            // Refresh products
            getMyProducts();

            // Hide add product modal
            AddProduct.style.display = "none";

            // Clear input fields
            ProdName.value = "";
            ProdPrice.value = "";
            ProdDiscription.value = "";
            fileInput.value = ""; // clear file input

            // Reset custom select
            selected.textContent = "Select Category";
            selectWrapper.dataset.value = "Select Category";
        } else {
            throw new Error("Upload failed or server returned an error");
        }
    } catch (err) {
        console.error(err);
        alert(err.message || "Upload failed");
        Loading.style.display = "none";
    }
});

CancelNewProd.addEventListener("click", (e) => {
    e.preventDefault();
    AddProduct.style.display = "none";
});


// GLOBAL STATE (important)
let selectedFile = null;

const fileInput1 = EdithProduct.querySelector(".prod-image-edit-file-input");
const previewImg = EdithProduct.querySelector(".prod-image-update");
const cancelImgBtn = EdithProduct.querySelector(".cancel-selected-image");
const selectImgBtn = EdithProduct.querySelector(".select-image");
const saveBtn = EdithProduct.querySelector(".save-edith");
const cancelBtn1 = EdithProduct.querySelector(".cancel-edth");

// =========================
// STATIC EVENT LISTENERS (RUN ONCE)
// =========================

// SELECT IMAGE
selectImgBtn.onclick = (e) => {
    e.preventDefault();
    fileInput1.click();
};

// CHANGE IMAGE
fileInput1.onchange = (e) => {
    selectedFile = e.target.files[0];

    if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (evt) => {
            previewImg.src = evt.target.result;
            cancelImgBtn.style.display = "flex";
        };

        reader.readAsDataURL(selectedFile);
    }

    fileInput1.value = ""; // allow reselect same file
};

// CANCEL IMAGE
cancelImgBtn.onclick = () => {
    previewImg.src = previewImg.dataset.oldImage;
    cancelImgBtn.style.display = "none";
    selectedFile = null;
};

// CLOSE MODAL
cancelBtn1.onclick = () => {
    EdithProduct.style.display = "none";
    selectedFile = null;
};

// =========================
// MAIN CLICK HANDLER
// =========================

ProductList.addEventListener("click", async (e) => {

    const Item = e.target.closest(".list-card");
    if (!Item) return;

    // =========================
    // EDIT PRODUCT
    // =========================
    if (e.target.closest(".edith-prod")) {

        selectedFile = null; // reset every time modal opens

        let Product_ID = Item.querySelector(".prod-id").textContent;
        let Old_Image = Item.querySelector(".prod-img").src;
        let Old_Name = Item.querySelector(".pord-name").textContent;
        let Old_Price = Item.querySelector(".prod-price").textContent;
        let Old_Description = Item.querySelector(".final-prod-description").textContent;

        let GET_Category_Payload = {
            INSTRUCTION: "GET-PRODUCT-CATEGORY",
            ProductID: Product_ID
        };

        Loading.style.display = "flex";

        let Result = await fetchData(GET_Category_Payload);

        Loading.style.display = "none";

        if (!Result) return;

        let Category = Result["category"];

        // SET OLD DATA
        previewImg.src = Old_Image;
        previewImg.dataset.oldImage = Old_Image;

        EdithProduct.querySelector(".edith-prod-name").value = Old_Name;
        EdithProduct.querySelector(".edith-prod-price").value = Number(Old_Price.split(" ")[1]);
        EdithProduct.querySelector(".edith-prod-category").textContent = Category;
        EdithProduct.querySelector(".edith-prod-discription").value = Old_Description;

        cancelImgBtn.style.display = "none";

        EdithProduct.style.display = "flex";

        // =========================
        // SAVE BUTTON (NO DUPLICATION)
        // =========================
        saveBtn.onclick = async () => {

            let New_Name = EdithProduct.querySelector(".edith-prod-name").value.trim();
            let New_Price = EdithProduct.querySelector(".edith-prod-price").value.trim();
            let New_Description = EdithProduct.querySelector(".edith-prod-discription").value.trim();

            // VALIDATION
            if (!New_Name || !New_Price || !New_Description) {
                alert("Please fill all fields");
                return;
            }

            let Payload = {
                INSTRUCTION: "UPDATE-PROD-DATA",
                ProductID: Product_ID,
                NewName: New_Name,
                NewPrice: New_Price,
                NewDescription: New_Description
            };

            Loading.style.display = "flex";

            // =========================
            // WITH IMAGE
            // =========================
            if (selectedFile) {

                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("Data", JSON.stringify(Payload));

                let Result = await UploadFileWithData(formData);

                Loading.style.display = "none";

                if (Result && Result.status === "OK") {
                    getMyProducts();
                    EdithProduct.style.display = "none";
                }

            }
            // =========================
            // WITHOUT IMAGE
            // =========================
            else {

                let Result = await fetchData(Payload);

                Loading.style.display = "none";

                if (Result && Result.status === "OK") {
                    getMyProducts();
                    EdithProduct.style.display = "none";
                }
            }
        };
    }

    // =========================
    // DELETE PRODUCT
    // =========================
    else if (e.target.closest(".delete-prod")) {

        let Product_ID = Item.querySelector(".prod-id").textContent;

        let Payload = {
            INSTRUCTION: "DELETE-MY-PRODUCT",
            ProductID: Product_ID
        };

        Loading.style.display = "flex";
        let Result = await fetchData(Payload);

        if (Result && Result.status === "OK") {
            getMyProducts();
        }

    }

});

Profile.addEventListener("click", () => {

    let User = JSON.parse(localStorage.getItem("user"));

    if (User) {
        //showing nessary items for fist star

        PickNew_Image_Container.style.display = "none";
        Upload_New_Image.style.display = "none";
        Cancel_New_Profile_Update.style.display = "none";
        Upload_New_Email.style.display = "none";
        Upload_New_Phone.style.display = "none";
        Cancel_New_Email_Upload.style.display = "none";
        Cancel_New_Phone_Upload.style.display = "none";
        document.querySelector(".iti").style.display = "none";

        Display_Account_Name.textContent = User["User-Name"];
        Display_Account_Id.textContent = User["User-ID"];
        Display_Old_Email.textContent = User["Email"];
        Display_Old_Phone.textContent = User["Phone"];

        if (User.profilePic) {

            Edit_User_Icon.style.display = "none";
            Display_Profile_Image.src = `${ipAddress}/profile/${User["profilePic"]}`;
            Display_Profile_Image.style.display = "block";
            Display_Profile_Contanner.style.display = "flex";
            PlacedOrdersList.style.display = "none";

        } else {

            UserIcon.style.display = "flex";
            Display_Profile_Image.style.display = "none";
            Display_Profile_Image.style.display = "none";
            PlacedOrdersList.style.display = "none";
        }

        showMyProfile(); // showing my profile
    } else {
        alert("Sorry cant find any user data because browsing data has be deleted");
        window.location.href = "/auth/auth.html";
    }
});

Edith_OldPro_file_Image.addEventListener("click", () => {
    PickNew_Image_Container.style.display = "flex";
    Cancel_New_Profile_Update.style.display = "block";
    Edith_OldPro_file_Image.style.display = "none";
});


Upload_New_Image.addEventListener("click", async () => {

    let User = JSON.parse(localStorage.getItem("user"));

    if (!User || !User["User-ID"]) {
        alert("User not found");
        return;
    }

    if (NewImage_Input.files.length > 0) {

        let Payload = {
            INSTRUCTION: "UPDATE-PROFILE",
            UserID: User["User-ID"]
        }

        const file = NewImage_Input.files[0];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("Data", JSON.stringify(Payload));

        Loading.style.display = "flex";
        const Result = await UploadFileWithData(formData);

        if (Result && Result.status === "OK") {
            Loading.style.display = "none";
            User.profilePic = Result["url"];

            localStorage.setItem("user", JSON.stringify(User));

            // reload updated user
            User = JSON.parse(localStorage.getItem("user"));

            UserIcon.style.display = "none";
            Pro_Pic.style.display = "flex";
            ProfileImg.src = `${ipAddress}/profile/${User["profilePic"]}`;

            Edit_User_Icon.style.display = "none";
            Display_Profile_Contanner.style.display = "flex";
            Display_Profile_Image.src = `${ipAddress}/profile/${User["profilePic"]}`;

        }

    } else {
        alert("nofile");
        Loading.style.display = "none";
    }
});



Cancel_New_Profile_Update.addEventListener("click", () => {

    PickNew_Image_Container.style.display = "none";
    Cancel_New_Profile_Update.style.display = "none";
    Edith_OldPro_file_Image.style.display = "block";
    Upload_New_Image.style.display = "none";
});

Cancel_New_Profile_Update.addEventListener("dbclick", () => {

});

PickNew_Image.addEventListener("click", () => {
    NewImage_Input.click();
});

NewImage_Input.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            Display_Profile_Image.src = evt.target.result;
            Display_Profile_Image.style.display = "block";
            Edit_User_Icon.style.display = "none";
            Display_Profile_Contanner.style.display = "flex";
            Upload_New_Image.style.display = "block";
        }

        reader.readAsDataURL(file);
    }
});

Edit_Old_Email.addEventListener("click", () => {
    Display_Old_Email.style.display = "none";
    New_Email_Input.style.display = "block";
    New_Email_Input.focus();
    Upload_New_Email.style.display = "block";
    Cancel_New_Email_Upload.style.display = "block"
    Edit_Old_Email.style.display = "none";

});

Upload_New_Email.addEventListener("click", async () => {
    let New_Email = New_Email_Input.value.trim();

    if (!New_Email) return alert("Please fill the email input");
    let User = JSON.parse(localStorage.getItem("user"));
    if (!User) return alert("noaccount found");

    let Payload = {
        INSTRUCTION: "UPDATE-EMAIL",
        UserID: User["User-ID"],
        NewEmail: New_Email
    }

    try {
        Loading.style.display = "flex";
        const Result = await fetchData(Payload);


        if (Result && Result.status === "OK") {

            User.Email = Result["Email"];
            localStorage.setItem("user", JSON.stringify(User));
            Loading.style.display = "none";
            Display_Old_Email.textContent = Result["Email"];
            Cancel_New_Email_Upload.click();
        }
    } catch {
        Loading.style.display = "none";
        alert("Error Updating Email");
    }


});

Cancel_New_Email_Upload.addEventListener("click", () => {
    Display_Old_Email.style.display = "block";
    New_Email_Input.style.display = "none";
    New_Email_Input.value = "";
    Upload_New_Email.style.display = "none";
    Cancel_New_Email_Upload.style.display = "none"
    Edit_Old_Email.style.display = "block";
});





const iti = window.intlTelInput(New_Phone_Input, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        fetch("https://ipapi.co")
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback("us"));
    },
    separateDialCode: true,
    // Add this line to fix the mobile positioning bug
    useFullscreenPopup: false,
    utilsScript: "https://jsdelivr.net"
});


Upload_New_Phone.addEventListener("click", async () => {

    let User = JSON.parse(localStorage.getItem("user"));

    let New_Phone = iti.getNumber();

    alert(New_Phone);
    if (User) {
        let Payload = {
            INSTRUCTION: "UPDATE-MY-PHONE",
            UserID: User["User-ID"],
            new_Phone: New_Phone
        }

        Loading.style.display = "flex";
        let Result = await fetchData(Payload);
        if (Result && Result.status === "OK") {
            User.Phone = Result["New_Phone"];
            localStorage.setItem("user", JSON.stringify(User));
            Loading.style.display = "none";
            Display_Old_Phone.textContent = Result["New_Phone"];
            Cancel_New_Phone_Upload.click();
        }
    }
});



Edit_Old_Phone.addEventListener("click", () => {
    Display_Old_Phone.style.display = "none";
    New_Phone_Input.style.display = "block";
    New_Phone_Input.value = "";
    document.querySelector(".iti").style.display = "block";
    New_Phone_Input.focus();
    Upload_New_Phone.style.display = "block";
    Cancel_New_Phone_Upload.style = "block";
    Edit_Old_Phone.style.display = "none";

});

Cancel_New_Phone_Upload.addEventListener("click", () => {
    Display_Old_Phone.style.display = "block";
    New_Phone_Input.style.display = "none";
    Upload_New_Phone.style.display = "none";
    Cancel_New_Phone_Upload.style.display = "none";
    Edit_Old_Phone.style.display = "block";
    document.querySelector(".iti").style.display = "none";
});

//logout button
LogOut.addEventListener("click", () => {
    let User = JSON.parse(localStorage.getItem("user"));
    if (User) {
        localStorage.clear("user");
        window.location.href = "/auth/auth.html"
    } else {
        window.location.href = "/auth/auth.html"
    }
});

Upgrade.addEventListener("click", () => {
    Upgrade_Overlay.style.display = "flex";

    Upgrade_Overlay.querySelector(".cancel-upgrade").addEventListener("click", () => {
        Upgrade_Overlay.style.display = "none";
    });
});

// ====== NAVIGATION ======
document.querySelectorAll('.nav > div').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav .active')?.classList.remove('active');
        item.classList.add('active');
    });
});

