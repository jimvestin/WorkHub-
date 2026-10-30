//Gökhan Mahshid hotell//

//sätter värdet på dom olika rummen//
const offers = [
  {
    id: "familjerum",
    name: "Familj",
    pricePerPerson: 1000,
  },

  {
    id: "enkelrum",
    name: "Enkel",
    pricePerPerson: 500,
  },

  {
    id: "executive",
    name: "Executive",
    pricePerPerson: 800,
  },

  {
    id: "presidentsvit",
    name: "Presidentsvit",
    pricePerPerson: 2000,
  },
];

//VISANDET AV FORMULÄRET//

//knappen drar igång visaForm funktionen när den klickas på//
function visaForm(button) {
     
    //låser formuläret när bokning har blivit bekräftat//
     if (bookingConfirmed) {
        return;
    }

    //hittar formuläret för det valda rummet//
    const info = button.closest(".familjeinfo");
    const form = info.querySelector(".bokning");

    //kollar om formuläret redan är öppen//
    const isOpen = !form.hidden;

    //går igenom alla bokningsformulär//
    document.querySelectorAll(".bokning").forEach(openForm => {

        //stänger alla bokningsformulären//
        openForm.hidden = true;
        openForm.classList.remove("selected");

        const openInfo = openForm.closest(".familjeinfo");
        //visar rubriken och texten igen när formuläret är stängt//
        openInfo.querySelector(".familjerubrik").hidden = false;
        openInfo.querySelector(".familjetext").hidden = false;
        //gömmer texten för valt erbjudande//
        openInfo.querySelector(".valt-erbjudande").hidden = true;
    });

    
    if (isOpen) {
        return;
    }

    //hittar rätt rum och erbjudandet som tillhör//
    const room = button.closest(
        "#familjerum, #enkelrum, #executive, #presidentsvit"
    );

    const selectedOffer = offers.find(offer => offer.id === room.id);

    //öppnar formuläret som blir valt//
    form.hidden = false;
    form.classList.add("selected");
    //gömmmer rubriken och texten när formuläret öppnas//
    info.querySelector(".familjerubrik").hidden = true;
    info.querySelector(".familjetext").hidden = true;
    //visar texten för det valda erbjudandet//
    info.querySelector(".valt-erbjudande").hidden = false;

    if (selectedOffer) {
        updateTotal(form, selectedOffer);
    }
}


//VALIDERING AV BOKNING//

//kollar om bokningen bekräftats//
let bookingConfirmed = false;

//error funktionen som togglar på eller av när nåt är fel//
function showError(input, hasError) {
    input.parentElement.classList.toggle("error", hasError);

}

//kollar så att för och efternamn innehåller bokstäver och minst 2 bokstäver//
function validateName(input) {
    const value = input.value.trim();
    const isInvalid = !/^[A-Za-zÅÄÖåäö\s]+$/.test(value) || value.length < 2;

    showError(input, isInvalid);
    return !isInvalid
}

//kollar så telefon har rätt mängd siffror och inga bokstäver//
function validateTele(input) {
    const value = input.value.trim();
    const isInvalid = !/^\+?[0-9\s()-]{7,20}$/.test(value);

    showError(input, isInvalid);
    return !isInvalid
}

//kollar så att mailen har rätt innehåll//
function validateMail(input) {
    const value = input.value.trim();

    const isInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    showError(input, isInvalid);
    return !isInvalid;
}

//kollar så att incheckningen är ifylld//
function validateDateFrom(input) {
    const value = input.value;

    const isInvalid = value === "";

    showError(input, isInvalid);
    return !isInvalid;
}

//kollar så att utcheckning är efter incheckning//
function validateDateTo(dateFrom, dateTo) {
    const isInvalid =
        dateTo.value === "" ||
        dateTo.value <= dateFrom.value;

    showError(dateTo, isInvalid);
    return !isInvalid;
}

//kollar så att antalet personer är mellan 1 - 5 och att det är ett heltal
function validatePeople(input) {
    const value = Number(input.value);

    const isInvalid =
        input.value.trim() === "" ||
        !Number.isInteger(value) ||
        value < 1 ||
        value > 5;

    showError(input, isInvalid);
    return !isInvalid;
}


