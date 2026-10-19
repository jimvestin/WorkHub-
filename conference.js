// Listar dom 3 olika erbjudandena i konsolen
const offers = [
  {
    id: "meetingRoom",
    name: "Mötesrum",
    description: "Boka ett mötesrum för ditt nästa möte.",
    pricePerHour: 1500 
  },
  {
    id: "fullDaySeminar",
    name: "Heldagskonferens",
    description: "Boka en heldagskonferens för ditt företag.",
    pricePerHour: 1000
  },
  {
    id: "conference+food",
    name: "Konferenspaket med mat",
    description: "Boka ett konferenspaket med mat för ditt företag.",
    pricePerHour: 1200
  }
];

// Hämtar elementet med id "offers" från HTML-dokumentet
const offersContainer = document.getElementById("offers");
// Hämtar elementet med id "quantity" från HTML-dokumentet
const quantityInput  = document.getElementById("quantity");
// Hämtar element som har med bokningsformulär att göra
const companyInput = document.getElementById("company");
const emailInput = document.getElementById("email");
const contactPersonInput = document.getElementById("contactPerson");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
// Hämtar element för fel vid inmatning i bokningsformulär
const companyError = document.getElementById("companyError");
const contactPersonError = document.getElementById("contactPersonError")
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dateError = document.getElementById("dateError");
// Hämtar element med id "Totalkostnad" från HTML-dokumentet
const totalPriceElement = document.getElementById("totalPrice");


let selectedOfferId= null;



function validateBooking() {
  let isValid = true;

  // Kontrollera företagsnamn
  if (companyInput.value.trim() === "") {
    companyError.textContent = "Fyll i företagets namn.";
    isValid = false;
  } else {
    companyError.textContent = "";
  }

  // Kontrollera kontaktperson
  if (contactPersonInput.value.trim() === "") {
    contactPersonError.textContent =
      "Fyll i kontaktpersonens namn.";
    isValid = false;
  } else {
    contactPersonError.textContent = "";
  }


  return isValid;
}





// Loopar igenom varje erbjudande i "offers" arrayen och skapar HTML-kod för varje erbjudande
for (const offer of offers) {
  offersContainer.innerHTML+= `
  <div class="offer-card" data-offer-id="${offer.id}">
  <h2>${offer.name}</h2>
  <p>${offer.description}</p>
  <p>${offer.pricePerHour} kr/h</p>
  <button onclick="selectOffer('${offer.id}')">Välj</button>
  </div>
  `
}


// Funktion som körs när användaren klickar på "Välj" knappen för ett erbjudande
function selectOffer(offerId) {
  selectedOfferId = offerId;
    //Gör så att bokningsformulär inte syns förens användare klickat på välj
  document.getElementById("bookingForm").style.display = "block";
  calculateTotal();

const offerCards = document.querySelectorAll(".offer-card");

  for (const card of offerCards) {
    if (card.dataset.offerId === selectedOfferId) {
      card.style.border = "2px solid green";
      card.style.backgroundColor = "var(--accent)";
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
      card.style.border = "";
      card.style.backgroundColor = "";
    }
  }
 console.log(`Du har valt ${selectedOfferId}`);
}

// Räknar ut totalpriset
function calculateTotal() {
 for (const offer of offers) {
  if (offer.id === selectedOfferId) {
    const selectedHours = Number (quantityInput.value);
      const totalPrice = offer.pricePerHour * selectedHours;
      //Skriver ut Totalkostnaden efter användaren fyllt i antal timmar 
        totalPriceElement.textContent = `Totalkostnad: ${totalPrice} kr`;
      console.log (totalPrice);
  }
 }
}


// Loopar igenom varje erbjudande i "offers" arrayen och loggar informationen i konsolen
for (const offer of offers) {
  console.log(offer.name)
  console.log(offer.description)
  console.log(offer.pricePerHour)
  console.log('---------------')
  
};


// Knapp som bekräftar bokningen
const submitBookingButton =
  document.getElementById("submitBooking");

submitBookingButton.addEventListener("click", function () {
  const isValid = validateBooking();

  if (isValid) {
    console.log("Alla fält är godkända!");
  }
});




// Läser in värdet från input-fältet och loggar det i konsolen när användaren skriver något i fältet
quantityInput.addEventListener("input", function () {
  console.log(quantityInput.value);
  calculateTotal();
});


companyInput.addEventListener("input", validateCompany);