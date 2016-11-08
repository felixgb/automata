"use strict";

const should = require("should");

const automata = require("../src/automata");

describe("Test repeatTake", function() { 
    it("repeatedly takes string slice", function() {
        let str = "000110100110";
        let res = [
        //  "000110100110";
            "000",
             "001",
              "011",
               "110",
                "101",
                 "010",
                  "100",
                   "001",
                    "011",
                     "110"
        //  "000110100110";
        ];
        automata.repeatTake(3, str).should.deepEqual(res);
    });
});

describe("Test matchRule", function() { 
    it("matches a rule", function() {
        let current = "010";
        let table = {
            "000": "0",
            "001": "0",
            "010": "0",
            "011": "1",
            "100": "0",
            "101": "1",
            "110": "1",
            "111": "0"
        };
        automata.matchRule(current, table).should.equal("0");
    });
});

describe("Test step", function() { 
    it("matches a rule", function() {
        let current = "0011010011";
        let next = "0011100011";
        let table = {
            "000": "0",
            "001": "0",
            "010": "0",
            "011": "1",
            "100": "0",
            "101": "1",
            "110": "1",
            "111": "0"
        };
        automata.step(1, current, table).should.equal(next);
    });
});
