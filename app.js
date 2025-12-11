// initialize card variables
let cards = [];
let cardTable = document.querySelector(".card-table");

// Fetch JSON Data (rather than with async function)
fetch("./data/card_info.json")
    .then(response => response.json())  // parse JSON data
    .then((data) => {
        // option A using MAP
        // const cardsWithMap = data.map(card => [card, card]).flat();;
        // console.log("Cards with Map:", cardsWithMap);

        // option B using flatmap()
        // const cardsWithFlatMap = data.flatMap(card => [card, card]);
        // console.log("Cards with FlatMap:", cardsWithFlatMap);

        // option C with spread operator, unpacks array into new array ...
        cards = [...data, ...data];
        
        // shuffle cards
        cards = shuffle(cards);
        
        // deal cards
        dealCards(cards);

        console.log(cards);
    })
    .catch((error) => {
        console.log("Error fetching card data:", error);
    }); // end fetch

    // define shuffle function with Fisher-Yates algorithm
    function shuffle(array) {
        // create a copy of the array to avoid mutating the original
        let shuffledCardsArray = [...cards];
        let totalCards = shuffledCardsArray.length;
        let currentIndex = totalCards - 1;

        // option 1 — loop through elements from last to first
        for(currentIndex; currentIndex > 0; currentIndex--) {
            // generate random index
            let randomCardIndex = Math.floor(Math.random() * (currentIndex + 1));
            
            // swap elements at currentIndex and randomCardIndex
            let randomCard = shuffledCardsArray[randomCardIndex];
            console.log("Random Card:", randomCard);

            // replace random card with current card
            shuffledCardsArray[randomCardIndex] = shuffledCardsArray[currentIndex];
            console.log("shuffledCardsArrayStep1: ", [...shuffledCardsArray]);

            // replace current card with random card
            shuffledCardsArray[currentIndex] = randomCard;
            console.log("shuffledCardsArrayStep2: ", [...shuffledCardsArray]);
        };

        return shuffledCardsArray;
    }; // end shuffle function


// implement the Fetch API to grab the card JSON file
// async function loadCards() {
//    try {
//        // fetch the JSON file
//        let response = await fetch("./data/card_info.json");
//        // parse the JSON file
//        let cardsArray = await response.json();
//        console.log(cardsArray);
//    } catch (error) {
//        console.log(error);
//    }
//}

function dealCards(cards) {
    console.log("Dealing Cards... good luck!");
        // fragment for option B, below
    let fragment = document.createDocumentFragment();
    for (const card of cards) {
        // option A: create directly

        // create the card wrapper:
        // let cardElement = document.createElement("div");
        // cardElement.classList.add("card");
        // cardElement.setAttribute("data-name", card.name);
        // // create the front face and back face
        // cardElement.innerHTML = `
        //     <div class="card-front">
        //         <img class="back-image" src="${card.image}" alt="${card.name}">
        //     </div>
        //     <div class="card-back"></div>
        // `;
        // // append to the game board
        // cardTable.appendChild(cardElement);

        // option B: create using fragments
        //using fragments to minimize reflows (using append may trigger
        // multiple reflows which is inefficient)
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        
        // create the front face and back face
        const frontCardDiv = document.createElement("div");
        frontCardDiv.classList.add("card-front");
        const backCardDiv = document.createElement("div");
        backCardDiv.classList.add("card-back");
        
        // add front image element
        const frontImg = document.createElement("img");
        frontImg.src = `${card.image}`;
        frontImg.alt = `${card.name}`;
        frontCardDiv.appendChild(frontImg);
        
        // For the back (same for all cards)
        const backImg = document.createElement("img");
        backImg.src = "./images/cardBack.png";  // hardcoded
        backImg.alt = "Card back";
        backCardDiv.appendChild(backImg);

        // append front and back to card element
        cardElement.appendChild(backCardDiv);
        cardElement.appendChild(frontCardDiv);
        // append card element to fragment
        fragment.appendChild(cardElement);

    } // end for loop

    // append fragment to card table in the DOM
    cardTable.appendChild(fragment);

    // attach event listeners to cards after they are dealt
    const dealtCards = document.querySelectorAll(".card");
    dealtCards.forEach(card => {
        card.addEventListener("click", flipCard);
        });


} // end dealCards

function flipCard() {
    console.log(this);
    // add flipped class to this card
    this.classList.add("flipped");
    
}
