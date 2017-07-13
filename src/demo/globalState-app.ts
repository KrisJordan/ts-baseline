import "introcs";

let balance: number = 0;

function main() {
    print("Your balance is " + balance);
    print("What would you like to do?");
    print("Enter 1 for deposit.");
    print("Enter 2 for withdraw.");
    promptNumber("Your selection", decide);
}

function decide(choice: number) {
    if (choice === 1) {
        promptNumber("How much would you like to deposit?", deposit);
    } else if (choice === 2) {
        promptNumber("How much would you like to withdraw?", withdraw);
    } else {
        print("Invalid selection.");
        main();
    }
}

function deposit(amount: number) {
    clear();
    balance += amount;
    image("https://media.giphy.com/media/LCdPNT81vlv3y/giphy.gif");
    print("Deposit successful");
    main();
}

function withdraw(amount: number) {
    clear();
    if (balance >= amount) {
        balance -= amount;
        image("https://media.giphy.com/media/JWLebrfg8YJqw/giphy.gif");
        print("Withdraw successful");
    } else {
        image("https://media.giphy.com/media/U7ZVomN8iNEY0/giphy.gif");
        print("Insufficient funds!");
    }
    main();
}

main();