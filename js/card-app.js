(() => {

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createCardApp(container, contCell = 16) {

        if (contCell % 2) {
            console.log('error number! use an even number');
            return;
        }

        const cardApp = document.getElementById('card-app');

        const gameField = document.createElement('div');
        gameField.classList.add('game-field');

        let gameCards;

        let cardNumber;

        let arrCardNumbers = [];


        for (let i = 1; i <= contCell / 2; i++) {
            arrCardNumbers.push(i);
            arrCardNumbers.push(i);
        };

        shuffle(arrCardNumbers);

        

        for (let i = 0; i < arrCardNumbers.length; i++) {

            gameCards = document.createElement('div');
            gameCards.classList.add('game-cards');
            gameCards.style.backgroundColor = 'black';

            cardNumber = document.createElement('span');
            cardNumber.classList.add('cardNumber');
            cardNumber.innerHTML = arrCardNumbers[i];


            gameCards.append(cardNumber);
            gameField.append(gameCards);

            gameCards.addEventListener('click', function () {
                if (this.style.backgroundColor) {
                    this.style.backgroundColor = null;
                } else {
                    this.style.backgroundColor = 'black';
                }
            });

        }

        

        



        cardApp.append(gameField);


        

        
        
    }



    window.createCardApp = createCardApp;

})();