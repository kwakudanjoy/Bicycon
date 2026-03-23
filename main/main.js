// ====== ELEMENTS ======
const Products = document.querySelector(".products");
const Orders = document.querySelector(".orders");
const ProductList = document.querySelector(".product-list");
const NoProduct = document.querySelector(".no-product-section");
const EdithProduct = document.querySelector(".prod-edit");
const AddProduct = document.querySelector(".add-prod");
const ProductCount = document.querySelector(".product-count > p");
const Plus = document.querySelector(".plus");
const Back = document.querySelector(".back");
const UserIcon = document.querySelector(".user-icon");
const ProfileImg = document.querySelector(".pro-pic > img");
const Pro_Pic = document.querySelector(".pro-pic");

//Variable for add iv 
const prodProfile = AddProduct.querySelector('.prod-profile');
const prodIcon = prodProfile.querySelector('.prod-icon');
const prodImage = prodProfile.querySelector('.prod-pro-pic');
const cameraBtn = AddProduct.querySelector('.camera');
const cancelBtn = AddProduct.querySelector('.cancel');
const fileInput = AddProduct.querySelector('.file-input');
const AddNewProd = AddProduct.querySelector(".add-btn");
const ProdName = AddProduct.querySelector(".prod-name");
const ProdPrice = AddProduct.querySelector(".prod-price");
const PordCart = AddProduct.querySelector(".prod-category");
const ProdDiscription = AddProduct.querySelector(".prod-description");
const CancelNewProd = AddProduct.querySelector(".cancel-btn");
const Profile = document.querySelector(".profile");

// ====== CONFIG ======
const User = JSON.parse(localStorage.getItem("user") || '{}');
const ipAddress = "https://c67e-41-204-44-211.ngrok-free.app" ; //"http://localhost:8080";

// ====== DISPLAY FUNCTIONS ======
function showNoProduct() {
    NoProduct.style.display = "block";
    ProductList.style.display = "none";
    AddProduct.style.display = "none";
    EdithProduct.style.display = "none";
    ProductCount.textContent = "0";
    Products.classList.add("active");
}

function showProducts() {
    NoProduct.style.display = "none";
    ProductList.style.display = "grid";
    AddProduct.style.display = "none";
    EdithProduct.style.display = "none";
    Products.classList.add("active");
    Plus.style.display = "flex";
}

function showAddProduct() {
    NoProduct.style.display = "none";
    ProductList.style.display = "none";
    AddProduct.style.display = "flex";
    EdithProduct.style.display = "none";
    Plus.style.display = "none";

    // Reset image preview
    prodImage.src = '';
    prodImage.style.display = 'none';
    prodIcon.style.display = 'flex';
    cancelBtn.style.display = 'none';
    fileInput.value = '';
}

function showEditProduct() {
    NoProduct.style.display = "none";
    ProductList.style.display = "none";
    AddProduct.style.display = "none";
    EdithProduct.style.display = "flex";
    Plus.style.display = "none";
}

function CheckUser(){
   
    if(User && User.profilePic){
        UserIcon.style.display = "none";
        Pro_Pic.style.display = "block";
        ProfileImg.src = `${ipAddress}/profile/${User["profilePic"]}`;
    }else{
        UserIcon.style.display = "flex";
        Pro_Pic.style.display = "none";
    }
}

CheckUser();

Back.addEventListener("click" , ()=>{
     if(!window.history.back()){
        location.href = "/index.html";
        window.history.clear();
    }else{
        window.history.back();
        
    }
});
// ====== INITIAL LOAD ======
getMyProducts();

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
        alert("Error occurred while fetching data");
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
    if (!User["User-ID"]) return showNoProduct();

    const payload = { INSTRUCTION: "GET-MY-PRODUCTS", User_id: User["User-ID"] };
    const productList = await fetchData(payload);

    if (!Array.isArray(productList) || productList.length === 0) {
        return showNoProduct();
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
        `;
        fragment.appendChild(card);
        count++;
    });

    ProductList.appendChild(fragment);
    ProductCount.textContent = count;
    showProducts();
}

// ====== ADD PRODUCT UI ======
Plus.addEventListener("click", showAddProduct);

// ====== IMAGE HANDLING ======
cameraBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
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
    e.preventDefault(); // 🔥 prevent refresh if inside form

    const file = fileInput.files[0]; // ✅ FIX 1

    if (
        !file ||
        !ProdName.value.trim() ||
        !ProdPrice.value.trim() ||
        PordCart.value === "Select Category" ||
        !ProdDiscription.value.trim()
    ) {
        alert("Fill all inputs and select a category for your new product");
        return;
    }

    const payload = {
        INSTRUCTION: "UPLOAD-NEW-PROD",
        owner: User["User-ID"],
        name: ProdName.value.trim(),
        price: ProdPrice.value.trim(),
        Category: PordCart.value.trim(),
        Description: ProdDiscription.value.trim()
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("Data", JSON.stringify(payload));

    try {
        const uploadResult = await UploadFileWithData(formData); // ✅ FIX 2

        if (uploadResult && uploadResult.status === "OK") {
            getMyProducts();
        }

    } catch (err) {
        console.error(err);
        alert("Upload failed");
    }
});

CancelNewProd.addEventListener("click",(e)=>{
    e.preventDefault();

    if (ProductList.querySelectorAll(".list-catd").length > 0) {
        showProducts();
    } else {
        showNoProduct();
    }
  
});



// ====== NAVIGATION ======
document.querySelectorAll('.nav > div').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav .active')?.classList.remove('active');
        item.classList.add('active');
    });
});

