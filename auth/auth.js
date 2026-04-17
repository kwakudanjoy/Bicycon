// ==================== SELECTORS ====================
const Back = document.getElementById("back");

const Card1 = document.querySelector("#card-1");
const Card2 = document.querySelector("#card-2");
const Card3 = document.querySelector("#card-3");
const Card4 = document.querySelector("#card-4");
const Card5 = document.querySelector("#card-5");

const cards = [Card1, Card2, Card3, Card4, Card5];
const delay = 5000; // total time per card
const fadeDuration = 800; // in ms

const signInForm = document.querySelector('.sign-in');
const signUpForm = document.querySelector('.sign-up');
const CompleteAccount = document.querySelector(".Complete-account");

const toSignUpBtn = document.querySelector('.sign-in > div:last-child button');
const toSignInBtn = document.querySelector('.sign-up > div:last-child button');

const pen = document.querySelector(".pen-icon");
const fileInput = document.getElementById("fileInput");
const profileImg = document.getElementById("profileImg");
const faUser = document.querySelector(".user-2");
const cancel = document.querySelector(".cancel-profile");
const phoneInput = document.querySelector("#phone");
const EmailInput = document.querySelector("#e-mail");

const signIn = document.querySelector(".sign-In");
const signUp = document.querySelector(".sign-Up");
const Next = document.querySelector(".next");
 
const Loading = document.querySelector("#loading-overlay");


// Input fields
const SignId = document.querySelector("#sign-in-id");
const SignInPassword = document.querySelector("#sign-in-password");

const SignUpName = document.querySelector("#sign-up-name");
const SignUpPassword = document.querySelector("#sign-up-password");
const SignUpConfirmPassword = document.querySelector("#sign-up-confirm-password");

const ipAddress ="https://c542-2a09-bac5-50ed-3032-00-4cd-1c.ngrok-free.app";
//const ipAddress = "http://192.168.0.117:8080";
//const ipAddress = "http://localhost:8080";
// ==================== LOCAL STORAGE ====================

const User = JSON.parse(localStorage.getItem("user") || "null");
// ==================== CHECK USER ====================
function CheckUser() {
    if (!User) {
        signUpForm.classList.add('show-card');
    } else if (User.account_completed === "NO") {
        CompleteAccount.classList.add("show-card");
    } else {
        
    }
}

CheckUser();

// ==================== BACK BUTTON ====================
Back.addEventListener("click", () =>{
    if(!window.history.back()){
        location.href = "/index.html";
        window.history.clear();
    }else{
        window.history.back();
        window.history.clear();
    }
});

// ==================== CARD SEQUENCE ====================
function showSequence() {
    let i = 0;

    function showCard() {
        const card = cards[i];
        card.classList.add("show");

        setTimeout(() => {
            card.classList.add("out");

            setTimeout(() => {
                card.classList.remove("show", "out");
                i = (i + 1) % cards.length;
                showCard();
            }, fadeDuration);

        }, delay - fadeDuration);
    }

    showCard();
}

showSequence();

// ==================== FORM TOGGLERS ====================
toSignUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.style.display = "block";
    signInForm.style.display = "none"; 
});

toSignInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.style.display = 'none';
    signInForm.style.display = "block";
});

// ==================== PROFILE IMAGE HANDLING ====================
pen.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            profileImg.src = event.target.result;
            profileImg.style.display = "block";
            faUser.style.display = "none";
            cancel.style.display = "flex";
        }
        reader.readAsDataURL(file);
    }
});

cancel.addEventListener("click", () => {
    profileImg.src = "";
    profileImg.style.display = "none";
    faUser.style.display = "flex";
    pen.style.display = "flex";
    cancel.style.display = "none";
    fileInput.value = "";
});

