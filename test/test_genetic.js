"use strict";

const should = require("should");

const genetic = require("../src/genetic");

describe("Test cross", function() { 
    it("crosses two arrays", function() {
        let g1 = "00001111";
        let g2 = "11110000";
        let res = "00000000";
        genetic.cross(g1, g2).should.equal(res);
    });
});

describe("Test fitness", function() { 
    it("gives 0 - 1 val for fitness", function() {
        let bad = "11111111";
        let ok = "00001111";
        let good = "00000000";
        let desired = "00000000";
        genetic.fitness(bad, desired).should.equal(0);
        genetic.fitness(ok, desired).should.equal(0.5);
        genetic.fitness(good, desired).should.equal(1);
    });
});

describe("Test sortByPhenotype", function() { 
    it("sorts geno pheno map", function() {
        const toSort = [
            { initial: "00000000", geno: "00110011", pheno: "11111111" },
            { initial: "00000000", geno: "01010101", pheno: "00000000" },
            { initial: "00000000", geno: "10101010", pheno: "00001111" }
        ];
        const sorted = [
            { initial: "00000000", geno: "01010101", pheno: "00000000" },
            { initial: "00000000", geno: "10101010", pheno: "00001111" },
            { initial: "00000000", geno: "00110011", pheno: "11111111" }
        ];
        genetic.sortByPhenotype(toSort).should.deepEqual(sorted);
    });
});

describe("Test newPopulation", function() { 
    it("tests the new population function", function() {
        const popRes = [
            { initial: "00000000", geno: "00110011", pheno: "11111111" },
            { initial: "00000000", geno: "01010101", pheno: "00000000" },
            { initial: "00000000", geno: "10101010", pheno: "00001111" }
        ];
        const newPop = [
            { initial: "00000000", geno: "01010101", pheno: "00000000" },
            { initial: "00000000", geno: "10101010", pheno: "00001111" },
            { initial: "00000000", geno: "01011010", pheno: "11111111" }
        ];
        genetic.newPopulation(popRes).should.deepEqual(newPop);
    });
});

describe("Test makePatterns (with nsize 1)", function() { 
    it("tests the rule making function for patterns", function() {
        const nsize = 1;
        const patterns = [
            "000",
            "001",
            "010",
            "011",
            "100",
            "101",
            "110",
            "111"
        ];
        genetic.makePatterns(nsize).should.deepEqual(patterns);
    });
});

describe("Test makePatterns (with nsize 2", function() { 
    it("tests the rule making function for patterns", function() {
        const nsize = 2;
        const patterns = [
            "00000",
            "00001",
            "00010",
            "00011",
            "00100",
            "00101",
            "00110",
            "00111",
            "01000",
            "01001",
            "01010",
            "01011",
            "01100",
            "01101",
            "01110",
            "01111",
            "10000",
            "10001",
            "10010",
            "10011",
            "10100",
            "10101",
            "10110",
            "10111",
            "11000",
            "11001",
            "11010",
            "11011",
            "11100",
            "11101",
            "11110",
            "11111"
            ];
        genetic.makePatterns(nsize).should.deepEqual(patterns);
    });
});

describe("Test runGenetic", function() { 
    it("runs the genetic function", function() {
        this.timeout(0);
        genetic.runGenetic(10);
    });
});
