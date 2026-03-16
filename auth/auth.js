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

const signIn = document.querySelector(".sign-In");
const signUp = document.querySelector(".sign-Up");
const Next = document.querySelector(".next");

// Input fields
const SignId = document.querySelector("#sign-in-id");
const SignInPassword = document.querySelector("#sign-in-passwprd");

const SignUpName = document.querySelector("#sign-up-name");
const SignUpPassword = document.querySelector("#sign-up-password");
const SignUpConfirmPassword = document.querySelector("#sign-up-confirm-password");

// ==================== LOCAL STORAGE ====================
let User = null;
const UserString = localStorage.getItem("user");
if (UserString) {
    try {
        User = JSON.parse(UserString);
    } catch (e) {
        console.error("Invalid user in localStorage", e);
        localStorage.removeItem("user");
    }
}

// ==================== CHECK USER ====================
function CheckUser() {
    if (!User) {
        signUpForm.classList.add('show-card');
        alert(JSON.stringify(User));
    } else if (User.account_completed === "NO") {
        CompleteAccount.classList.add("show-card");
    } else {
        // Redirect to dashboard or homepage
        //window.location.href = "/dashboard.html"; // adjust this
    }
}

CheckUser();

// ==================== BACK BUTTON ====================
Back.addEventListener("click", () => window.history.back());

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
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
    signUpForm.classList.add('show-card');
});

toSignInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
    signInForm.classList.add('show-card');
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

    const Id = SignId.value.trim();
    const Password = SignInPassword.value.trim();

    if (!Id || !Password) return alert("Please enter ID and Password");

    const Payload = {
        INSTRUCTION: "SIGN-IN",
        SignInId: Id,
        SignInPassword: Password
    };

    try {
        const Result = await Get(Payload);

        alert(JSON.stringify(Result));

        if (Result !== null) {
            localStorage.setItem("user", JSON.stringify(Result));
            User = Result;

            if (Result.account_completed === "NO") {
                signInForm.classList.remove("show-card");
                CompleteAccount.classList.add("show-card");
            } else {
                window.location.href = "/dashboard.html";
            }
        }

    } catch (err) {
        alert("Error signing in");
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
        const Result = await Get(Payload);
        alert(JSON.stringify(Result));

        if (Result) {
            localStorage.setItem("user", JSON.stringify(Result));
            User = Result;
            CompleteAccount.classList.add("show-card");
        }
    } catch (err) {
        alert("Error signing up");
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

// ==================== ASYNC FETCH FUNCTION ====================
async function Get(Payload) {
    try {
        const response = await fetch("http://10.100.10.228:8080/api/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Payload)
        });

        if (!response.ok) throw new Error(`Network Error: ${response.status}`);

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Fetch error:", err);
        throw err;
    }
}