import { readFile } from "fs/promises";
import puppeteer from "puppeteer";

const teams = JSON.parse(
    await readFile(
        new URL("../json/teams.json", import.meta.url)
    )
);
const selectors = JSON.parse(
    await readFile(
        new URL("../json/selectors.json", import.meta.url)
    )
);
import { boxFormat } from "../json/box-format.js";
import { getRoundAvg } from "./getRoundAvg.js";

export const getAllTeams = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=1240,1000`],
        defaultViewport: null,
    });
    const page = await browser.newPage();

    let currIdx = 0;
    while (currIdx < Object.keys(teams).length) {
        let currKey = Object.keys(teams)[currIdx];
        page.goto(
            "https://hbl.com.tw/squad/" + teams[currKey],
            {
                waitUntil: "networkidle0",
            }
        );
        await new Promise((r) => setTimeout(r, 2000));

        const allGames = await page.evaluate(
            (boxFormat) => {
                const tables =
                    document.getElementsByClassName(
                        "w-full text-[13px] text-white"
                    );
                let games = tables[1]
                    .querySelector("tbody")
                    .querySelectorAll("tr");
                let gameArray = Array.from(games).map(
                    (game) => {
                        let obj = {};
                        let cells = Array.from(
                            game.querySelectorAll("td")
                        ).map((td) => td.innerText);
                        boxFormat.forEach((item, index) => {
                            obj[item] = cells[index];
                        });
                        return obj;
                    }
                );
                return gameArray;
            },
            boxFormat
        );

        if (currIdx == 0) {
            getRoundAvg(allGames);
        }

        currIdx++;
    }
};
