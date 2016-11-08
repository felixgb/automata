const should = require("should");
const automata = require("../src/automata");

describe("Test repeat take", function() { 

    "use strict";

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
