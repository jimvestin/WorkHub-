// Erbjudanden (meny)
const offers = [
    {
        id: 1,
        name: "Avsmakningsmeny",
        description: "10 små rätter chefs choice",
        price: 4000
    },
    {
        id: 2,
        name: "Avsmakningsmeny med vinpaket",
        description: "10 små rätter chefs choice med vinpaket",
        price: 6500
    },
    {
        id: 3,
        name: "Hubbenpaket",
        description: "Tre rätters med vin",
        price: 2000
    }
    
];

const container = document.getElementById("offers-container");
const quantity = document.getElementById("quantity");
const priceDisplay = document.getElementById("price");
const form = document.getElementById("booking-form");
const confirmation = document.getElementById("confirmation");
const resetBtn = document.getElementById("reset-btn");
const date = document.getElementById("date");

const nameInput = document.getElementById("name");
const name = nameInput.value.trim();
const nameError = document.getElementById("name-error");
const emailInput = document.getElementById("email");
const email = emailInput.value.trim();
const emailError = document.getElementById("email-error");

nameInput.addEventListener("input", () => {
    validateAndShowError(nameInput, nameError, validateName);
});
emailInput.addEventListener("input", () => {
    validateAndShowError(emailInput, emailError, validateEmail);
});

// Sparar det valda erbjudandet
let selectedOffer = null;

// Skapar och visar erbjudandena på skärmen
offers.forEach(offer => {

    const card = document.createElement("div");

    card.classList.add("offer-card");

    card.innerHTML = `
        <h3>${offer.name}</h3>
        <p>${offer.description}</p>
        <p>${offer.price} kr/person</p>
        <span class="selected-text">Valt erbjudande</span>
    `;

    // Känner av när användaren klickar på ett erbjudande
    card.addEventListener("click", () => {
           
        document
            .querySelectorAll(".offer-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");

        selectedOffer = offer;
        priceDisplay.style.color = "";
        updatePrice();
    });

    container.appendChild(card);
});
    // Kontrollerar namnet
function validateName(name) {
    if (!name) {
        return "Fyll i namn";
    }
    if (name.length < 2){
        return "Namnet måste innehålla minst 2 tecken";
    }
    if (!/^[A-Za-zÅÄÖåäö\s]+$/.test(name)) {
        return "Endast bokstäver A-Ö är tillåtna";
    }
    return ""; 
}
    // Kontrollerar e-postadressen
function validateEmail(email){
    if (!email) {
        return "Fyll i en email"
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)){
        return "Ogiltig e-postadress";
    }
    return "";
    }



// Räknar ut och uppdaterar totalpriset
function updatePrice() {

    const amount = Number(quantity.value);

    if (!selectedOffer) {
        priceDisplay.textContent =
        "Välj ett erbjudande";
        priceDisplay.style.color = "";
        return;
    }

    if (amount < 1 || amount > 5) {
        priceDisplay.textContent =
        "Antal måste vara 1-5";
        priceDisplay.style.color = "";
        return;
    }
    
    priceDisplay.style.color = "";
    priceDisplay.textContent =
    `Totalpris: ${selectedOffer.price * amount} kr`;
}
// Känner av när antalet ändras
quantity.addEventListener("input", updatePrice);


// En generell funktion som hanterar själva kontrollen och felmeddelandet
function validateAndShowError(inputElement, errorElement, validationFn) {
    
    const value = inputElement.value.trim();    
    
    const errorMessage = validationFn(value);    
    
    errorElement.textContent = errorMessage;    
    
    return errorMessage === "";
}

// Validerar och skickar bokningsformuläret
form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;

    // Kolla namnet
    if (!validateAndShowError(nameInput, nameError, validateName)) {
        valid = false;
    }

    // Kolla e-posten
    if (!validateAndShowError(emailInput, emailError, validateEmail)) {
        valid = false;
    }

    const bookingDate = date.value;
    if (!bookingDate){
        document.getElementById("date-error").textContent = "Välj ett bokingsdatum";
        valid = false;
    } 
    else {
        const selectedDate = new Date(bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today){
            document.getElementById("date-error").textContent = "Välj ett giltligt datum";
            valid = false;
        }
        else {
            document.getElementById("date-error").textContent = "";
        }
    }

      // Kontrollerar att ett erbjudande har valts
    if (!selectedOffer) {
        priceDisplay.textContent = "Du måste välja ett erbjudande";
        priceDisplay.style.color = "red";
        valid = false;
    }
     
    const amount = Number(quantity.value);      

  
    // Kontrollerar antalet personer
    if (
        !Number.isInteger(amount) ||
        amount < 1 ||
        amount > 5
    ) {

        document.getElementById("quantity-error")
        .textContent = "Antal måste vara 1-5";

        valid = false;
    }

    if (!valid) return;

    // Visar bokningsbekräftelsen
    confirmation.innerHTML = `
        <h3>Bokning mottagen</h3>
        <p>Namn: ${name}</p>
        <p>E-post: ${email}</p>
        <p>Datum: ${bookingDate}</p>
        <p>Erbjudande: ${selectedOffer.name}</p>
        <p>Antal personer: ${amount}</p>
        <p>Totalpris: ${selectedOffer.price * amount} kr</p>
    `;

    // Låser formuläret efter bekräftelse
    form.querySelectorAll("input, button")
        .forEach(element => {

            if (element !== resetBtn) {
                element.disabled = true;
            }

        });
});

// Återställer hela formuläret och börjar om
resetBtn.addEventListener("click", () => {

    form.reset();

    quantity.value = 1;

    selectedOffer = null;

    confirmation.innerHTML = "";

    priceDisplay.textContent =
    "Välj ett erbjudande";
    priceDisplay.style.color = "";

    document
        .querySelectorAll(".offer-card")
        .forEach(card =>
            card.classList.remove("selected")
        );

    document
        .querySelectorAll('[id$="error"]')
        .forEach(error =>
            error.textContent = ""
        );

    form.querySelectorAll("input, button")
        .forEach(element =>
            element.disabled = false
        );
});