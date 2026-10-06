// Jim Spa behandlingar

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


// Jim Skapar ett behandlingskort

function createOfferCard(offer) {

    const card = document.createElement('div');
    card.classList.add('spa-card');


    const image = document.createElement('img');
    image.classList.add('spa-card-image');
    image.src = offer.image;
    image.alt = offer.name;


    const content = document.createElement('div');
    content.classList.add('spa-card-content');


    const title = document.createElement('h3');
    title.textContent = offer.name;


    const description = document.createElement('p');
    description.classList.add('spa-card-description');
    description.textContent = offer.description;


    const duration = document.createElement('p');
    duration.classList.add('spa-card-duration');
    duration.textContent = offer.duration;


    const price = document.createElement('p');
    price.classList.add('spa-card-price');
    price.textContent = `${offer.price} kr / person`;


    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(duration);
    content.appendChild(price);

    card.appendChild(image);
    card.appendChild(content);


    return card;
}


// Jim Skriver ut alla behandlingar

function renderOffers() {

    for (let i = 0; i < offers.length; i++) {

        const card = createOfferCard(offers[i]);

        offersContainer.appendChild(card);

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

    // Person 1 använder bokarens namn

    if (guestNumber === 1) {

        const customerName = nameInput.value.trim();


        if (customerName !== '') {

            return customerName;

        }


        return 'Person 1';
    }


    // Person 2-5 har frivilligt namn

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


    // Jim Behandlingsfält

    const treatmentLabel = document.createElement('label');

    treatmentLabel.textContent = 'Behandling';


    const select = document.createElement('select');


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


    return guestTreatment;
}


// Jim Skapar rätt antal personer

function renderGuestTreatments() {

    const guestCount = Number(guestInput.value);


    guestTreatmentsContainer.textContent = '';

    bookingTreatments = [];


    if (
        !Number.isInteger(guestCount) ||
        guestCount < 1 ||
        guestCount > 5
    ) {

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


    updateBookingSummary();
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


    offerError.textContent = '';


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


// Jim Hämtar dagens svenska datum

function getSwedishDate() {

    const dateParts =
        new Intl.DateTimeFormat(
            'sv-SE',
            {
                timeZone: 'Europe/Stockholm',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        ).formatToParts(new Date());


    let year = '';
    let month = '';
    let day = '';


    for (let i = 0; i < dateParts.length; i++) {

        if (dateParts[i].type === 'year') {

            year = dateParts[i].value;

        } else if (dateParts[i].type === 'month') {

            month = dateParts[i].value;

        } else if (dateParts[i].type === 'day') {

            day = dateParts[i].value;

        }

    }


    return `${year}-${month}-${day}`;
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

    selectedTreatments.textContent = '';


    const guestCount =
        Number(guestInput.value);


    updateDateAndTimeSummary();


    if (bookingTreatments.length === 0) {

        const message =
            document.createElement('p');

        message.textContent =
            'Välj behandling för varje person.';


        selectedTreatments.appendChild(
            message
        );


        totalPriceText.textContent =
            '0 kr';


        return;
    }


    // Jim Skriver ut personernas val

    for (
        let i = 0;
        i < bookingTreatments.length;
        i++
    ) {

        const treatment =
            bookingTreatments[i];


        const treatmentText =
            document.createElement('p');

        treatmentText.classList.add(
            'treatment-summary'
        );


        treatmentText.textContent =
            `Person ${treatment.guestNumber} - ${treatment.guestName}: ${treatment.offer.name} - ${treatment.offer.price} kr`;


        selectedTreatments.appendChild(
            treatmentText
        );

    }


    // Jim Visar om behandling saknas

    if (
        Number.isInteger(guestCount) &&
        bookingTreatments.length < guestCount
    ) {

        const missingTreatment =
            document.createElement('p');

        missingTreatment.classList.add(
            'treatment-summary'
        );

        missingTreatment.textContent =
            'Alla personer har inte valt behandling.';


        selectedTreatments.appendChild(
            missingTreatment
        );

    }


    const totalPrice =
        calculateTotalPrice();


    totalPriceText.textContent =
        `${totalPrice} kr`;
}


// Jim Visar fel vid formulärfält

function showError(input, message) {

    const formGroup =
        input.parentElement;


    const error =
        formGroup.querySelector('.error');


    error.textContent =
        message;
}


// Jim Tar bort fel

function clearError(input) {

    const formGroup =
        input.parentElement;


    const error =
        formGroup.querySelector('.error');


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


    if (email.includes(' ')) {

        showError(
            emailInput,
            'E-postadressen får inte innehålla blanksteg.'
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


    clearError(
        bookingTimeInput
    );


    return true;
}


// Jim Kontrollerar antal personer

function validateGuests() {

    const guestCount =
        Number(guestInput.value);


    if (
        !Number.isInteger(guestCount) ||
        guestCount < 1 ||
        guestCount > 5
    ) {

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

    const guestCount =
        Number(guestInput.value);


    if (
        bookingTreatments.length !==
        guestCount
    ) {

        offerError.textContent =
            'Välj en behandling för varje person.';


        return false;
    }


    offerError.textContent = '';


    return true;
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
        'Din bokningsförfrågan är mottagen';


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


    confirmationCard.appendChild(title);
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
}


// Jim Återställer bokningen

function resetBooking() {

    bookingForm.reset();


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

    }
);


// Jim Ändrar datum

bookingDateInput.addEventListener(
    'change',
    () => {

        updateDateAndTimeSummary();

        if (
            bookingDateInput.value !== ''
        ) {

            validateDate();

        }

    }
);


// Jim Ändrar tid

bookingTimeInput.addEventListener(
    'change',
    () => {

        updateDateAndTimeSummary();

        if (
            bookingTimeInput.value !== ''
        ) {

            validateTime();

        }

    }
);


// Jim Ändrar antal personer

guestInput.addEventListener(
    'input',
    () => {

        const guestCount =
            Number(guestInput.value);


        if (
            Number.isInteger(guestCount) &&
            guestCount >= 1 &&
            guestCount <= 5
        ) {

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


            updateBookingSummary();

        }

    }
);


// Jim Kontrollerar e-post när user skriver

emailInput.addEventListener(
    'input',
    () => {

        if (
            emailInput.value.trim() !== ''
        ) {

            validateEmail();

        } else {

            clearError(
                emailInput
            );

        }

    }
);


// Jim Skickar bokningen

bookingForm.addEventListener(
    'submit',
    (e) => {

        // Stoppar sidan från att laddas om

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


// Jim Startar Spa sidan

setMinimumDate();

renderOffers();

renderGuestTreatments();

updateDateAndTimeSummary();
updateBookingSummary();