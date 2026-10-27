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
    name: "executive",
    pricePerPerson: 800,
  },

  {
    id: "presidentsvit",
    name: "president",
    pricePerPerson: 2000,
  },
];

//hittar klasserna för alla boknings delar//
function validateUser(form) {
    const firstName  = form.querySelector(".firstName");
    const lastName = form.querySelector(".lastName");
    const phone = form.querySelector(".telePhone");
    const email = form.querySelector(".hotMail");
    const dateFrom = form.querySelector(".datumFrom");
    const dateTo = form.querySelector(".datumTill");
    const antalPersoner = form.querySelector(".antalPersoner");
    
     //funktionen som kollar av så att allt är korrekt//
     let isValid = true;
    
    //ser till att förnamn innhåller bara bokstäver och minst 2 av dem//
    if (
    !/^[A-Za-zÅÄÖåäö\s]+$/.test(firstName.value.trim()) ||
    firstName.value.trim().length < 2) 
    {
    firstName.parentElement.classList.add("error");

    isValid = false;
    
    } else {

    firstName.parentElement.classList.remove("error");
}
    
    //likaså med efternamnet//
    if (
     !/^[A-Za-zÅÄÖåäö\s]+$/.test(lastName.value.trim()) ||
     lastName.value.trim().length < 2) 
    {
     lastName.parentElement.classList.add("error");
    
    isValid = false;

} else {

     lastName.parentElement.classList.remove("error");
}
     //validerar telefonnummret//
     if(!/^\+?[0-9\s()-]{7,20}$/.test(phone.value.trim())) {
      console.log ("du måste ange telefonnummer");

      const parent = phone.parentElement;
      parent.classList.add("error");
      
      isValid = false;

     } else {
      const parent = phone.parentElement;
      parent.classList.remove("error");
     }

     //ser till att ens mail är korrekt//
     if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      

      const parent = email.parentElement;
      parent.classList.add("error")
      
      isValid = false;

     } else {
      const parent = email.parentElement;
      parent.classList.remove("error");
     }
      
     //ser till att datum är ifyllt//
     if(dateFrom.value.trim() === "") {
      

      const parent = dateFrom.parentElement;
      parent.classList.add("error");
      
      isValid = false;

     } else {
      const parent = dateFrom.parentElement
      parent.classList.remove("error");
     }

     //likaså här//
     if (dateTo.value.trim() === "") {
     

     const parent = dateTo.parentElement;
     parent.classList.add("error");

     isValid = false;

     //ser till att datum till utcheckning inte är samma eller innan incheckingen//
}    else if (
     dateFrom.value !== "" &&
     dateTo.value <= dateFrom.value
)    {
     

     const parent = dateTo.parentElement;
     parent.classList.add("error");

     isValid = false;

     } else {
     const parent = dateTo.parentElement;
     parent.classList.remove("error");
}

     const antal = Number(antalPersoner.value);
     
     //ser till att värdet är mellan 1 till 5 och att det är ett heltal//
if (
    antalPersoner.value.trim() === "" ||
    !Number.isInteger(antal) ||
    antal < 1 ||
    antal > 5
) {
    const parent = antalPersoner.parentElement;
    parent.classList.add("error");
    isValid = false;

} else {
    const parent = antalPersoner.parentElement;
    parent.classList.remove("error");
}
    //skickar tillbaka true om allt är korrekt//
    return isValid;
}

   

//räknar ut totalkostnaden//
function calculateTotal(pricePerPerson, antalPersoner) {
    const total = pricePerPerson * antalPersoner;

    return total;
}

//visar det totala priset i sek i det valda formuläret//
function updateTotal(form, selectedOffer) {
    const antalPersoner = form.querySelector(".antalPersoner");
    const totalPriceElement = form.querySelector(".totalPris");

    const antal = Number(antalPersoner.value);
    if (
    antalPersoner.value.trim() === "" ||
    !Number.isInteger(antal) ||
    antal < 1 ||
    antal > 5
) {
    totalPriceElement.value = "Antal måste vara 1-5";
    totalPriceElement.style.color = "red";
    return;
}
    const totalPrice = calculateTotal(
        selectedOffer.pricePerPerson,
        antal
    );
    
    totalPriceElement.value = `${totalPrice.toLocaleString("sv-SE")} kr`;
    totalPriceElement.style.color = "";
}

