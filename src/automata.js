"use strict";

module.exports = {
    step: step,
    matchRule: matchRule,
    repeatTake: repeatTake,
    runAtomata: runAtomata
};

function runAtomata(config) {
    let runs = [];
    let current = config.istate;

    for (let i = 0; i < config.nsteps; i++) {
        // Do we want the initial state as well?
        runs.push(current);
        current = step(config.nsize, current, config.ruleTable);
    }

    return runs;
}

function step(nsize, current, ruleTable) {
    const neighborhoodSize = (nsize * 2) + 1;

    // pad string with empty neighbors
    for (let i = 0; i < nsize; i++) {
        current = current[current.length - i - 1] + current + current[i];
    }

    return repeatTake(neighborhoodSize, current)
        .map((cells) => matchRule(cells, ruleTable))
        .join("");
}

function matchRule(current, ruleTable) {
    const next = ruleTable[current];


    if (next === undefined) {
        throw new Error("no rule matched!");
    } else {
        return next;
    }
}

function repeatTake(size, str) {
    const substrings = [];

    for (let i = 0; i < str.length - size + 1; i++) {
        substrings.push(str.slice(i, i + size));
    }

    return substrings;
}
