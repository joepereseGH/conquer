// allow date format consistency
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
    dayjs.extend(customParseFormat);
// get inputs and print to the console
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";


export async function getDateFromUser(query) {
    let failedAttempts = 0;
    while (true) {
        const date = await getUserInput(query + "(or type cancel to cancel): \n");
        if (date === "cancel") return false;
        if (checkDate(date)) return date;
        failedAttempts++;
        if (failedAttempts >= 3) {
            throw new Error("No valid date provided. Please try again\n");
        }
        console.error("Please enter a valid date. Format YYYY-MM-DD\n");
    }
}


function checkDate(value) {
    return dayjs(value, "YYYY-MM-DD", true).isValid();
}


// use within a try block with getUserInput
// searches an array for item an index and returns that item
export function selectOption(array, index) {
    if (!Array.isArray(array)) throw new Error("selectOption requires an array\n");
    if (
        !Number.isInteger(Number(index)) ||
        Number(index) < 0 ||
        Number(index) >= array.length
    ) throw new Error("\nPlease provide a valid index");
    return array[Number(index)];
}


export async function getUserInput(query) {
    // get user input one time
    const rl = readline.createInterface({
    input: stdin,
    output: stdout
    });
    const userInput = await rl.question(`${query}`);
    rl.close();
    return userInput;
}


// Allow a user to pick an attribute from an object
export async function getAttrFromUser(object) {
    let attributeList = [];
    for (const key of Object.keys(object)) attributeList.push(key);
    attributeList.push("Go back");
    attributeList.push("Exit program");
    let running = true;
    while (running) {
        console.log();
        attributeList.forEach((attr, i) => console.log(`${i + 1}. ${attr}`))
        console.log();
        try {
            const answer = await getUserInput("What attribute would you like to view? #: ");
            const userRequest = await selectOption(attributeList, answer -1);
            for (const attr of attributeList) {
                if (userRequest === attr) { return attr }
            }
        }
        catch(error) { throw error; }
    }
}
