// initialize card variables
let cards = [];

// implement the Fetch API to grab the card JSON file
async function loadCards() {
    try {
        // fetch the JSON file
        let response = await fetch("./data/card_info.json");
        // parse the JSON file
        let cardsArray = await response.json();
        console.log(cardsArray);
    } catch (error) {
        console.log(error);
    }
}