//knappen drar igång visaForm funktionen när den klickas på//
function visaForm(button) {

    //hittar html klassen familjeinfo där knappen finns//
    //fick använda closest då button funktionen är nedanför familjeinfo//
    const info = button.closest(".familjeinfo");
   
    //hittar html klassen bokning för bokning som är hidden//
    const form = info.querySelector(".bokning");
    //hittar html klassen//
    const rubrik = info.querySelector(".familjerubrik");
    //hittar html klassen//
    const text = info.querySelector(".familjetext");
    //hittar rummen i offers//   
    const room = button.closest("#familjerum, #enkelrum, #executive, #presidentsvit");
    const roomId = room.id;

    //visar rätt information för rummen//
    const selectedOffer = offers.find(offer => offer.id === roomId);
    
    
    //kollar så att formuläret är öppet//
    const isOpen = form.hidden;
    
    //Det här är va som gör att vi kan visa bokning när vi klickar på knappen//
    //form.hidden och !form.hidden är det som togglar på och hidden funktionen i html//
    form.hidden = !form.hidden;

    //Detta får rubriken och texten att försvinna//
    rubrik.hidden = isOpen;
    text.hidden = isOpen;

      if (isOpen && selectedOffer) {
        updateTotal(form, selectedOffer);
    }
    
    //återställer formuläret när den stängs//
      if (!isOpen) {
        form.reset();
    }
}

//uppdaterar priset när antalet personer ändras//
document.querySelectorAll(".bokning").forEach(form => {
    const antalPersoner = form.querySelector(".antalPersoner");
    const room = form.closest(
        "#familjerum, #enkelrum, #executive, #presidentsvit"
        
    );
    
    const selectedOffer = offers.find(
        offer => offer.id === room.id
    );

    antalPersoner.addEventListener("input", function () {
    
    

    if (selectedOffer) {
        updateTotal(form, selectedOffer);
    }
    
    
});
});

//funktion för bekräfta knappen som kollar av så att allt är korrekt//
document.querySelectorAll(".bokning").forEach(form => {
    const button = form.querySelector(".bekraftaBokning");

    button.addEventListener("click", function () {

        //kollar så att värderna är korrekta//
        const isValid = validateUser(form);

        if (!isValid) {
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

        //hittar bekräftelse delen//
        const confirmation = form.querySelector(".bokningsbekraftelse");
 

        //visar bokningsuppgifterna//
        confirmation.querySelector(".bekraftelseNamn").textContent = `${firstName} ${lastName}`;
        confirmation.querySelector(".bekraftelseTelefon").textContent = phone;
        confirmation.querySelector(".bekraftelseEmail").textContent = email;
        confirmation.querySelector(".bekraftelseAntal").textContent = antalPersoner;
        confirmation.querySelector(".bekraftelsePris").textContent = totalPris;
        confirmation.querySelector(".bekraftelseFran").textContent = dateFrom;
        confirmation.querySelector(".bekraftelseTill").textContent = dateTo;

        //döljer inmatningsfälten och bekräftelseknappen//
        form.querySelectorAll(
            ".formgrupp, .formgrupp2, .bekraftaBokning"
        ).forEach(element => {
            element.hidden = true;
        });
         
        form.closest(".familjeinfo").querySelector(".button-text").hidden = true;
        
        //visar bokningsbekräftelsen//
        confirmation.hidden = false;
    });
});

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

//hittar alla bokningsformulär//
document.querySelectorAll(".bokning").forEach(form => {
    //hittar klassen som resetar formuläret//
    const borjaOmKnapp = form.querySelector(".borjaom");
    //funktion som säger åt den att triggas när man klickar på knappen//
    borjaOmKnapp.addEventListener("click", function () {
        form.reset();

        //hittar alla klasser//
        form.querySelectorAll(".input-error").forEach(grupp => {
            //tar bort felmarkeringarna och går tillbaka till display none//
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
            //detta som gömmer klassen//
            confirmation.hidden = true;
            //dett är vad som hittar den gröna knappen och gör den synlig igen//
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