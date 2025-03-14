function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const appOptions = document.getElementById("app-options");
const cardApp = document.getElementById("card-app");
const endGameApp = document.getElementById("end-game");
const restartApp = document.getElementById("restart-game");

const containerOptions = document.createElement("div");
containerOptions.classList.add("container-options");

const optionsTitle = document.createElement("h2");
optionsTitle.textContent = "Choose the difficulty level";

appOptions.append(containerOptions);

const gameField = document.createElement("div");
gameField.classList.add("game-field");

const difficultyLevels = {
  easy: 10,
  medium: 16,
  hard: 24,
};

const cardsInfo = [];
const cardsNumbers = [];

const continueGame = document.getElementById("continue-game");
const newGame = document.getElementById("new-game");

if (localStorage.getItem("cardsInfo")) {
  restartApp.classList.toggle("d-none");
  continueGame.addEventListener("click", continueGames);
  newGame.addEventListener("click", startNewGame);
} else {
  gameOptions(difficultyLevels);
}

function continueGames() {
  restartApp.classList.toggle("d-none");
  cardApp.classList.toggle("d-none");
  gameField.classList.toggle(localStorage.getItem("dataLevel"));
  const restartGame = JSON.parse(localStorage.getItem("cardsInfo"));
  for (let restartCard of restartGame) {
    if (restartCard.status === "open") {
      restartCard.status = "close";
    }
    cardsInfo.push(restartCard);
  }

  createGameField(cardsInfo);
}

function gameOptions(difficultyLevels) {
  containerOptions.append(optionsTitle);
  appOptions.classList.toggle("d-none");
  for (let key in difficultyLevels) {
    const buttons = document.createElement("button");
    buttons.setAttribute("data-id", difficultyLevels[key]);
    buttons.setAttribute("data-level", key);
    buttons.innerText = key;
    buttons.classList.add("btn");
    buttons.addEventListener("click", selectOption);
    containerOptions.append(buttons);
  }
}

function selectOption(e) {
  if (e.target.getAttribute("data-level") == "easy") {
    contCell = e.target.getAttribute("data-id");
    window.localStorage.setItem("dataLevel", "easy");
    gameField.classList.add("easy");
  }
  if (e.target.getAttribute("data-level") == "medium") {
    contCell = e.target.getAttribute("data-id");
    window.localStorage.setItem("dataLevel", "medium");
    gameField.classList.add("medium");
  }
  if (e.target.getAttribute("data-level") == "hard") {
    contCell = e.target.getAttribute("data-id");
    window.localStorage.setItem("dataLevel", "hard");
    gameField.classList.add("hard");
  }
  appOptions.classList.toggle("d-none");
  cardApp.classList.toggle("d-none");
  createNumberCards(contCell);
  createCardsInfo(cardsNumbers);
  createGameField(cardsInfo);
}

function createNumberCards(contCell) {
  for (let i = 1; i <= contCell; i++) {
    cardsNumbers.push(i);
    cardsNumbers.push(i);
  }
  shuffle(cardsNumbers);
}

function createCardsInfo(cardsNumbers) {
  for (let i = 0; i < cardsNumbers.length; i++) {
    const info = {
      id: i + 1,
      number: cardsNumbers[i],
      status: "close",
    };
    cardsInfo.push(info);
  }
}

function createGameField(cardsInfo) {
  gameField.innerHTML = "";
  cardsInfo.forEach((cardInfo) => {
    const card = document.createElement("div");
    card.classList.add("game-card");

    const flipCardInner = document.createElement("div");
    flipCardInner.classList.add("flip-card-inner");

    const flipCardFront = document.createElement("div");
    flipCardFront.classList.add("flip-card-front");
    flipCardFront.innerHTML = `<img src="./image/shirt.png" alt="Avatar" style="width: 105px; height: 150px" />`;

    const flipCardBack = document.createElement("div");
    flipCardBack.classList.add("flip-card-back");

    card.setAttribute("data-number", `${cardInfo.number}`);
    card.setAttribute("id", `${cardInfo.id}`);
    if (cardInfo.status === "open" || cardInfo.status === "completed") {
      card.classList.add("openCard");
    } else {
      card.classList.remove("openCard");
    }

    const cardNumber = document.createElement("span");
    cardNumber.classList.add("cardNumber");
    cardNumber.innerHTML = cardInfo.number;

    flipCardBack.append(cardNumber);
    flipCardInner.append(flipCardBack);
    flipCardInner.append(flipCardFront);
    card.append(flipCardInner);
    gameField.append(card);

    card.addEventListener("click", openCard);
  });
  cardApp.append(gameField);
}

function openCard(e) {
  const _id = e.currentTarget.getAttribute("id");
  const openCardInfo = (element) => {
    return element.id == _id;
  };

  const openCard = cardsInfo.find(openCardInfo);

  if (openCard.status === "completed") {
    return;
  }
  if (openCard.status === "close") {
    openCard.status = "open";
    e.currentTarget.classList.add("openCard");
  }

  const openCards = cardsInfo.filter(function (card) {
    return card.status === "open";
  });

  if (openCards.length > 2) {
    openCards.forEach((card) => {
      card.status = "close";
    });
    openCards.length = 0;
    createGameField(cardsInfo);
    return;
  }

  setTimeout(function () {
    if (openCards.length === 2) {
      if (openCards[0].number === openCards[1].number) {
        for (const card of openCards) {
          card.status = "completed";
        }
        openCards.length = 0;
      } else {
        for (const card of openCards) {
          card.status = "close";
        }
        openCards.length = 0;
      }

      createGameField(cardsInfo);
    }
    window.localStorage.setItem("cardsInfo", JSON.stringify(cardsInfo));
    endGames(cardsInfo);
  }, 800);
}

function endGames(cards) {
  const completedCards = cardsInfo.filter(function (card) {
    return card.status === "completed" || card.status === "open";
  });
  if (completedCards.length === cardsInfo.length) {
    window.localStorage.removeItem("cardsInfo");
    cardApp.classList.toggle("d-none");
    endGameApp.classList.toggle("d-none");

    const endGameContainer = document.createElement("div");
    endGameContainer.classList.add("end_game-container");
    const endTitle = document.createElement("h2");
    endTitle.classList.add("options-title");
    endTitle.textContent = "Well done";
    const button = document.createElement("button");
    button.textContent = "New game";
    button.classList.add("btn");
    button.addEventListener("click", startNewGame);

    endGameContainer.append(endTitle);
    endGameContainer.append(button);
    endGameApp.append(endGameContainer);
  }
}

function startNewGame() {
  window.localStorage.removeItem("cardsInfo");
  window.localStorage.removeItem("dataLevel");
  cardsInfo.length = 0;
  cardsNumbers.length = 0;
  containerOptions.innerHTML = "";
  gameField.classList.remove("easy");
  gameField.classList.remove("medium");
  gameField.classList.remove("hard");
  restartApp.classList.add("d-none");
  cardApp.classList.add("d-none");
  endGameApp.classList.add("d-none");
  gameOptions(difficultyLevels);
}
