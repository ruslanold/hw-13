const currentDate = () => {
    //формат: "27/07/2018, 03:24:53" .
    const options = {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
    return new Date().toLocaleDateString('en-GB', options)
}


function userCard(number) {

    const historyLogs = []
    const key = Math.round(1 - 0.5 + Math.random() * (number - 1 + 1))
    let balance = 100
    let transactionLimit = 100

    function addHistioryLog(operationType, credits, operationTime) {
        historyLogs.push({
            operationType: operationType,
            credits: credits,
            operationTime: operationTime
        })
        return historyLogs[historyLogs.length - 1]
    }

    function getCardOptions() {
        return {
            balance,
            transactionLimit,
            historyLogs,
            key,
        }
    }

    function putCredits(money) {
        balance += money
        return addHistioryLog('Received credits', money, currentDate())

    }

    function takeCredits(money) {
        if(!transactionLimit) return console.error('Лимит исчерпан')
        if(balance < money) return console.error('На балансе не хватает грошей')
        transactionLimit--
        balance -= money
        return addHistioryLog('Withdrawal of credits', money, currentDate())
    }

    function setTransactionLimit (numberLimit) {
        addHistioryLog('Transaction limit change', numberLimit, currentDate())
        transactionLimit = numberLimit
    }

    function transferCredits (money, card) {
        let commission = money 
        takeCredits(commission += money * 0.05)
        card.putCredits(money)
    }

    return {
        getCardOptions,
        putCredits,
        takeCredits,
        setTransactionLimit,
        transferCredits
    }
}

class UserAccount {
    constructor(name){
        this.name = name
        this.cards = []
    }

    addCard() {
        if(this.cards.length > 3) return console.error('Нельзя иметь больше 3 карт')
        this.cards.push(userCard(3))
    }
    getCardByKey(number) {
        return this.cards[number]
    }

}

//Приклад переказу коштів:
console.log('Приклад переказу коштів:---------------------------------')

let user = new UserAccount('Bob');
user.addCard()
user.addCard()
let card1 = user.getCardByKey(0);
let card2 = user.getCardByKey(1);
card1.putCredits(500);
card1.setTransactionLimit(800);
card1.transferCredits(300, card2);
card2.takeCredits(50)

console.log('card1',card1.getCardOptions()); 
console.log('card2',card2.getCardOptions());