// Jim Spa behandlingar

const offers = [
    {
        id: 1,
        name: 'Svensk massage',
        description: 'En klassisk helkroppsmassage med mjuka och följsamma rörelser. Ett perfekt val för dig som vill varva ner, släppa på spänningar och lämna behandlingen med en avslappnad känsla.',
        duration: '60 minuter',
        price: 695,
        image: 'bilder/swedish.jpg'
    },
    {
        id: 2,
        name: 'Hot stone massage',
        description: 'En varm och rogivande massage där uppvärmda stenar kombineras med mjuka massagerörelser. Värmen och den lugna behandlingen skapar en omslutande spa-upplevelse för hela kroppen.',
        duration: '60 minuter',
        price: 895,
        image: 'bilder/stone.jpg'
    },
    {
        id: 3,
        name: 'Thai massage',
        description: 'En traditionell behandling som kombinerar tryck, stretch och assisterade rörelser. Ett aktivare alternativ för dig som vill mjuka upp kroppen och uppleva både energi och återhämtning.',
        duration: '60 minuter',
        price: 795,
        image: 'bilder/thai.jpg'
    }
];

// Jim Hämtar element från HTML

const offersContainer = document.querySelector('#spa-offers');

const bookingForm = document.querySelector('#booking-form');

const nameInput = document.querySelector('#customer-name');

const emailInput = document.querySelector('#customer-email');

const bookingDateInput = document.querySelector('#booking-date');

const bookingTimeInput = document.querySelector('#booking-time');

const guestInput = document.querySelector('#guest-count');

const guestTreatmentsContainer = document.querySelector('#guest-treatments');

const selectedTreatments = document.querySelector('#selected-treatments');

const summaryDate = document.querySelector('#summary-date');

const summaryTime = document.querySelector('#summary-time');

const totalPriceText = document.querySelector('#total-price');

const offerError = document.querySelector('#offer-error');

const confirmation = document.querySelector('#confirmation');

const resetButton = document.querySelector('#reset-button');

const bookingButton = document.querySelector('.booking-button');


// Jim Sparar personernas behandlingar

let bookingTreatments = [];

// Jim Sparar personernas val

let guestDetails = [];
let activeGuestNumber = 1;
let treatmentsValidated = false;

const guestPicker = document.createElement('div');
guestPicker.classList.add('spa-guest-picker');
guestPicker.setAttribute('role', 'group');
guestPicker.setAttribute('aria-label', 'Välj person för behandlingen');
offersContainer.before(guestPicker);


// Jim Visar personval ovanför bilderna

function renderGuestPicker() {
    guestPicker.textContent = '';

    const selects = guestTreatmentsContainer.querySelectorAll('select');

    for (let i = 0; i < selects.length; i++) {
        const guestNumber = i + 1;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `Person ${guestNumber}`;
        button.setAttribute('aria-pressed', guestNumber === activeGuestNumber);
        button.disabled = bookingButton.disabled;

        button.addEventListener('click', () => {
            activeGuestNumber = guestNumber;
            updateOfferCards();
        });

        guestPicker.appendChild(button);
    }
}



// Jim Skapar ett behandlingskort

function createOfferCard(offer) {

    const card = document.createElement('button');
    card.type = 'button';
    card.classList.add('spa-card');


    const image = document.createElement('img');
    image.classList.add('spa-card-image');
    image.src = offer.image;
    image.alt = offer.name;


    const content = document.createElement('span');
    content.classList.add('spa-card-content');


    const title = document.createElement('span');
    title.classList.add('spa-card-title');
    title.textContent = offer.name;


    const description = document.createElement('span');
    description.classList.add('spa-card-description');
    description.textContent = offer.description;


    const duration = document.createElement('span');
    duration.classList.add('spa-card-duration');
    duration.textContent = offer.duration;


    const price = document.createElement('span');
    price.classList.add('spa-card-price');
    price.textContent = `${offer.price} kr / person`;


    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(duration);
    content.appendChild(price);

    // Jim Bildram för zoom

    const imageFrame = document.createElement('span');
    imageFrame.classList.add('spa-card-media');
    imageFrame.appendChild(image);

    card.appendChild(imageFrame);
    card.appendChild(content);

    // Jim Väljer behandling från kortet

    card.dataset.offerId = offer.id;
    card.setAttribute('aria-pressed', 'false');

    const choiceText = document.createElement('span');
    choiceText.classList.add('spa-card-choice');
    choiceText.textContent = 'Välj för person 1';
    card.appendChild(choiceText);

    card.addEventListener('click', () => {
        selectOffer(offer.id);
    });


    return card;
}


