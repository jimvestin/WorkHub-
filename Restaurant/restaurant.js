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
// Hämtar element från HTML
const container = document.getElementById("offers-container");
const quantity = document.getElementById("quantity");
const priceDisplay = document.getElementById("price");
const form = document.getElementById("booking-form");
const confirmation = document.getElementById("confirmation");
const resetBtn = document.getElementById("reset-btn");

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

// Validerar och skickar bokningsformuläret
form.addEventListener("submit", (event) => {

    event.preventDefault();

    let valid = true;

    document
        .querySelectorAll('[id$="error"]')
        .forEach(error => error.textContent = "");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const amount = Number(quantity.value);

    // Kontrollerar namnet
    if (!name) {
    document.getElementById("name-error").textContent = "Fyll i namn";
    valid = false;
    } else if (!/^[A-Za-zÅÄÖåäö\s]+$/.test(name)) {
    document.getElementById("name-error").textContent = "Endast bokstäver A-Ö är tillåtna";
    valid = false;
}
    // Kontrollerar e-postadressen
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email)) {
        document.getElementById("email-error").textContent = "Ogiltig e-postadress";
        valid = false;
    }

    // Kontrollerar att ett erbjudande har valts
    if (!selectedOffer) {
        priceDisplay.textContent = "Du måste välja ett erbjudande";
        priceDisplay.style.color = "red";
        valid = false;
    }

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