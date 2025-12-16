// initialize card variables
let cards = [];
let cardTable = document.querySelector(".card-table");
firstCard = null;
secondCard = null;
let noFlipping = false;
let triesRemaining = 6; // set number of tries
let winCounter = null; // update on each card match

// display tries remaining in the DOM
// option A: using querySelector
let counter = document.querySelector(".tries-remaining");
counter.textContent = triesRemaining;

// option B: using getElementsByClassName
//document.getElementsByClassName("tries-remaining")[0].textContent = triesRemaining;

// Fetch JSON Data (rather than with async function)
fetch("./data/card_info.json")
    .then(response => response.json())  // parse JSON data
    .then((data) => {
        winCounter = data.length; // set winCounter to number of unique cards

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
        //for(currentIndex; currentIndex > 0; currentIndex--) {
        //    // generate random index
        //    let randomCardIndex = Math.floor(Math.random() * (currentIndex + 1));
        //    
        //    // swap elements at currentIndex and randomCardIndex
        //    let randomCard = shuffledCardsArray[randomCardIndex];
        //    console.log("Random Card:", randomCard);
//
        //    // replace random card with current card
        //    shuffledCardsArray[randomCardIndex] = shuffledCardsArray[currentIndex];
        //    console.log("shuffledCardsArrayStep1: ", [...shuffledCardsArray]);
//
        //    // replace current card with random card
        //    shuffledCardsArray[currentIndex] = randomCard;
        //    console.log("shuffledCardsArrayStep2: ", [...shuffledCardsArray]);

        // option 2 swap elements using destructuring assignment
        for (currentIndex; currentIndex > 0; currentIndex--) {
            // generate random index
            let randomCardIndex = Math.floor(Math.random() * (currentIndex + 1));
            
            // swap using destructuring assignment
            [shuffledCardsArray[currentIndex], shuffledCardsArray[randomCardIndex]] =
                [shuffledCardsArray[randomCardIndex], shuffledCardsArray[currentIndex]];

        };

        return shuffledCardsArray;
    }; // end shuffle function
    
function dealCards(cards) {
    console.log("Dealing Cards... good luck!");
        // fragment for option B, below
    let fragment = document.createDocumentFragment();
    for (const card of cards) {
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
        // attach card element to fragment
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
    if(noFlipping) return; // prevent flipping when two cards are being compared

    // add flipped class to this card
    this.classList.add("flipped");
    
    if(!firstCard) {
        firstCard = this;

        // prevent clicking the same card twice:
        firstCard.removeEventListener("click", flipCard);
        return; // exit function and await second card
    }
    secondCard = this;

    // prevent further flipping until match check is complete
    noFlipping = true;

    // check for match
    checkForMatch();

}; // end flipCard

function checkForMatch() {
    // compare data-name attributes of firstCard and secondCard
    let isMatch = (firstCard.dataset.name === secondCard.dataset.name); 
    console.log("isMatch: ", isMatch);
    
    // could instead use this with an if statement:
    // let firstCardName = firstCard.dataset.name;
    // let secondCardName = secondCard.dataset.name;
    // if(firstCardName === secondCardName) {... etc

    // using ternary operator to call appropriate function
    isMatch ? matchCards() : unflipCards();
    

}; // end checkForMatch

function unflipCards() {
    // wait 1 second, then remove flipped class from both cards
    setTimeout(() => {
        // check if player has lost the game
        --triesRemaining;
        counter.textContent = triesRemaining;
        if (triesRemaining <= 0) {
            // alert("Sadly, you lost the game. Better luck next time!");
            showLosingImage();
            // Optionally, reset the game or disable further play here
            return;
        }
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard.addEventListener("click", flipCard);
        secondCard.addEventListener("click", flipCard);
        // reset flags
        resetFlags();
    }, 1000);
}; // end unflipCards 

function resetFlags() {
    // reset firstCard, secondCard, and noFlipping flag
    firstCard = null;
    secondCard = null;
    noFlipping = false; // allow unmatched cards to be flipped
}; // end resetFlags

function matchCards() {
    // log match to console
    console.log("It's a match!");

    // decrement winCounter
    --winCounter;
    console.log("winCounter: ", winCounter);

    // check for win condition
    if (winCounter === 0) {
        setTimeout(() => {
            // show youWin image
            showWinningImage();
            // create stars at intervals
            let starInterval = setInterval(createStar, 100);
            // stop creating stars after 10 seconds
            setTimeout(() => {
                clearInterval(starInterval);
            }, 5000);
        }, 1000);
    };

    // remove event listeners from both matched cards
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    
    // add a new appearance effect for matched cards
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    
    // reset flags to continue play
    resetFlags();
}; // end matchCards

function showWinningImage() {
    //  create a div wrapper for the losing image
    let wrapper = document.createElement("div");
    // add class for css styling
    wrapper.classList.add("winning-image-wrapper");
    // create the image element
    let winningImage = document.createElement("img");
    // set image source and alt text
    winningImage.src = "./images/youWin.png";
    winningImage.alt = "You Win!";
    // append image to wrapper
    wrapper.appendChild(winningImage);
    // append wrapper to DOM body
    document.body.appendChild(wrapper);
    
    // transition opacity for fade-in effect
    requestAnimationFrame(() => {
        wrapper.style.opacity = 1;
    }); // added this missing ; to debug

    // add button and functionality to reset the game
    let resetButton = document.createElement("button");

    // set button text and class
    resetButton.textContent = "Play Again";
    resetButton.classList.add("reset-button");

    wrapper.appendChild(resetButton);
    resetButton.addEventListener("click", () => {
        // remove losing image wrapper from DOM
        document.body.removeChild(wrapper);

        wrapper.style.opacity = 1;

        // reset game state
        location.reload(); // simple way to reset the game
    });
}

function showLosingImage() {
    //  create a div wrapper for the losing image
    let wrapper = document.createElement("div");
    // add class for css styling
    wrapper.classList.add("losing-image-wrapper");
    // create the image element
    let losingImage = document.createElement("img");
    // set image source and alt text
    losingImage.src = "./images/youLose.png";
    losingImage.alt = "You Lose!";
    // append image to wrapper
    wrapper.appendChild(losingImage);
    // append wrapper to DOM body
    document.body.appendChild(wrapper);
    
    // small delay to allow for CSS transition
    setTimeout(() => {
        wrapper.style.opacity = 1;
    }, 10);

    // add button and functionality to reset the game
    let resetButton = document.createElement("button");

    // set button text and class
    resetButton.textContent = "Play Again";
    resetButton.classList.add("reset-button");

    wrapper.appendChild(resetButton);
    resetButton.addEventListener("click", () => {
        // remove losing image wrapper from DOM
        document.body.removeChild(wrapper);

        // reset game state
        location.reload(); // simple way to reset the game
    });
}; // end showLosingImage

function createStar() {
    // create star div element
    let star = document.createElement("div");
    star.classList.add("star");
    // style the stars
        // set random horizontal position
    let randomX = Math.random() * window.innerWidth;
    star.style.left = `${randomX}px`;
        // set random animation duration between 3 and 5 seconds
    let duration = Math.random()*3 + 2;
    star.style.animationDuration = `${duration}s`;
        // set random size between 5px and 20px
    let size = Math.random() * 15 + 5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    // append star to star-wrapper div
    document.getElementsByClassName("star-wrapper")[0].appendChild(star);
    // remove star after animation completes to prevent DOM overload
    star.addEventListener("animationend", () => {
        star.parentNode.removeChild(star);
    });


}; // end createStars
