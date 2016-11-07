#!/usr/bin/env node

"use strict";

const program = require('commander');

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

    return {
        size: program.size,
        nsize: program.neighborhoodSize,
        istate: program.initState,
        path: program.rulesPath,
        nsteps: program.numSteps
    };
}

console.log(configFromArgs());

// if (program.args.length === 0) program.help();

