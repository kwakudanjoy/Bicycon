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

  const toSignUpBtn = document.querySelector('.sign-in > div:last-child button');
  const toSignInBtn = document.querySelector('.sign-up > div:last-child button');

Back.addEventListener("click",()=>{
    window.history.back();
});

showSequence();

function showSequence() {
    let i = 0;

    function showCard() {
        const card = cards[i];
        // 1. fade in
        card.classList.add("show");

        // 2. wait for visible period (delay - fadeDuration)
        setTimeout(() => {
            // 3. fade out
            card.classList.add("out");

            // 4. remove classes after fade out
            setTimeout(() => {
                card.classList.remove("show", "out");
                // next card
                i = (i + 1) % cards.length;
                showCard(); // recursive loop
            }, fadeDuration);
        }, delay - fadeDuration);
    }

    showCard();
}

  // Show sign-up form
  toSignUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
    // optional: animate
    signUpForm.classList.add('show-card');
  });

  // Show sign-in form
  toSignInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
    signInForm.classList.add('show-card');
  });

