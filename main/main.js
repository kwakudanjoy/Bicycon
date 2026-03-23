// ====== ELEMENTS ======
const ProductSection = document.querySelector(".product-section");
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
const MyProfile = document.querySelector(".my-profile");

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
const New_Email_Input =document.querySelector(".new-email-input");
const Upload_New_Email = document.querySelector(".upload-new-email");
const Edit_Old_Email = document.querySelector(".edith-old-email");
const Cancel_New_Email_Upload = document.querySelector(".cancel-email-update");
const Display_Old_Phone = document.querySelector(".display-phone");
const New_Phone_Input = document.querySelector(".new-phone-input");
const Upload_New_Phone = document.querySelector(".upload-new-phone");
const Edit_Old_Phone = document.querySelector(".edith-old-phone");
const Cancel_New_Phone_Upload = document.querySelector(".cancel-phone-update");

// ====== CONFIG ======
const User = JSON.parse(localStorage.getItem("user") || '{}');
const ipAddress = "https://c67e-41-204-44-211.ngrok-free.app" ; //"http://localhost:8080";

// ====== DISPLAY FUNCTIONS ======
function showNoProduct() {
    NoProduct.style.display = "block";
     MyProfile.style.display = "none";
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
    MyProfile.style.display = "none";
}

function showAddProduct() {
    NoProduct.style.display = "none";
    ProductList.style.display = "none";
    AddProduct.style.display = "flex";
    EdithProduct.style.display = "none";
    Plus.style.display = "none";
    MyProfile.style.display = "none";

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
    MyProfile.style.display = "none";
}

function showMyProfile(){
    ProductSection.style.display = "none";
    MyProfile.style.display = "block";  
    MyProfile.classList.add("active");
    NoProduct.style.display = "none";
    ProductList.style.display = "none";
    AddProduct.style.display = "none";
    EdithProduct.style.display = "none";
    ProductCount.textContent = "0";
    Products.classList.remove("active"); 
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
        Plus.style.display = "flex";
    }
  
});

Profile.addEventListener("click",()=>{
    showMyProfile();

    let User = JSON.parse(localStorage.getItem("user"));

    //showing nessary items for fist star
    PickNew_Image_Container.style.display = "none";
    Upload_New_Image.style.display = "none";
    Cancel_New_Profile_Update.style.display = "none";
    Upload_New_Email.style.display = "none";
    Upload_New_Phone.style.display = "none";
    Cancel_New_Email_Upload.style.display = "none";
    Cancel_New_Phone_Upload.style.display = "none";
    document.querySelector(".iti").style.display = "none";

    if(User){
        Display_Account_Name.textContent = User["User-Name"];
        Display_Account_Id.textContent = User["User-ID"];


         if(User.profilePic){
            Edit_User_Icon.style.display = "none";
            alert(User["profilePic"]);
            Display_Profile_Image.src = `${ipAddress}/profile/${User["profilePic"]}`;
            Display_Profile_Image.style.display = "block";
            Display_Profile_Contanner.style.display = "flex";
           
        }else{
            UserIcon.style.display = "none";
            Display_Profile_Image.style.display = "none";
            Display_Profile_Image.style.display = "none";
        }
    }
   
});

Edith_OldPro_file_Image.addEventListener("click",()=>{
    PickNew_Image_Container.style.display = "flex";
    Cancel_New_Profile_Update.style.display = "block";
    Edith_OldPro_file_Image.style.display = "none";
});

Cancel_New_Profile_Update.addEventListener("click",()=>{
    if(NewImage_Input.value === ""){
        Display_Profile_Image.src = "";
        NewImage_Input.value ="";
        Upload_New_Image.style.display = "none";
        PickNew_Image_Container.style.display = "none";
        Cancel_New_Profile_Update.style.display = "none";
        Edith_OldPro_file_Image.style.display = "block"; 
        Display_Profile_Contanner.style.display = "none";
        Edit_User_Icon.style.display = "flex";
    }else{
        Display_Profile_Image.src = "";
        NewImage_Input.value ="";
        Display_Profile_Contanner.style.display = "none";
        Edit_User_Icon.style.display = "flex";
        Upload_New_Image.style.display = "none";
    }
    
    
});

PickNew_Image.addEventListener("click",()=>{
    NewImage_Input.click();
});

NewImage_Input.addEventListener("change",e=>{
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(evt){
            Display_Profile_Image.src = evt.target.result;
            Display_Profile_Image.style.display = "block";
            Edit_User_Icon.style.display = "none";
            Display_Profile_Contanner.style.display = "flex";
            Upload_New_Image.style.display = "block";
        }

        reader.readAsDataURL(file);
    }
});

Edit_Old_Email.addEventListener("click",()=>{
    Display_Old_Email.style.display = "none";
    New_Email_Input.style.display = "block";
    New_Email_Input.focus();
    Upload_New_Email.style.display = "block";
    Cancel_New_Email_Upload.style.display = "block"
    Edit_Old_Email.style.display = "none";
    
});

Cancel_New_Email_Upload.addEventListener("click",()=>{
    Display_Old_Email.style.display = "block";
    New_Email_Input.style.display = "none";
    New_Email_Input.value = "";
    Upload_New_Email.style.display = "none";
    Cancel_New_Email_Upload.style.display = "none"
    Edit_Old_Email.style.display = "block";
});

Edit_Old_Phone.addEventListener("click",()=>{
    Display_Old_Phone.style.display = "none";
    New_Phone_Input.style.display = "block";
    New_Phone_Input.value = "";
    document.querySelector(".iti").style.display = "block";
    New_Phone_Input.focus();
    Upload_New_Phone.style.display = "block";
    Cancel_New_Phone_Upload.style = "block";
    Edit_Old_Phone.style.display = "none";
    
});

Cancel_New_Phone_Upload.addEventListener("click",()=>{
    Display_Old_Phone.style.display = "block";
    New_Phone_Input.style.display = "none";
    Upload_New_Phone.style.display = "none";
    Cancel_New_Phone_Upload.style.display = "none";
    Edit_Old_Phone.style.display = "block";
    document.querySelector(".iti").style.display = "none";
});


// ====== NAVIGATION ======
document.querySelectorAll('.nav > div').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav .active')?.classList.remove('active');
        item.classList.add('active');
    });
});

const iti = window.intlTelInput(New_Phone_Input, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        fetch("https://ipapi.co/json")
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback("us"));
    },
    separateDialCode: true,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.5/build/js/utils.js"
});


