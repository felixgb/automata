#!/usr/bin/env node

"use strict";

const program = require("commander");

// csv parser
const Papa = require("babyparse");
const fs = require("fs");

function configFromArgs() {
    program
        .version('0.0.1')
        .description("Simple cellular automata")
        .option("-s, --size <size>","Size of the automata")
        .option("-n, --neighborhood-size <nsize>", "Neighborhood size")
        .option("-i, --init-state <istate>", "Initial state")
        .option("-p, --rules-path <path>", "Path to rule table")
        .option("-t, --num-steps <nsteps>", "Time steps to run for")
        .parse(process.argv);

    loadRules(program)
}

function loadRules(parsedArgs) {
    let path = parsedArgs.rulesPath;
    let content = fs.readFileSync(path, { encoding: "binary" });

    Papa.parse(content, {
        skipEmptyLines: true,
        complete: function(res) {
            runAtomata(res, parsedArgs);
        }
    });
}

function makeConfig(rules, parsedArgs) {
    let ruleTable = rules.data.map(ruleFromRow);

    return {
        size: parsedArgs.size,
        nsize: parseInt(parsedArgs.neighborhoodSize),
        istate: parsedArgs.initState,
        ruleTable: ruleTable,
        nsteps: parsedArgs.numSteps
    };
}

function runAtomata(rules, parsedArgs) {
    let config = makeConfig(rules, parsedArgs);
    let current = config.istate;

    for (let i = 0; i < config.nsteps; i++) {
        current = step(config.nsize, current, config.ruleTable);
        console.log(current);
    }
}

function step(nsize, current, ruleTable) {
    let next = "";
    // Come up with a non idiot way of doing this
    for (let i = 0; i < current.length; i++) {
        let lpad = (i - nsize) < 0 ? "0".repeat(nsize - i) : "";
        let rpad = (i + nsize) > current.length ? "0".repeat(i - current.lenth) : "";
        let c = lpad + current + rpad;
        console.log((i - nsize) + lpad.length, (i + nsize) + lpad.length);
        let toCompare = c.slice((i - nsize) + lpad.length, (i + nsize) + lpad.length);
        next += matchRule(toCompare, ruleTable);
    }
    return next;
}

function matchRule(current, ruleTable) {
    for (let i = 0; i < ruleTable.length; i++) {
        let row = ruleTable[i].elems;

        console.log(row);
        console.log(current);
        if (row === current) {
            return ruleTable[i].next;
        }
    }
    throw "no rule matched!";
}

function ruleFromRow(row) {
    return {
        next: row.slice(-1).pop(),
        elems: row.slice(0, -1).join("")
    }
}

configFromArgs();
// if (program.args.length === 0) program.help();

