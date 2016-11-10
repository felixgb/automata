"use strict";

const automata = require("./automata");
const AsciiTable = require("ascii-table");

module.exports = {
    Entry: Entry,
    cross: cross,
    fitness: fitness,
    sortByPhenotype: sortByPhenotype,
    newPopulation: newPopulation,
    makePatterns: makePatterns,
    runGenetic: runGenetic,
    getDesired: getDesired
};

function Entry(initial, geno, pheno) {
    return {
        initial: initial,
        geno: geno,
        pheno: pheno
    };
}

function cross(genotype1, genotype2) {
    const halfsize = genotype1.length / 2;
    return genotype1.slice(0, halfsize) + genotype2.slice(halfsize);
}

function generateBitString(size) {
    const str = [];

    for (let i = 0; i < size; i++) {
        const min = Math.ceil(0);
        const max = Math.floor(1);
        str.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return str.join("");
}

function runPopulation(popMap, setup) {
    return popMap.map(function(row) {
        const config = configFromGeno(row.geno, row.initial, setup);
        const pheno = automata.runAtomata(config).slice(-1).pop();
        return Entry(row.initial, row.geno, pheno);
    });
}

function getDesired(cell) {
    let on = 0;
    for (let i = 0; i < cell.length; i++) {
        if (cell[i] === "1") {
            on++;
        }
    }
    return on >= (cell.length / 2) ? "1".repeat(cell.length) : "0".repeat(cell.length);
}

function sortByPhenotype(populationResults) {
    populationResults.sort(function(a, b) {
        return fitness(b) - fitness(a);
    });
    return populationResults;
}

function newPopulation(populationResults) {
    const sortedGenotypes = sortByPhenotype(populationResults);
    const newOffspring = cross(sortedGenotypes[0].geno, sortedGenotypes[1].geno);
    const worst = sortedGenotypes.slice(-1).pop();
    sortedGenotypes[sortedGenotypes.length - 1] = Entry(worst.initial, newOffspring, worst.pheno);

    return sortedGenotypes;
}

function runGenetic(popSize, numSteps, nSize, cellSize, automataSteps) {
    const setup = {
        popSize: popSize,
        numSteps: numSteps,
        nSize: nSize,
        cellSize: cellSize,
        automataSteps: automataSteps
    };
    const genoSize = Math.pow(2, (nSize * 2 + 1));

    let pop = [];

    for (let i = 0; i < popSize; i++) {
        pop.push(Entry(generateBitString(cellSize), generateBitString(genoSize), ""));
    }

    for (let i = 0; i < numSteps; i++) {
        const popResults = runPopulation(pop, setup);
        pop = newPopulation(popResults);
    }

    const table = new AsciiTable("Results");
    table.setHeading("Initial", "Final Transition Rules", "Final", "Fitness");
    runPopulation(pop, setup).forEach(function(c) {
        table.addRow(c.initial, c.geno, c.pheno, fitness(c));
    });
    console.log(table.toString());
}

function makePatterns(nsize) {
    const patternSize = nsize * 2 + 1;

    if (patternSize > 53) {
        // 2 ^ patternSize must be smaller than double presicion floating point
        // maxval
        throw new Error("Pattern size is too large, max size is 53");
    }

    const numPatterns = Math.pow(2, patternSize);
    const patterns = [];

    for (let i = 0; i < numPatterns; i++) {
        const numStr = i.toString(2); // radix 2; binary representation
        const padded = "0".repeat(patternSize - numStr.length) + numStr;
        patterns.push(padded);

    }

    return patterns;
}

function configFromGeno(genotype, initial, setup) {
    const patterns = makePatterns(setup.nSize);
    const ruleTable = {};

    for (let i = 0; i < genotype.length; i++) {
        ruleTable[patterns[i]] = genotype[i];
    }

    return {
        size: setup.cellSize,
        nsize: setup.nSize,
        istate: initial,
        ruleTable: ruleTable,
        nsteps: setup.automataSteps
    };
}

function fitness(row) {
    const pheno = row.pheno;
    const desired = getDesired(row.initial);
    // normalize to 0 to 1
    return (pheno.length - difference(pheno, desired)) / pheno.length;
}

// difference in two equally sized strings
function difference(str1, str2) {
    let numDifferences = 0;

    for (let i = 0; i < str1.length; i++) {
        if (str1[i] != str2[i]) {
            numDifferences++;
        }
    }

    return numDifferences;
}
