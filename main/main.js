const Products = document.querySelector(".products");
const Orders = document.querySelector(".orders");
const ProductList = document.querySelector(".product-list");
const NoProduct = document.querySelector(".no-product-section");
const ProductCount = document.querySelector(".product-count > p");


const addProd = document.querySelector('.add-prod');
const prodProfile = addProd.querySelector('.prod-profile');
const prodIcon = prodProfile.querySelector('.prod-icon');
const prodImage = prodProfile.querySelector('.prod-pro-pic');
const cameraBtn = addProd.querySelector('.camera');
const cancelBtn = addProd.querySelector('.cancel');
const fileInput = addProd.querySelector('.file-input');



const User = localStorage.getItem("user");
const ipAddress = "https://1376-41-204-44-1.ngrok-free.app";

//geting all my products
GetMyProducts();
async function GetMyProducts() {
    let producCount = 0;
    const fragment = document.createDocumentFragment();

    let Payload = {
        INSTRUCTION: "GET-MY-PRODUCTS",
        User_id: User["User-ID"]
    };

    const productList = await Get(Payload);

    console.log(productList); // better than alert
    alert(JSON.stringify(productList));

    if (Array.isArray(productList) && productList.length > 0) {

        productList.forEach(prodItem => {
            const listCard = document.createElement("div");
            listCard.classList.add("list-card");

            listCard.innerHTML = `
                <img src="${prodItem.Url}" alt="" class="prod-img">
                <p class="pord-name">${prodItem.name}</p>
                <p class="prod-id">${prodItem.Id}</p>
                <p class="prod-price">GHC: ${prodItem.price}</p>
                <p class="final-prod-description">${prodItem.discription}</p>
                <div class="edith-delete-prod">
                    <div class="edith-prod"><i class="fa-solid fa-pen"></i>Edit</div>
                    <div class="delete-prod"><i class="fa-solid fa-x"></i>Delete</div>
                </div>
            `;

            fragment.appendChild(listCard);
            producCount++;
        });

        ProductList.innerHTML = ""; // clear old data
        ProductList.appendChild(fragment);

        ProductCount.textContent = producCount;

        NoProduct.style.display = "none";
        ProductList.style.display = "grid";
        Products.classList.add("active");

    } else {
        alert("No products found");

        NoProduct.style.display = "block";
        ProductList.style.display = "none";
        ProductCount.textContent = "0";
        Products.classList.add("active");
    }
}


document.querySelectorAll('.nav > div').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav .active')?.classList.remove('active');
        item.classList.add('active');
    });
});

cameraBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(event){
            prodImage.src = event.target.result;
            prodImage.style.display = 'block';
            prodIcon.style.display = 'none';
            cancelBtn.style.display = 'flex';
        }
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

//sending requests for resalts
async function Get(Payload) {
    try {
        const response = await fetch(ipAddress + "/api/process", {
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
