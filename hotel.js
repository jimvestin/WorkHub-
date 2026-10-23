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
    
    //kollar så att formuläret är öppet//
    const isOpen = form.hidden;
    
    //Det här är va som gör att vi kan visa bokning när vi klickar på knappen//
    //form.hidden och !form.hidden är det som togglar på och hidden funktionen i html//
    form.hidden = !form.hidden;

    //Detta får rubriken och texten att försvinna//
    rubrik.hidden = isOpen;
    text.hidden = isOpen;
    
    //återställer formuläret när den stängs//
      if (!isOpen) {
        form.reset();
    }
}