// ==================== PHONE INPUT ====================
const iti = window.intlTelInput(phoneInput, {
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

// ==================== SIGN-IN ====================
signIn.addEventListener("click", async (event) => {
    event.preventDefault();
    const Id = SignId.value;
    const Password = SignInPassword.value;
    
    if (!Id || !Password) return alert("Please enter ID and Password");

    const Payload = {
        INSTRUCTION: "SIGN-IN",
        SignInId: Id,
        SignInPassword: Password
    };

    try {

        Loading.style.display = "flex";
        const Result = await fetchData(Payload);
      
        if (Result && Result.status === "OK") {
    
            Loading.style.display = "none";
            delete Result.status;
            localStorage.setItem("user", JSON.stringify(Result));
            
           //User = Result;

            if (Result.account_completed === "NO") {
                //signInForm.classList.remove("show-card");
                signInForm.style.display = "none";
                CompleteAccount.style.display = "block";
            } else {
                window.location.href = "/main/main.html";
            }
        }else if(Result && Result.status === "!OK"){
            SignInPassword.classList.add("password-mis-match");
            SignId.classList.remove("password-mis-match");
            Loading.style.display = "none";
        }else if(Result && Result.status === "!USER"){
            SignId.classList.add("password-mis-match");
            SignInPassword.classList.remove("password-mis-match");
            Loading.style.display = "none";
        }
    } catch (err) {
        alert("Error signing in");
        Loading.style.display = "none";
    }
});

// ==================== SIGN-UP ====================
signUp.addEventListener("click", async (event) => {
    event.preventDefault();

    const Name = SignUpName.value.trim();
    const Password = SignUpPassword.value.trim();
    const ConfirmPassword = SignUpConfirmPassword.value.trim();

    if (!Name || !Password || !ConfirmPassword) return alert("Fill all fields");

    if (Password !== ConfirmPassword) {
        SignUpPassword.classList.add("password-mis-match");
        SignUpConfirmPassword.classList.add("password-mis-match");
        return;
    }

    const Payload = { INSTRUCTION: "SIGN-UP", Name, Password };
    

    try {
        Loading.style.display = "flex";
        const Result = await fetchData(Payload);
    
        if (Result) {
            Loading.style.display = "none";
            localStorage.setItem("user", JSON.stringify(Result));
            signUpForm.style.display = "none";
            CompleteAccount.style.display = "block";
        }
    } catch (err) {
        alert("Error signing up");
        Loading.style.display = "none";
    }
});

// ==================== PASSWORD MATCH CHECK ====================
SignUpConfirmPassword.addEventListener("input", () => {
    const Password = SignUpPassword.value.trim();
    const ConfirmPassword = SignUpConfirmPassword.value.trim();

    if (!ConfirmPassword) return;

    if (Password === ConfirmPassword) {
        SignUpPassword.classList.add("password-match");
        SignUpConfirmPassword.classList.add("password-match");
        SignUpPassword.classList.remove("password-mis-match");
        SignUpConfirmPassword.classList.remove("password-mis-match");
    } else {
        SignUpPassword.classList.add("password-mis-match");
        SignUpConfirmPassword.classList.add("password-mis-match");
        SignUpPassword.classList.remove("password-match");
        SignUpConfirmPassword.classList.remove("password-match");
    }
});

Next.addEventListener("click", async (event) => {
    event.preventDefault();

    let User = JSON.parse(localStorage.getItem("user") || "null");

    if (!User) {
        alert("User not found");
        return;
    }

    const CountryData = iti.getSelectedCountryData(); // ✅ fixed typo
    const Phone = iti.getNumber();
    const Email = EmailInput.value.trim();

    if (!Email || !Phone) {
        alert("Please enter email and phone");
        return;
    }

    const UserId = User["User-ID"];

    const Payload = {
        INSTRUCTION: "COMPLETE-ACCOUNT",
        UserId: UserId,
        Email: Email,
        Phone: Phone,
        CountryCode: CountryData.dialCode  // send only the dial code
    };

    try {

        Loading.style.display = "flex";
        const Result = await fetchData(Payload);
        Loading.style.display = "none";
    
    if (Result && Result.status === "OK") {

            let User = JSON.parse(localStorage.getItem("user"));
            User.account_completed = "YES";
            User.Email = Result["Email"];
            User.Phone = Result["Phone"];
            localStorage.setItem("user", JSON.stringify(User));

        if (fileInput.files.length > 0) {

            let Payload ={
                INSTRUCTION : "UPLOAD-PROFILE",
                User_Id : User["User-ID"]
            }

            const file = fileInput.files[0];

            const formData = new FormData();
            formData.append("file", file);
            formData.append("Data", JSON.stringify(Payload));
           
            try {
                
                Loading.style.display = "flex";
                const uploadResult = await UploadFileWithData(formData);

            if (uploadResult && uploadResult["status"] === "OK") {
                    Loading.style.display = "none";
                    let User = JSON.parse(localStorage.getItem("user"));
                    User.profilePic = uploadResult["Url"];
                    localStorage.setItem("user", JSON.stringify(User));
                    window.location.href = "/main/main.html";
                }

            } catch (err) {
                alert("Upload failed");
            }
        }else{
           window.location.href = "/main/main.html";  
        }         
    }

    } catch (err) {
        alert("Error completing account");
        Loading.style.display = "none";
    }
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