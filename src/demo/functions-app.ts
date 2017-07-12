import "introcs";

function main() {
    print("Hello, again.");
    welcome("TypeScript");
    partyParrot();
    print("Ah yeah.");
}

function welcome(to: string) {
    print("Welcome to " + to + "!!!");
}

function partyParrot() {
    image("http://i.imgur.com/l92fg3z.gif");
}

main();