//hittar klasserna från html//
function validateUser(form) {
    const firstName  = form.querySelector(".firstName");
    const lastName = form.querySelector(".lastName");
    const phone = form.querySelector(".telePhone");
    const email = form.querySelector(".hotMail");
    const dateFrom = form.querySelector(".datumFrom");
    const dateTo = form.querySelector(".datumTill");
    const antalPersoner = form.querySelector(".antalPersoner");
    
    //samlar resultatet från valideringsfunktionen//
    const results = [
        validateName(firstName),
        validateName(lastName),
        validateTele(phone),
        validateMail(email),
        validateDateFrom(dateFrom),
        validateDateTo(dateFrom, dateTo),
        validatePeople(antalPersoner),

    ]

    //kollar så att allt är rätt//
    return results.every(result => result === true)
    
}

//UTRÄKNING AV PRIS//   

//räknar ut totalkostnaden//
function calculateTotal(pricePerPerson, antalPersoner, days) {
    const total = pricePerPerson * antalPersoner * days;

    return total;
}

//räknar ut antal nätter//
function calculateDays(dateFrom, dateTo) {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    const difference = endDate - startDate;

    const days = difference / (1000 * 60 * 60 * 24);

    return days;
}

//visar det totala priset i sek i det valda formuläret//
function updateTotal(form, selectedOffer) {
    const antalPersoner = form.querySelector(".antalPersoner");
    const totalPriceElement = form.querySelector(".totalPris");
    const dateFrom = form.querySelector(".datumFrom");
    const dateTo = form.querySelector(".datumTill");

    const days = calculateDays(dateFrom.value, dateTo.value);
    //kollar så att antalet är rätt//
    const antal = Number(antalPersoner.value);
    if (
        antalPersoner.value.trim() === "" ||
        !Number.isInteger(antal) ||
          antal < 1 ||
          antal > 5
          
) {     
        //vad som visas när det är fel//
        totalPriceElement.value = "Antal måste vara 1-5";
        totalPriceElement.style.color = "red";

        return;

}       //ser till att datum behövs väljas och vara korrekta så att det inte blir fel//
    if (
        !dateFrom.value || !dateTo.value || days <= 0) {
        totalPriceElement.value = "Välj giltiga datum";
        totalPriceElement.style.color = "red";
        
        return;
}
    //räknar ut pris för antal personer och nätter//
    const totalPrice = calculateTotal(
        selectedOffer.pricePerPerson,
        antal,
        days
    );
    
    //visar valuta i sek//
    totalPriceElement.value = `${totalPrice.toLocaleString("sv-SE")} kr`;
    totalPriceElement.style.color = "";

    showError(totalPriceElement, false);
}

//uppdaterar priset när antalet personer ändras//
document.querySelectorAll(".bokning").forEach(form => {
    const antalPersoner = form.querySelector(".antalPersoner");
    const dateFrom = form.querySelector(".datumFrom");
    const dateTo = form.querySelector(".datumTill");

    //hittar rummen//
    const room = form.closest(
        "#familjerum, #enkelrum, #executive, #presidentsvit"
        
    );
    //hittar erbjudandet baserat på id//
    const selectedOffer = offers.find(
        offer => offer.id === room.id
    );

    dateFrom.addEventListener("change", function () {
    if (selectedOffer) {
        updateTotal(form, selectedOffer);
    }
});

dateTo.addEventListener("change", function () {
    if (selectedOffer) {
        updateTotal(form, selectedOffer);
    }
});
    
    //registrerar byte av antal personer//
    antalPersoner.addEventListener("input", function () {
    
    
    //kollar så att erbjudandet finns//
    if (selectedOffer) {
        updateTotal(form, selectedOffer);
    }
    
    
});
});

//HANTERING AV DATUM//

//hämtar dagens datum//
const today = new Date();
//hanterar tidszonen//
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
//ser till att bara datum visas och inte tiden//
const todayString = today.toISOString().slice(0, 10);

//går igengom alla bokningformuläret//
document.querySelectorAll(".bokning").forEach(form => {
    const dateFrom = form.querySelector(".datumFrom");
    const dateTo = form.querySelector(".datumTill");

    //ser till att man inte kan ta ett datum innan dagens datum//
    dateFrom.min = todayString;
    dateTo.min = todayString;

    //uppdaterar tidigaste utcheckningsdatum när incheckningdatum ändras//
    dateFrom.addEventListener("change", function () {
        dateTo.min = dateFrom.value || todayString;

        //ser till att man inte kan klicka på ett utcheckningsdatum tidigare än incheckningsdatumet//
        if (dateTo.value && dateTo.value < dateFrom.value) {
            dateTo.value = "";
        }
    });
});

//BEKRÄFTNING VISAS//

