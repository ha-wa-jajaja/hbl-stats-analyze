// 單場最高
// 兩分出手
// 兩分命中
// 兩分比
// 三分比
// 罰球佔比
import { boxStatFields } from "../json/box-stat-fields.js";
const percentageFields = ["FG %", "3P %", "FT %"];
const shotMakeFields = ["FG", "3P", "FT"];

function calcAvg(arr) {
    return (
        arr.reduce((sum, num) => sum + num) / arr.length
    ).toFixed(2);
}

function getFieldAvg(field, games) {
    let allGamesData = games.map((game) => game[field]);
    if (percentageFields.includes(field)) {
        allGamesData = allGamesData.map((per) =>
            parseInt(per.split("%")[0])
        );
        let avg = calcAvg(allGamesData);
        return avg + "%";
    } else
        return calcAvg(
            allGamesData.map((data) => parseInt(data))
        );
}

function getShotMakeAvg(field, games) {
    let allGamesData = games.map((game) => game[field]);
    let makes = allGamesData.map((data) =>
        parseInt(data.split("-")[0])
    );
    let attempts = allGamesData.map((data) =>
        parseInt(data.split("-")[1])
    );
    return `${calcAvg(makes)}-${calcAvg(attempts)}`;
}

function calcOtherAvg(avg) {
    const twoPtA =
        parseInt(avg.FG.split("-")[1]) -
        parseInt(avg["3P"].split("-")[1]);
    const twoPtM =
        parseInt(avg.FG.split("-")[0]) -
        parseInt(avg["3P"].split("-")[0]);
    const twoPtPer =
        (twoPtM / twoPtA).toFixed(2) * 100 + "%";
    const twoPtAPer =
        (twoPtA / avg.FG.split("-")[1]).toFixed(2) * 100 +
        "%";
    const twoPtMPer =
        (twoPtM / avg.FG.split("-")[0]).toFixed(2) * 100 +
        "%";
    const threeAPer =
        (
            parseInt(avg["3P"].split("-")[1]) /
            parseInt(avg.FG.split("-")[1])
        ).toFixed(2) *
            100 +
        "%";
    const threeMPer =
        (
            parseInt(avg["3P"].split("-")[0]) /
            parseInt(avg.FG.split("-")[0])
        ).toFixed(2) *
            100 +
        "%";
    const ftPer =
        (
            parseInt(avg.FT.split("-")[0]) /
            parseInt(avg.Pts)
        ).toFixed(2) *
            100 +
        "%";

    return {
        "2P": `${twoPtM}-${twoPtA}`,
        "2P %": twoPtPer,
        twoPtMPer,
        twoPtAPer,
        threeMPer,
        threeAPer,
        ftPer,
    };
}

export const getRoundAvg = (allGames) => {
    let res = {};

    let rounds = [
        ...new Set(allGames.map((game) => game.Round)),
    ];
    rounds.forEach((round) => {
        let roundGames = allGames.filter(
            (x) => x.Round === round
        );
        let roundAvg = {};
        boxStatFields.forEach((field) => {
            roundAvg[field] = shotMakeFields.includes(field)
                ? getShotMakeAvg(field, roundGames)
                : getFieldAvg(field, roundGames);
        });
        let additional = calcOtherAvg(roundAvg);
        Object.keys(additional).forEach(
            (key) => (roundAvg[key] = additional[key])
        );

        res[round] = roundAvg;
    });

    console.log(res);
};
