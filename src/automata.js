"use strict";

const program = require("commander");
const Papa = require("babyparse");
const fs = require("fs");

module.exports = {
    main: main,
    makeConfig: makeConfig,
    step: step,
    matchRule: matchRule,
    makeRuleTable: makeRuleTable,
    repeatTake: repeatTake
};

function main() {
    program
        .version('0.0.1')
        .description("Simple cellular automata")
        .option("-s, --size <size>","Size of the automata")
        .option("-n, --neighborhood-size <nsize>", "Neighborhood size")
        .option("-i, --init-state <istate>", "Initial state")
        .option("-p, --rules-path <path>", "Path to rule table")
        .option("-t, --num-steps <nsteps>", "Time steps to run for")
        .parse(process.argv);

    loadRules(program);
}

function validate(config) {
    const neighborhoodSize = config.nsize * 2 + 1;
    const equalToNsize = (row) => row.length === neighborhoodSize;
    const rules = Object.keys(config.ruleTable);

    if (!rules.every(equalToNsize)) {
        throw "Rule table row size does not match neighbor size";
    }
    if (rules.length != Math.pow(2, neighborhoodSize)) {
        throw "Not enough rules for the given neighbor size!";
    }
}

function loadRules(parsedArgs) {
    const path = parsedArgs.rulesPath;
    const content = fs.readFileSync(path, { encoding: "binary" });

    Papa.parse(content, {
        skipEmptyLines: true,
        complete: function(res) {
            runAtomata(res, parsedArgs);
        }
    });
}

function makeConfig(rules, parsedArgs) {
    const ruleTable = makeRuleTable(rules.data);

    return {
        size: parseInt(parsedArgs.size),
        nsize: parseInt(parsedArgs.neighborhoodSize),
        istate: parsedArgs.initState,
        ruleTable: ruleTable,
        nsteps: parseInt(parsedArgs.numSteps)
    };
}

function runAtomata(rules, parsedArgs) {
    const config = makeConfig(rules, parsedArgs);
    validate(config);
    let current = config.istate;

    console.log("INIT: ", current);
    for (let i = 0; i < config.nsteps; i++) {
        current = step(config.nsize, current, config.ruleTable);
        console.log("NEXT: ", current);
    }
}

function step(nsize, current, ruleTable) {
    const neighborhoodSize = (nsize * 2) + 1;

    for (let i = 0; i < nsize; i++) {
        current = "0" + current + "0";
    }

    let next = "";
    while (current.length >= neighborhoodSize) {
        let c = current.slice(0, neighborhoodSize);
        current = current.slice(1, current.length);
        next += matchRule(c, ruleTable);
    }

    return next;
}

function matchRule(current, ruleTable) {
    const next = ruleTable[current];

    if (next === undefined) {
        throw "no rule matched!";
    } else {
        return next;
    }
}

function makeRuleTable(rules) {
    return rules.reduce(function(ruleTable, row) {
        const elems = row.slice(0, -1).join("");
        const next = row.slice(-1).pop();

        ruleTable[elems] = next;
        return ruleTable;
    }, {});
}

function repeatTake(size, str) {
    const substrings = [];

    for (let i = 0; i < str.length - size + 1; i++) {
        substrings.push(str.slice(i, i + size));
    }

    return substrings;
}
