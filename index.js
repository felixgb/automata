#!/usr/bin/env node

"use strict";

const program = require("commander");
const papa = require("babyparse");
const fs = require("fs");
const AsciiTable = require("ascii-table");

const automata = require("./src/automata");
const genetic = require("./src/genetic");

function loadRules(parsedArgs) {
    const path = parsedArgs.rulesPath;
    const content = fs.readFileSync(path, { encoding: "binary" });

    papa.parse(content, {
        skipEmptyLines: true,
        complete: function(res) {
            let config = makeConfig(res, parsedArgs);
            validate(config);
            tabularizeAndPrint(automata.runAtomata(config));
        }
    });
}

function tabularizeAndPrint(rows) {
    const table = new AsciiTable("Results");
    rows.forEach(function(r) {
        table.addRow(r);
    });
    console.log(table.toString());
}

function validate(config) {
    const neighborhoodSize = config.nsize * 2 + 1;
    const equalToNsize = (row) => row.length === neighborhoodSize;
    const rules = Object.keys(config.ruleTable);

    if (!rules.every(equalToNsize)) {
        throw new Error("Rule table row size does not match neighbor size");
    }
    if (rules.length != Math.pow(2, neighborhoodSize)) {
        throw new Error("Not enough rules for the given neighbor size!");
    }
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

function makeRuleTable(rules) {
    return rules.reduce(function(ruleTable, row) {
        const elems = row.slice(0, -1).join("");
        const next = row.slice(-1).pop();

        ruleTable[elems] = next;
        return ruleTable;
    }, {});
}

(function main() {
    program
        .version('0.0.1');

    program
        .command("automata")
        .description("Simple cellular automata")
        .option("-s, --size <size>","Size of the automata")
        .option("-n, --neighborhood-size <nsize>", "Neighborhood size")
        .option("-i, --init-state <istate>", "Initial state")
        .option("-p, --rules-path <path>", "Path to rule table")
        .option("-t, --num-steps <nsteps>", "Time steps to run for")
        .action(function(opts) {
            loadRules(opts);
        });

    program
        .command("genetic")
        .description("Genetic cellular automata")
        .option("-z, --pop-size <popsize>","Initial population size")
        .option("-s, --cell-size <size>","Size of the automata")
        .option("-n, --neighborhood-size <nsize>", "Neighborhood size")
        .option("-g, --gen-steps <gensteps>", "Number of generations to rule for")
        .option("-a, --num-steps <nsteps>", "Time steps to run automata for")
        .action(function(opts) {
            genetic.runGenetic(opts.popSize, opts.genSteps, opts.neighborhoodSize, opts.cellSize, opts.numSteps);
        });

    // 2 becuase node and the name of the program
    if (process.argv.length <= 2) {
        program.help();
    } else {
        program.parse(process.argv);
    }
})();