// Jim Skriver ut alla behandlingar

function renderOffers() {

    for (let i = 0; i < offers.length; i++) {

        const card = createOfferCard(offers[i]);

        offersContainer.appendChild(card);

    }
}


// Jim Synkar kortet med formuläret

function selectOffer(offerId) {

    const select = guestTreatmentsContainer.querySelector(`#guest-treatment-${activeGuestNumber}`);

    if (select === null || select.disabled || bookingButton.disabled) {
        return;
    }

    select.value = offerId;
    updateTreatments();
    // Jim Börjar vid personuppgifterna
    if (activeGuestNumber === 1 && nameInput.value.trim() === '') {
        nameInput.focus();
    } else {
        select.focus();
    }
}


// Jim Markerar vald behandling

function updateOfferCards() {

    const select = guestTreatmentsContainer.querySelector(`#guest-treatment-${activeGuestNumber}`);
    const buttons = offersContainer.querySelectorAll('.spa-card');

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const isSelected = select !== null && select.value === button.dataset.offerId;

        // Jim Visar valt kort med text

        const choiceText = button.querySelector('.spa-card-choice');

        if (isSelected) {
            choiceText.textContent = `Vald för person ${activeGuestNumber}`;
        } else {
            choiceText.textContent = `Välj för person ${activeGuestNumber}`;
        }
        button.setAttribute('aria-pressed', isSelected);
        button.classList.toggle('spa-card-selected', isSelected);
        button.disabled = select === null || select.disabled || bookingButton.disabled;
    }

    const shortcuts = guestTreatmentsContainer.querySelectorAll('.show-treatments-button');

    for (let i = 0; i < shortcuts.length; i++) {
        shortcuts[i].disabled = bookingButton.disabled;
    }

    const personButtons = guestPicker.querySelectorAll('button');

    for (let i = 0; i < personButtons.length; i++) {
        personButtons[i].setAttribute('aria-pressed', i + 1 === activeGuestNumber);
        personButtons[i].disabled = select === null || bookingButton.disabled;
    }
}


// Jim Hämtar behandling med id

function getOfferById(offerId) {

    for (let i = 0; i < offers.length; i++) {

        if (offers[i].id === offerId) {

            return offers[i];

        }

    }


    return null;
}


// Jim Hämtar personens namn

function getGuestName(guestNumber, nameField) {

    // Jim Använder bokarens namn för person 1

    if (guestNumber === 1) {

        const customerName = nameInput.value.trim();


        if (customerName !== '') {

            return customerName;

        }


        return 'Person 1';
    }


    // Jim Frivilligt namn för person 2 till 5

    const guestName = nameField.value.trim();


    if (guestName !== '') {

        return guestName;

    }


    return `Person ${guestNumber}`;
}


// Jim Skapar val för en person

