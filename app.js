// initialize card variables
let cards = [];

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

        // deal cards
        dealCards(cards);

        console.log(cards);
    })
    .catch((error) => {
        console.log("Error fetching card data:", error);
    }); // end fetch

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
}
