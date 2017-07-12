import "introcs";

function main() {
    promptString("What is your name?", handleName);
}

function handleName(name: string) {
    clear();
    print("Hello " + name);
    promptNumber("How old are you?", handleAge);
}

function handleAge(age: number) {
    print("Soon you will be " + (age + 1));
    promptBoolean("True or False: The Earth is flat.", handleFlatness);
}

function handleFlatness(isFlat: boolean) {
    clear();
    if (!isFlat) {
        print("Great work!!!");
        image("https://media.giphy.com/media/tBb19faQdmuOHmwGRPy/giphy.gif");
    } else {
        print("Ummm... try again...");
        image("https://media.giphy.com/media/g69ZPJfLy7hD2/giphy.gif");
        main();
    }
}

main();