function createGuestTreatment(guestNumber) {

    const guestTreatment = document.createElement('div');
    guestTreatment.classList.add('guest-treatment');


    // Jim Rubrik för personen

    const title = document.createElement('h3');


    if (guestNumber === 1) {

        const customerName = nameInput.value.trim();


        if (customerName !== '') {

            title.textContent = `Person 1 - ${customerName}`;

        } else {

            title.textContent = 'Person 1';

        }

    } else {

        title.textContent = `Person ${guestNumber}`;

    }


    // Jim Namnfält

    const nameLabel = document.createElement('label');

    const nameField = document.createElement('input');


    if (guestNumber === 1) {

        nameLabel.textContent = 'Namn';

        nameField.type = 'text';

        nameField.value = nameInput.value.trim();

        nameField.disabled = true;

    } else {

        nameLabel.textContent = 'Namn (valfritt)';

        nameField.type = 'text';

        nameField.placeholder = `Namn på person ${guestNumber}`;

    }


    nameField.classList.add('guest-name');
    nameField.id = `guest-name-${guestNumber}`;
    nameField.name = `guestName${guestNumber}`;
    nameField.autocomplete = `section-guest${guestNumber} name`;
    nameLabel.htmlFor = nameField.id;


    // Jim Behandlingsfält

    const treatmentLabel = document.createElement('label');

    treatmentLabel.textContent = 'Behandling';


    const select = document.createElement('select');
    select.id = `guest-treatment-${guestNumber}`;
    select.name = `guestTreatment${guestNumber}`;
    treatmentLabel.htmlFor = select.id;
    select.setAttribute('aria-describedby', `${select.id}-error`);


    const defaultOption = document.createElement('option');

    defaultOption.value = '';

    defaultOption.textContent = 'Välj behandling';


    select.appendChild(defaultOption);


    // Jim Lägger behandlingarna i listan

    for (let i = 0; i < offers.length; i++) {

        const option = document.createElement('option');

        option.value = offers[i].id;

        option.textContent =
            `${offers[i].name} - ${offers[i].price} kr`;


        select.appendChild(option);

    }


    // Jim Återställer sparade val

    const savedGuest = guestDetails[guestNumber - 1];

    if (savedGuest) {
        select.value = savedGuest.offerId;

        if (guestNumber > 1) {
            nameField.value = savedGuest.name;
        }
    }

    // Jim Väljer aktiv person i formuläret

    guestTreatment.addEventListener('focusin', () => {
        activeGuestNumber = guestNumber;
        updateOfferCards();
    });

    // Jim Känner av ändrad behandling

    select.addEventListener(
        'change',
        () => {

            updateTreatments();

        }
    );


    // Jim Känner av ändrat namn

    nameField.addEventListener(
        'input',
        () => {

            updateTreatments();

        }
    );


    guestTreatment.appendChild(title);
    guestTreatment.appendChild(nameLabel);
    guestTreatment.appendChild(nameField);
    guestTreatment.appendChild(treatmentLabel);
    guestTreatment.appendChild(select);

    // Jim Felmeddelande för personens behandling

    const treatmentError = document.createElement('p');
    treatmentError.classList.add('error');
    treatmentError.id = `${select.id}-error`;
    treatmentError.setAttribute('aria-live', 'polite');
    guestTreatment.appendChild(treatmentError);

    // Jim Genväg till behandlingarna

    const showTreatmentsButton = document.createElement('button');
    showTreatmentsButton.type = 'button';
    showTreatmentsButton.classList.add('show-treatments-button');
    showTreatmentsButton.textContent = 'Se behandlingar';
    showTreatmentsButton.setAttribute('aria-label', `Se behandlingar för person ${guestNumber}`);

    showTreatmentsButton.addEventListener('click', () => {
        if (bookingButton.disabled) {
            return;
        }

        activeGuestNumber = guestNumber;
        updateOfferCards();

        const firstCard = offersContainer.querySelector('.spa-card');

        if (firstCard !== null) {
            firstCard.focus({ preventScroll: true });
            offersContainer.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
    });

    guestTreatment.appendChild(showTreatmentsButton);



    return guestTreatment;
}


// Jim Skapar rätt antal personer

function renderGuestTreatments() {

    const guestCount = Number(guestInput.value);


    const previousCount = guestTreatmentsContainer.querySelectorAll('select').length;

    if (guestCount > previousCount && previousCount > 0) {
        activeGuestNumber = previousCount + 1;
    } else {
        activeGuestNumber = Math.max(1, Math.min(activeGuestNumber, guestCount));
    }

    guestTreatmentsContainer.textContent = '';

    bookingTreatments = [];


    if (!isValidGuestCount(guestCount)) {

        updateBookingSummary();

        return;
    }


    for (let i = 1; i <= guestCount; i++) {

        const guestTreatment =
            createGuestTreatment(i);

        guestTreatmentsContainer.appendChild(
            guestTreatment
        );

    }


    offerError.textContent = '';
    renderGuestPicker();
    updateTreatments();
}


// Jim Sparar valda behandlingar och namn

function updateTreatments() {

    bookingTreatments = [];


    const guestCards =
        document.querySelectorAll('.guest-treatment');


    for (let i = 0; i < guestCards.length; i++) {

        const select =
            guestCards[i].querySelector('select');

        const nameField =
            guestCards[i].querySelector('.guest-name');


        // Jim Behåller sparade personer när antalet minskas

        guestDetails[i] = {
            name: nameField.value,
            offerId: select.value
        };

        const guestNumber = i + 1;


        const guestName =
            getGuestName(
                guestNumber,
                nameField
            );


        const offerId =
            Number(select.value);


        if (offerId !== 0) {

            const offer =
                getOfferById(offerId);


            if (offer !== null) {

                bookingTreatments.push({
                    guestNumber: guestNumber,
                    guestName: guestName,
                    offer: offer
                });

            }

        }

    }


    // Jim Behåller fel tills behandlingen är rättad

    if (treatmentsValidated) {
        validateTreatments();
    }


    updateBookingSummary();
}


// Jim Synkar bokarens namn med Person 1

function updateFirstGuestName() {

    const firstGuest =
        document.querySelector('.guest-treatment');


    if (firstGuest === null) {

        return;
    }


    const title =
        firstGuest.querySelector('h3');

    const nameField =
        firstGuest.querySelector('.guest-name');


    const customerName =
        nameInput.value.trim();


    nameField.value = customerName;


    if (customerName === '') {

        title.textContent = 'Person 1';

    } else {

        title.textContent =
            `Person 1 - ${customerName}`;

    }


    updateTreatments();
}


// Jim Räknar pris

function calculatePrice(price, amount) {

    return price * amount;
}


// Jim Räknar totalpriset

function calculateTotalPrice() {

    let totalPrice = 0;


    for (
        let i = 0;
        i < bookingTreatments.length;
        i++
    ) {

        totalPrice +=
            calculatePrice(
                bookingTreatments[i].offer.price,
                1
            );

    }


    return totalPrice;
}


// Jim Hämtar svensk tid och datum

function getSwedishDateTime() {
    const parts = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Stockholm',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(new Date());

    const values = {};

    for (let i = 0; i < parts.length; i++) {
        values[parts[i].type] = parts[i].value;
    }

    return {
        date: `${values.year}-${values.month}-${values.day}`,
        time: `${values.hour}:${values.minute}`
    };
}


// Jim Hämtar dagens svenska datum

function getSwedishDate() {
    return getSwedishDateTime().date;
}


// Jim Stoppar tidigare datum

function setMinimumDate() {

    bookingDateInput.min =
        getSwedishDate();
}


// Jim Formaterar datum till svenska

function formatBookingDate(dateValue) {

    if (dateValue === '') {

        return 'Inte valt';
    }


    const dateParts =
        dateValue.split('-');


    const year =
        Number(dateParts[0]);

    const month =
        Number(dateParts[1]) - 1;

    const day =
        Number(dateParts[2]);


    const date =
        new Date(
            year,
            month,
            day
        );


    const formattedDate =
        new Intl.DateTimeFormat(
            'sv-SE',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        ).format(date);


    return formattedDate;
}


// Jim Uppdaterar datum och tid i sammanfattningen

function updateDateAndTimeSummary() {

    const bookingDate =
        bookingDateInput.value;

    const bookingTime =
        bookingTimeInput.value;


    if (bookingDate === '') {

        summaryDate.textContent =
            'Datum: Inte valt';

    } else {

        summaryDate.textContent =
            `Datum: ${formatBookingDate(bookingDate)}`;

    }


    if (bookingTime === '') {

        summaryTime.textContent =
            'Tid: Inte vald';

    } else {

        summaryTime.textContent =
            `Tid: ${bookingTime}`;

    }
}


// Jim Uppdaterar bokningssammanfattningen

function updateBookingSummary() {

    updateOfferCards();
    selectedTreatments.textContent = '';

    const guestCount = Number(guestInput.value);
    const priceLabel = totalPriceText.parentElement.querySelector('span');

    priceLabel.textContent = 'Pris';

    if (!isValidGuestCount(guestCount)) {
        totalPriceText.textContent = 'Ange 1 till 5 personer';
        return;
    }

    // Jim Visar varje persons val

    const selects = guestTreatmentsContainer.querySelectorAll('select');

    for (let i = 0; i < selects.length; i++) {
        const offer = getOfferById(Number(selects[i].value));

        if (offer === null) {
            const missingTreatment = document.createElement('p');
            missingTreatment.classList.add('treatment-summary');
            missingTreatment.textContent = `Person ${i + 1} behöver välja behandling.`;
            selectedTreatments.appendChild(missingTreatment);
        }
    }

    if (bookingTreatments.length === 0) {
        totalPriceText.textContent = 'Välj behandling';
        return;
    }

    for (let i = 0; i < bookingTreatments.length; i++) {
        const treatment = bookingTreatments[i];
        const treatmentText = document.createElement('p');
        treatmentText.classList.add('treatment-summary');
        treatmentText.textContent =
            `Person ${treatment.guestNumber} - ${treatment.guestName}: ${treatment.offer.name} - ${treatment.offer.price} kr`;
        selectedTreatments.appendChild(treatmentText);
    }

    // Jim Skiljer delsumma från totalpris

    if (bookingTreatments.length < guestCount) {
        priceLabel.textContent = 'Delsumma';
    } else {
        priceLabel.textContent = 'Totalt';
    }

    totalPriceText.textContent = `${calculateTotalPrice()} kr`;
}


// Jim Visar fel vid formulärfält

function showError(input, message) {

    const formGroup =
        input.parentElement;


    const error =
        formGroup.querySelector('.error');


    // Jim Kopplar felet till fältet

    error.id = `${input.id}-error`;
    input.setAttribute('aria-describedby', error.id);
    input.setAttribute('aria-invalid', 'true');

    error.textContent =
        message;
}


// Jim Tar bort fel

function clearError(input) {

    const formGroup =
        input.parentElement;


    const error =
        formGroup.querySelector('.error');


    input.removeAttribute('aria-invalid');
    error.textContent = '';
}


// Jim Kontrollerar namn

function validateName() {

    const customerName =
        nameInput.value.trim();


    if (customerName === '') {

        showError(
            nameInput,
            'Du måste skriva ditt namn.'
        );


        return false;
    }


    clearError(nameInput);


    return true;
}


// Jim Kontrollerar e-post

function validateEmail() {

    const email =
        emailInput.value.trim();


    if (email === '') {

        showError(
            emailInput,
            'Du måste skriva din e-postadress.'
        );


        return false;
    }


    // Jim Kontrollerar blanktecken i adressen

    let hasWhitespace = false;

    for (let i = 0; i < email.length; i++) {
        if (email[i].trim() === '') {
            hasWhitespace = true;
        }
    }

    if (hasWhitespace) {

        showError(
            emailInput,
            'E-postadressen får inte innehålla blanktecken.'
        );


        return false;
    }


    const emailParts =
        email.split('@');


    if (emailParts.length !== 2) {

        showError(
            emailInput,
            'E-postadressen måste innehålla exakt ett @.'
        );


        return false;
    }


    const emailName =
        emailParts[0];

    const emailDomain =
        emailParts[1];


    if (
        emailName === '' ||
        emailDomain === ''
    ) {

        showError(
            emailInput,
            'Det måste finnas text före och efter @.'
        );


        return false;
    }


    if (
        !emailDomain.includes('.')
    ) {

        showError(
            emailInput,
            'Domänen måste innehålla en punkt.'
        );


        return false;
    }


    const domainParts =
        emailDomain.split('.');


    if (
        emailDomain.includes('..') ||
        domainParts[0] === '' ||
        domainParts[
            domainParts.length - 1
        ] === ''
    ) {

        showError(
            emailInput,
            'Skriv en giltig e-postadress.'
        );


        return false;
    }


    clearError(emailInput);


    return true;
}


// Jim Kontrollerar datum

function validateDate() {

    const bookingDate =
        bookingDateInput.value;


    if (bookingDate === '') {

        showError(
            bookingDateInput,
            'Du måste välja ett datum.'
        );


        return false;
    }


    if (
        bookingDate <
        getSwedishDate()
    ) {

        showError(
            bookingDateInput,
            'Du kan inte välja ett tidigare datum.'
        );


        return false;
    }


    clearError(
        bookingDateInput
    );


    return true;
}


// Jim Kontrollerar tid

function validateTime() {

    if (
        bookingTimeInput.value === ''
    ) {

        showError(
            bookingTimeInput,
            'Du måste välja en tid.'
        );


        return false;
    }


    // Jim Stoppar tider som redan har passerat

    const now = getSwedishDateTime();

    if (bookingDateInput.value === now.date && bookingTimeInput.value <= now.time) {
        showError(bookingTimeInput, 'Tiden har passerat. Välj en senare tid eller ett annat datum.');
        return false;
    }

    clearError(bookingTimeInput);


    return true;
}


// Jim Kontrollerar giltigt antal personer

function isValidGuestCount(guestCount) {
    return Number.isInteger(guestCount) &&
        guestCount >= 1 &&
        guestCount <= 5;
}


// Jim Kontrollerar antal personer

function validateGuests() {

    const guestCount =
        Number(guestInput.value);


    if (!isValidGuestCount(guestCount)) {

        showError(
            guestInput,
            'Antal personer måste vara ett heltal mellan 1 och 5.'
        );


        return false;
    }


    clearError(
        guestInput
    );


    return true;
}


// Jim Kontrollerar behandlingarna

function validateTreatments() {

    treatmentsValidated = true;

    const guestCount = Number(guestInput.value);
    const selects = guestTreatmentsContainer.querySelectorAll('select');

    if (!isValidGuestCount(guestCount)) {
        offerError.textContent = '';
        return false;
    }

    let allValid = selects.length === guestCount;

    // Jim Visar fel vid rätt person

    for (let i = 0; i < selects.length; i++) {
        const offer = getOfferById(Number(selects[i].value));

        if (offer === null) {
            showError(selects[i], `Välj en behandling för person ${i + 1}.`);
            allValid = false;
        } else {
            clearError(selects[i]);
        }
    }

    if (allValid) {
        offerError.textContent = '';
    } else {
        offerError.textContent = 'Välj en behandling för varje person.';
    }

    return allValid;
}


// Jim Visar bokningsbekräftelsen

function showConfirmation() {

    const customerName =
        nameInput.value.trim();

    const customerEmail =
        emailInput.value.trim();

    const guestCount =
        Number(guestInput.value);

    const bookingDate =
        bookingDateInput.value;

    const bookingTime =
        bookingTimeInput.value;

    const totalPrice =
        calculateTotalPrice();


    confirmation.textContent = '';


    const confirmationCard =
        document.createElement('div');

    confirmationCard.classList.add(
                'confirmation-card'
    );


    const title =
        document.createElement('h3');

    title.textContent =
        'Tack för din bokning!';


    const name =
        document.createElement('p');

    name.textContent =
        `Bokning för: ${customerName}`;


    const email =
        document.createElement('p');

    email.textContent =
        `E-post: ${customerEmail}`;


    const date =
        document.createElement('p');

    date.textContent =
        `Datum: ${formatBookingDate(bookingDate)}`;


    const time =
        document.createElement('p');

    time.textContent =
        `Tid: ${bookingTime}`;


    const guests =
        document.createElement('p');

    guests.textContent =
        `Antal personer: ${guestCount}`;


    // Jim Visar bokningsmeddelandet

    title.id = 'confirmation-title';
    confirmationCard.setAttribute('tabindex', '-1');
    confirmationCard.setAttribute('role', 'region');
    confirmationCard.setAttribute('aria-labelledby', title.id);

    const notice = document.createElement('p');
    notice.textContent = 'Hotellet har mottagit er bokning. Varmt välkomna!';

    confirmationCard.appendChild(title);
    confirmationCard.appendChild(notice);
    confirmationCard.appendChild(name);
    confirmationCard.appendChild(email);
    confirmationCard.appendChild(date);
    confirmationCard.appendChild(time);
    confirmationCard.appendChild(guests);


    // Jim Visar varje persons behandling

    for (
        let i = 0;
        i < bookingTreatments.length;
        i++
    ) {

        const treatment =
            bookingTreatments[i];


        const treatmentText =
            document.createElement('p');


        treatmentText.textContent =
            `Person ${treatment.guestNumber} - ${treatment.guestName}: ${treatment.offer.name}, ${treatment.offer.duration}, ${treatment.offer.price} kr`;


        confirmationCard.appendChild(
            treatmentText
        );

    }


    // Jim Visar totalpriset

    const price =
        document.createElement('p');

    price.classList.add(
        'confirmation-total'
    );

    price.textContent =
        `Totalt pris: ${totalPrice} kr`;


    confirmationCard.appendChild(
        price
    );


    confirmation.appendChild(
        confirmationCard
    );
}


// Jim Låser bokningen efter godkänd bokning

function disableBooking() {

    nameInput.disabled = true;

    emailInput.disabled = true;

    bookingDateInput.disabled = true;

    bookingTimeInput.disabled = true;

    guestInput.disabled = true;


    const guestNames =
        document.querySelectorAll(
            '.guest-name'
        );


    for (
        let i = 0;
        i < guestNames.length;
        i++
    ) {

        guestNames[i].disabled = true;

    }


    const selects =
        document.querySelectorAll(
            '.guest-treatment select'
        );


    for (
        let i = 0;
        i < selects.length;
        i++
    ) {

        selects[i].disabled = true;

    }


    bookingButton.disabled = true;
    updateOfferCards();
}


// Jim Återställer bokningen

function resetBooking() {

    bookingForm.reset();
    treatmentsValidated = false;
    guestDetails = [];
    activeGuestNumber = 1;


    nameInput.disabled = false;

    emailInput.disabled = false;

    bookingDateInput.disabled = false;

    bookingTimeInput.disabled = false;

    guestInput.disabled = false;

    bookingButton.disabled = false;


    guestInput.value = 1;


    bookingTreatments = [];


    clearError(nameInput);

    clearError(emailInput);

    clearError(bookingDateInput);

    clearError(bookingTimeInput);

    clearError(guestInput);


    offerError.textContent = '';

    confirmation.textContent = '';


    setMinimumDate();

    renderGuestTreatments();

    updateDateAndTimeSummary();
}


// Jim Synkar namn med Person 1

nameInput.addEventListener(
    'input',
    () => {

        updateFirstGuestName();

        // Jim Kontrollerar namnet när ett fel rättas

        if (nameInput.getAttribute('aria-invalid') === 'true') {
            validateName();
        }

    }
);


// Jim Ändrar datum

bookingDateInput.addEventListener('change', () => {
    updateDateAndTimeSummary();

    if (bookingDateInput.value !== '' || bookingDateInput.getAttribute('aria-invalid') === 'true') {
        validateDate();
    }

    // Jim Kontrollerar tiden igen när datumet ändras

    if (bookingTimeInput.value !== '' || bookingTimeInput.getAttribute('aria-invalid') === 'true') {
        validateTime();
    }
});


// Jim Ändrar tid

bookingTimeInput.addEventListener('change', () => {
    updateDateAndTimeSummary();
    validateTime();
});


// Jim Ändrar antal personer

guestInput.addEventListener(
    'input',
    () => {

        const guestCount =
            Number(guestInput.value);


        if (isValidGuestCount(guestCount)) {

            clearError(
                guestInput
            );

            renderGuestTreatments();

        } else {

            showError(
                guestInput,
                'Antal personer måste vara ett heltal mellan 1 och 5.'
            );


            guestTreatmentsContainer.textContent =
                '';


            bookingTreatments =
                [];

            offerError.textContent = '';
            updateBookingSummary();

        }

    }
);


// Jim Kontrollerar e-post även när fältet töms

emailInput.addEventListener('input', () => {
    validateEmail();
});


// Jim Skickar bokningen

bookingForm.addEventListener(
    'submit',
    (e) => {

        // Jim Stoppar sidan från att laddas om

        e.preventDefault();


        const nameIsValid =
            validateName();

        const emailIsValid =
            validateEmail();

        const dateIsValid =
            validateDate();

        const timeIsValid =
            validateTime();

        const guestsAreValid =
            validateGuests();

        const treatmentsAreValid =
            validateTreatments();


        // Jim Visar bekräftelse om allt är korrekt

        if (
            nameIsValid &&
            emailIsValid &&
            dateIsValid &&
            timeIsValid &&
            guestsAreValid &&
            treatmentsAreValid
        ) {

            updateTreatments();

            showConfirmation();

            disableBooking();

            // Jim Flyttar fokus till bekräftelsen

            confirmation.querySelector('.confirmation-card').focus();

        } else {

            // Jim Flyttar fokus till första felet

            const firstInvalidField = bookingForm.querySelector('[aria-invalid="true"]');

            if (firstInvalidField !== null) {
                firstInvalidField.focus();
            }
        }

    }
);


// Jim Börjar om bokningen

resetButton.addEventListener(
    'click',
    () => {

        resetBooking();

    }
);


// Jim Startar Spa-sidan

setMinimumDate();

renderOffers();

renderGuestTreatments();

updateDateAndTimeSummary();

