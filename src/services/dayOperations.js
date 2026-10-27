import { Day } from "../objects/day.js";
import { Menu } from "../objects/Menu.js";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { getUserInput, selectOption, getDateFromUser, getAttrFromUser } from "../services/utils.js";


export async function dailyOperationsMenu(dailyOperations) {
    let running = true;
    let failedAttempts = 0;
    while (running) {
        dailyOperations.displayMenu();
        try {
            if (failedAttempts >= 3) {
                running = false;
                throw new Error("Too many failed attempts were made");
            }
            const answer = await getUserInput("Please slect an operation: ");
            const userSelects = selectOption(dailyOperations.menuOptions, answer - 1);
            const nextMenu = dailyOperations.selectMenuOption(userSelects);
            switch(nextMenu) {
                case "Create new day": {
                    try {
                        const date = await getDateFromUser("Enter the date for your new day.");
                        if (!date) break;
                        const day = createNewDay(date);
                        await saveDay(day);
                    }
                    catch(error) { console.error(error.message); }
                    break;
                }
                case "View day": {
                    try {
                        const date = await getDateFromUser("\nWhat date would you like to view?");
                        if (!date) break;
                        const day = await getDayFromData(date);
                        if (day === "ENOENT") throw new Error("\nFile not found");
                        const operation = await viewDay(day);
                        if (operation === "exit") return dailyOperations.exitProgram();
                    }
                    catch(error) { console.error(error.message); }
                    break;
                }
                case "Remove day": {
                    try {
                        const date = await getDateFromUser("\nWhat date would you like to remove?");
                        if (!date) break;
                        const day = await getDayFromData(date);
                        if (day === "ENOENT") throw new Error("\nFile not found");
                        await removeDay(day);
                    }
                    catch(error) { console.error(error.message); }
                    break;
                }
                case "Go back": {
                    running = false;
                    break;
                }
                case "Exit program": {
                    return dailyOperations.exitProgram();
                }
            }
        }
        catch(error) { 
            console.error(error.message);
            failedAttempts++;
        }
    }
    return true;
}


// create a new day object
export function createNewDay(date) {
    const day = new Day(date);
    return day;
}


// find a json file in the database and restore it
export async function getDayFromData(date) {
    const filename = `${date}.json`;
    const dir = "data";
    try {
        const content = await readFile(`${dir}/${filename}`, "utf8");
        const data = JSON.parse(content);
        const day = Object.assign(new Day(data.date), data)
        return day;
    }
    catch(error) {
        if (error.code === "ENOENT") return "ENOENT";
        throw error;
    }
}


export async function saveDay(day) {
    const data = JSON.stringify(day);
    const filepath = `./data/${day.date}.json`;
    const checkDay = await getDayFromData(day.date);
    if (checkDay === "ENOENT") {
        await writeFile(filepath, data);
        console.log(`\n${day.date}.json saved successfully`);
        return true;
    }
    // if day exists do this
    console.log(`\n${day.date}.json already exists`);
    let failedAttempts = 0;
    while (true) {
        const answer = await getUserInput(`Would you like to overwrite ${day.date}? yes/no: `);
        if (answer === "yes" || answer === "y") {
            await writeFile(filepath, data);
            console.log(`\n${day.date}.json successfully overwritten`);
            return true;
        } else if (answer === "no" || answer === "n") {
            console.log("\nOperation cancelled");
            return false;
        }
        failedAttempts++;
        console.log(`\n${answer} selected. Please answer with yes or no\n`);
        if (failedAttempts >= 3) throw new Error(`Failed to confirm file rewrite`);
    }
}


// return false to exit]
// return true when finished
export async function viewDay(day) {
    let running = true;
    let failedAttempts = 0;
    while (running) {
        if (failedAttempts >= 3) {
            running = false;
            throw new Error("\nToo many failed attempts were made");
        }
        try {
            const attribute = await getAttrFromUser(day);
            if (attribute === "Go back") {
                running = false;
                return true;
            }
            else if (attribute === "Exit program") return "exit";
            let viewing = true;
            let incorrectAnswer = 0;
            while (viewing) {
                try {
                    if (incorrectAnswer >= 3) {
                        viewing = false;
                        console.error("\nToo many failed attempts were made");
                        break;
                    }
                    console.log(`\n${attribute} for ${day.date}:\n\n${JSON.stringify(day[attribute])}\n`);
                    let answer = await getUserInput("Would you like to view another attribute? yes or no: ");
                    if (answer === "no" || answer === "n") {
                        running = false;
                        return true;
                    } else if (answer === "yes" || answer === "y") break;
                    else throw new Error(`\n${answer} selected. Expecting yes or no`);
                }
                catch(error) {
                    incorrectAnswer++;
                    console.error(error.message);
                }
            }
        }
        catch(error) {
            failedAttempts++;
            console.error(error.message);
        }
    }
}


export async function removeDay(day) {
    const checkDay = await getDayFromData(day.date);
    if (checkDay === "ENOENT") throw new Error(`File not found`);
    console.log(`\nAre you sure you want to delete ${day.date}? THIS IS PERMANENT`);
    const answer = await getUserInput(`\nEnter "DELETE" or type cancel: `);
    if (answer === "DELETE") {
        // delete file
        const filepath = `./data/${day.date}.json`;
        await unlink(filepath);
        console.log(`\n${day.date}.json was deleted`);
    } else { console.log("\nOperation cancelled"); }
}
