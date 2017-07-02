import "introcs/console";

function main() {
    print("Hello, world.");
    askForString("What is your name?", greeter);
}

function greeter(name: string) {
    print("Hello, " + name);
    askForString("What is your name?", greeter);
}

main();