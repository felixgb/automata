"use strict";

const automata = require("./automata");
const AsciiTable = require("ascii-table");

const NSIZE = 3;
const SIZE = 10;
const NUM_STEPS = 100;

module.exports = {
    cross: cross,
    fitness: fitness,
    sortByPhenotype: sortByPhenotype,
    newPopulation: newPopulation,
    makePatterns: makePatterns,
    runGenetic: runGenetic
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

function generateGenotype(size) {
    const genotype = [];

    for (let i = 0; i < size; i++) {
        const min = Math.ceil(0);
        const max = Math.floor(1);
        genotype.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return genotype.join("");
}

function runPopulation(popMap) {
    return popMap.map(function(row) {
        const config = configFromGeno(row.geno, row.initial);
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
    return on >= (cell.length / 2) ? "1".repeat(SIZE) : "0".repeat(SIZE);
}

function sortByPhenotype(populationResults) {
    populationResults.sort(function(a, b) {
        const desiredA = getDesired(a.initial);
        const desiredB = getDesired(b.initial);
        return fitness(b.pheno, desiredB) - fitness(a.pheno, desiredA);
    });
    return populationResults;
}

function newPopulation(populationResults) {
    const sortedGenotypes = sortByPhenotype(populationResults);
    const newOffspring = cross(sortedGenotypes[0].geno, sortedGenotypes[1].geno);

    // sortedGenotypes[sortedGenotypes.length - 2] = { initial: sortedGenotypes[sortedGenotypes.length - 2].initial, geno: generateGenotype(newOffspring.length) };
    const worst = sortedGenotypes.slice(-1).pop();
    sortedGenotypes[sortedGenotypes.length - 1] = Entry(worst.initial, newOffspring, worst.pheno);
    return sortedGenotypes;
}

function runGenetic(popsize) {
    let pop = [];

    for (let i = 0; i < popsize; i++) {
        pop.push(Entry(generateGenotype(SIZE), generateGenotype(Math.pow(2, (NSIZE * 2 + 1))), ""));
    }

    for (let i = 0; i < 100; i++) {
        const popResults = runPopulation(pop);
        pop = newPopulation(popResults);
    }

    const table = new AsciiTable("Results");
    table.setHeading("Initial", "Final Transition Rules", "Final");
    runPopulation(pop).forEach(function(c) {
        table.addRow(c.initial, c.geno, c.pheno);
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

function configFromGeno(genotype, initial) {
    const patterns = makePatterns(NSIZE);
    const ruleTable = {};

    for (let i = 0; i < genotype.length; i++) {
        ruleTable[patterns[i]] = genotype[i];
    }

    return {
        size: SIZE,
        nsize: NSIZE,
        istate: initial,
        ruleTable: ruleTable,
        nsteps: NUM_STEPS
    };
}

function fitness(pheno1, pheno2) {
    // normalize to 0 - 1
    return (pheno1.length - difference(pheno1, pheno2)) / pheno1.length;
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

// runGenetic(10);
