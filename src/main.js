// objects
import { Menu } from "./objects/Menu.js";
import { Day } from "./objects/day.js";
// services
import { dailyOperationsMenu } from "./services/dayOperations.js";
import { getUserInput, selectOption } from "./services/utils.js";


// Create menu objects
const topMenuOptions = [
    "Daily operations"
];
const topMenu = new Menu("Top Menu", topMenuOptions, null);
const dailyOperationsMenuOptions =[
    "Create new day",
    "View day",
    "Remove day"
];
const dailyOperations = new Menu("Daily Operations", dailyOperationsMenuOptions, mainMenu);



mainMenu();
async function mainMenu() {
    let running = true;
    let failedAttempts = 0;
    while (running) {
        topMenu.displayMenu();
        try {
            if (failedAttempts >= 3) {
                running = false;
                throw new Error("Too many failed attempts were made");
            }
            const answer = await getUserInput("What would you like to do? ");
            const userSelects = selectOption(topMenu.menuOptions, answer - 1);
            const nextMenu = topMenu.selectMenuOption(userSelects);
            switch(nextMenu) {
                case "Daily operations": {
                    const operationSuccess = await dailyOperationsMenu(dailyOperations);
                    if (!operationSuccess) running = false;
                    break;
                }
                case "Exit program": {
                    running = topMenu.exitProgram();
                    break;
                }
            }
        }
        catch(error) { 
            console.error(error.message);
            failedAttempts++;
        }
    }
}
