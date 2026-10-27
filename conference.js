// Listar dom 3 olika alternativen i en array
const offers = [
  {
    id: "meetingRoom",
    name: "Mötesrum",
    description: "Boka ett mötesrum för ditt nästa möte.",
    pricePerHour: 800 
  },
  {
    id: "lectureHall",
    name: "Föreläsningssal",
    description: "En större lokal för föreläsningar, utbildningar och presentationer.",
    pricePerHour: 2000
  },
  {
    id: "boardRoom",
    name: "Styrelserum",
    description: "Ett mindre, exklusivt rum för styrelsemöten, kundmöten eller viktiga presentationer.",
    pricePerHour: 1200
  }
];

// !!!! HÄMTAR ELEMENT FRÅN HTML !!!!
// getElementById hittar element via id så dom kan användas i JS
// Hämtar elementet med id "offers" från HTML-dokumentet
const offersContainer = document.getElementById("offers");

// Hämtar elementet med id "quantity" från HTML-dokumentet
const quantityInput  = document.getElementById("quantity");

// Fälten i bokningsformulär
const companyInput = document.getElementById("company");
const emailInput = document.getElementById("email");
const contactPersonInput = document.getElementById("contactPerson");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");

// Hämtar dom tomma <p> som används för felmeddelanden
const offerError = document.getElementById("offerError");
const companyError = document.getElementById("companyError");
const contactPersonError = document.getElementById("contactPersonError")
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dateError = document.getElementById("dateError");
const quantityError = document.getElementById("quantityError");

// Element där totalpris visas
const totalPriceElement = document.getElementById("totalPrice");

//Hämtar confirmation från HTML
const confirmationSection = document.getElementById("confirmation");

//begränsar så dom enda datumen som går att välja är dagens och framåt. 
dateInput.min = new Date().toISOString().slice(0, 10);



let selectedOfferId = null; // id på valt offer
let isConfirmed = false; // Ändras till true när bokningen bekräftas 


//   !!!! VALIDERING !!!! 
// Kollar så något fyllts i inputfält
// input = fält, errorElement = <p> för felmeddelande, errorMessage = texten som visas vid fel
// True om fält är ifyllt annars false
function validateInput(input, errorElement, errorMessage) {
  if (input.value.trim() === "") { //trim () tar bort blanksteg
    errorElement.textContent = errorMessage;
    errorElement.style.color = "red";
    return false;
  }
  errorElement.textContent ="";
return true;
}
 
// kollar så e-post uppfyller kraven med hjälp av regex
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
  return pattern.test(email);
}

// Visar felmeddelande vid e-postfältet
function validateEmail() {
  if (emailInput.value === "") {
    emailError.textContent = "Fyll i din e-postadress.";
    emailError.style.color = "red";
    return false;
  }
  if (!isValidEmail(emailInput.value)) {
    emailError.textContent = "Ange en giltig e-postadress.";
    emailError.style.color = "red";
    return false;
  }
  emailError.textContent = "";
  return true;
}

 //Kollar att antalet är ett heltal mellan 1-5
 function validateQuantity () {
const value = Number (quantityInput.value);
 if (
  quantityInput.value.trim() === "" ||
  !Number.isInteger(value) || value < 1 || value > 5
 ) {
  quantityError.textContent = "Ange minst 1 eller max 5 timmar.";
    quantityError.style.color = "red";
    return false;
  }
  quantityError.textContent = "";
  return true;
}
// Kollar att ett erbjudande är valt (SelectedOfferId = null tills man klickar på ett offer)
function validateOffer() {
  if (selectedOfferId === null) {
    offerError.textContent = "Välj ett erbjudande.";
    offerError.style.color = "red";
    return false;
  }
  offerError.textContent = "";
  return true;
}


// Kontrollerar bokning
// Returerar true bara om alla fält är giltiga
function validateBooking (){
const offerValid = validateOffer();
const companyValid = validateInput(companyInput, companyError, "Fyll i företagets namn");
const contactValid = validateInput(contactPersonInput, contactPersonError, "Fyll i kontaktperson");
const emailValid = validateEmail();
const phoneValid = validateInput(phoneInput, phoneError, "Fyll i telefonnummer");
const dateValid = validateInput(dateInput, dateError, "Välj datum");
const quantityValid = validateQuantity();

// && betyder att alla fält måste vara giltiga 
return offerValid && companyValid && contactValid && emailValid && phoneValid && dateValid && quantityValid;
}