//hämtar html klassen//
function showConfirmation(form, bookingInfo) {
    const confirmation = form.querySelector(".bokningsbekraftelse");

    //hittar rummen//
    const room = form.closest(
    "#familjerum, #enkelrum, #executive, #presidentsvit"
);
    //hittar rummets namn inför bekräftelse//
    const selectedOffer = offers.find(offer => offer.id === room.id);

    //visar bekräftelse av bokning//
    confirmation.querySelector(".bekraftelseRum").textContent =
    selectedOffer.name

    confirmation.querySelector(".bekraftelseNamn").textContent =
        `${bookingInfo.firstName} ${bookingInfo.lastName}`;

    confirmation.querySelector(".bekraftelseTelefon").textContent =
        bookingInfo.phone;

    confirmation.querySelector(".bekraftelseEmail").textContent =
        bookingInfo.email;

    confirmation.querySelector(".bekraftelseAntal").textContent =
        bookingInfo.antalPersoner;

    confirmation.querySelector(".bekraftelsePris").textContent =
        bookingInfo.totalPris;

    confirmation.querySelector(".bekraftelseFran").textContent =
        bookingInfo.dateFrom;

    confirmation.querySelector(".bekraftelseTill").textContent =
        bookingInfo.dateTo;

    confirmation.hidden = false;
}



//BOKNINGSKNAPPEN//

//funktion för bekräfta knappen som kollar av så att allt är korrekt//
document.querySelectorAll(".bokning").forEach(form => {
    const button = form.querySelector(".bekraftaBokning");

    button.addEventListener("click", function () {

        //kollar så att värderna är korrekta//
        const isValid = validateUser(form);

       if (!isValid) {
        const totalPriceElement = form.querySelector(".totalPris");

        if (form.querySelector(".antalPersoner").parentElement.classList.contains("error")) {
        showError(totalPriceElement, true);
    }

        return;
}

        //hittar bokningsuppgifterna//
        const firstName = form.querySelector(".firstName").value.trim();
        const lastName = form.querySelector(".lastName").value.trim();
        const phone = form.querySelector(".telePhone").value.trim();
        const email = form.querySelector(".hotMail").value.trim();
        const antalPersoner = form.querySelector(".antalPersoner").value;
        const totalPris = form.querySelector(".totalPris").value;
        const dateFrom = form.querySelector(".datumFrom").value;
        const dateTo = form.querySelector(".datumTill").value;

        const bookingInfo = {
           firstName,
           lastName,
           phone,
           email,
           antalPersoner,
           totalPris,
           dateFrom,
           dateTo
};
        //låser formuläret//
        setFormLocked(true);
        showConfirmation(form, bookingInfo);


        //döljer inmatningsfälten och bekräftelseknappen//
        form.querySelectorAll(
            ".formgrupp, .formgrupp2, .bekraftaBokning"
        ).forEach(element => {
            element.hidden = true;
        });
         
        form.closest(".familjeinfo").querySelector(".button-text").hidden = true;
        
        
    });
});

//funktion för att låsa och låsa upp formuläret//
function setFormLocked(locked) {
    bookingConfirmed = locked;
}


//BÖRJA OM KNAPPEN//

//hittar alla bokningsformulär//
document.querySelectorAll(".bokning").forEach(form => {
    //hämtar borjaom knappen//
    const borjaOmKnapp = form.querySelector(".borjaom");
    //registrerar klick funktion på knappen//
    borjaOmKnapp.addEventListener("click", function () {
        form.reset();
        //låser upp formuläret när man klickar på Börja om knappen//
        setFormLocked(false);
        //hittar alla klasser med input-error//
        form.querySelectorAll(".input-error").forEach(grupp => {
            //tar bort felmarkeringarna//
            grupp.classList.remove("error");
        });

        //hittar rätt rum//
        const room = form.closest(
            "#familjerum, #enkelrum, #executive, #presidentsvit"
        );

        //hittar erbjudanet som matcher rummets id och återställer priset//
        const selectedOffer = offers.find(offer => offer.id === room.id);

        if (selectedOffer) {
            updateTotal(form, selectedOffer);
            //hittar boknings klassen//
            const confirmation = form.querySelector(".bokningsbekraftelse");
            //detta som döljer elementet//
            confirmation.hidden = true;
            //detta är vad som hittar den gröna knappen och gör den synlig igen//
            form.closest(".familjeinfo").querySelector(".button-text").hidden = false;
            //gör formuläret och bokningsknappen synlig igen//
            form.querySelectorAll(
                ".formgrupp, .formgrupp2, .bekraftaBokning"
            ).forEach(element => {
                element.hidden = false;
            });
        }
    });
});