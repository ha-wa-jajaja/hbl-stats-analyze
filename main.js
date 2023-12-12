import { readFile } from "fs/promises";
import puppeteer from "puppeteer";
const teams = JSON.parse(
    await readFile(
        new URL("./json/teams.json", import.meta.url)
    )
);
const selectors = JSON.parse(
    await readFile(
        new URL("./json/selectors.json", import.meta.url)
    )
);

const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=1240,1000`],
    defaultViewport: null,
});
const page = await browser.newPage();

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

let currIdx = 0;
while (currIdx < Object.keys(teams).length) {
    let currKey = Object.keys(teams)[currIdx];
    page.goto(
        "https://hbl.com.tw/squad/" + teams[currKey],
        {
            waitUntil: "networkidle0",
        }
    );
    await delay(5000);
    await page.waitForXPath(selectors.teamName);
    const [item] = await page.$x(selectors.teamName);

    const teamName = await page.evaluate(
        (name) => name.innerText,
        item
    );

    console.log(teamName);

    currIdx++;
}