// Loopar igenom varje erbjudande i "offers" arrayen och skapar HTML-kod för varje erbjudande
for (const offer of offers) {
  offersContainer.innerHTML+= `
  <div class="offer-card" data-offer-id="${offer.id}">
  <h2>${offer.name}</h2>
  <p>${offer.description}</p>
  <p>${offer.pricePerHour} kr/h</p>
  </div>
  `;
}

//EventListener som känner av om något har klickats på offers
offersContainer.addEventListener("click", function (event) {
  const card= event.target.closest(".offer-card");
   if (!card) return;
  selectOffer(card.dataset.offerId);
});


// Funktion som körs när användaren klickar på ett kort
function selectOffer(offerId) {
  if (isConfirmed) return;  
  selectedOfferId = offerId;
  offerError.textContent = "";
    document.getElementById("bookingForm").style.display = "block";
    calculateTotal();

const offerCards = document.querySelectorAll(".offer-card"); // alla kort

// Markerar det valda kortet och ger class "Selected" 
  for (const card of offerCards) {
    if (card.dataset.offerId === selectedOfferId) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  }
 console.log(`Du har valt ${selectedOfferId}`);
}

// !!! TOTALPRIS !!! 
// Räknar ut totalpriset PricePerHour * antal timmar
function calculateTotal() {
  if(!validateQuantity()) {
    totalPriceElement.textContent ="";
    return null;
  }
 for (const offer of offers) {
  if (offer.id === selectedOfferId) {
    const selectedHours = Number (quantityInput.value);
      const totalPrice = offer.pricePerHour * selectedHours;
      //Skriver ut Totalkostnaden efter användaren fyllt i antal timmar 
        totalPriceElement.textContent = `Totalkostnad: ${totalPrice}kr`;
      return totalPrice
  }
 }
}

// Sköter låsning av formulär
const form = document.getElementById("bookingForm");
const resetBtn = document.getElementById("resetBooking");

// Låser eller låser upp alla fält och knappar i formuläret, utom "Börja om"
function setFormLocked(locked) {
  form.querySelectorAll("input, select, button").forEach(element => {
    if (element !== resetBtn) {
      element.disabled = locked;
    }
  });
}

// Knapp som bekräftar bokningen
const submitBookingButton =
  document.getElementById("submitBooking");
 submitBookingButton.addEventListener("click", function () {
  if (!validateBooking()) { // 
    return;
  }

  const selectedOffer = offers.find(
    offer => offer.id === selectedOfferId
  );

const hours = Number(quantityInput.value);
const totalPrice = calculateTotal();
if (totalPrice === null) {
  return;
}

// Skriver ut bokningsbekräftelse
confirmationSection.innerHTML = `
  <h2>Bokningen är bekräftad!</h2>
  <p>Typ av rum: ${selectedOffer.name}</p>
  <p>Företag: ${companyInput.value}</p>
  <p>Kontaktperson: ${contactPersonInput.value}</p>
  <p>E-post: ${emailInput.value}</p>
  <p>Telefon: ${phoneInput.value}</p>
  <p>Datum: ${dateInput.value}</p>
  <p>Antal timmar: ${hours}</p>
  <p>Totalkostnad: ${totalPrice} kr</p>
`;
confirmationSection.hidden = false; // Tar bort hidden så bekräftelsen syns
setFormLocked(true); // Låser formulärets input fält
isConfirmed = true;
});


//Knapp som återställer det som fyllts i bokning
function resetBooking () {
  setFormLocked(false); //Låser upp fält
document.getElementById("bookingForm").reset(); // Tömmer fält  
confirmationSection.innerHTML = ""; // Tar bort bekräftelsen
confirmationSection.hidden = true;

selectedOfferId = null; // Gör så inget erbjudande är valt
isConfirmed = false;

// Tar bort markering på offer
document.querySelectorAll(".offer-card").forEach(card => {
  card.classList.remove("selected");
});

// Tömmer felmeddelanden
[offerError, companyError, contactPersonError, emailError, phoneError, dateError, quantityError] .forEach(error => error.textContent ="");

 // Återställer priset
  totalPriceElement.textContent ="";

}
 // Kopplar börja om knapp till funktionen
document.getElementById("resetBooking")
 .addEventListener ("click",resetBooking);


// Räknar om priset varje gång användaren ändrar inputQuantity
quantityInput.addEventListener("input", function () {
  calculateTotal();
});
