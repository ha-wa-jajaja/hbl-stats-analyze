// 單場最高
export const getRoundAvg = (allGames) => {
    let round = new Set(allGames.map((game) => game.Round));
    console.log(round);
};
