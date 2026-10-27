export class Menu {
    constructor(title, menuOptions, parentMenu) {
        this.title = title;
        this.menuOptions = menuOptions;
        this.parentMenu = parentMenu;
        if (this.parentMenu !== null) {
            menuOptions.push("Go back");
        }
        menuOptions.push("Exit program");
    }
    displayMenu() {
        console.log(`\n${this.title}\n`);
        this.menuOptions.forEach( (option, i) => console.log(`${i + 1}. ${option}`));
        console.log();
    }
    selectMenuOption(userSelects) {
        for (const option of this.menuOptions) {
            if (userSelects === option) return option;
        }
        throw new Error(`${userSelects} doesnt exist in ${this.title}\n`);
    }
    exitProgram() {
        console.log("\nExiting...");
        return false;
    }
}
