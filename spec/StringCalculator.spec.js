"use strict";

var expect = require("chai").expect;
var StringCalculator = require("../StringCalculator.js");

describe("StringCalculator", function () {

    describe("#Add", function () {

        beforeEach(function () {
            this.stringCalculator = new StringCalculator();
        });

        [
            {
                it: "should return zero with empty string given",
                argument: "",
                expect: 0
            },
            {
                it: "should return the number with one length string given",
                argument: "1",
                expect: 1
            },
            {
                it: "should return the sum of the two numbers with string with one delimiter",
                argument: "1,2",
                expect: 3
            },
            {
                it: "should return the sum of numbers with string of numbers given",
                argument: "1,2,3,4,5,6,7,8,9",
                expect: 45
            },
            {
                it: "should return the sum of numbers with string with new line characters given",
                argument: "1,\n2,3",
                expect: 6
            },
            {
                it: "should return the sum of numbers with string with different delimiter given",
                argument: "//;\n1;2",
                expect: 3
            }
        ]
        .forEach(function (testCase) {
            it(testCase.it, function () {
                expect(this.stringCalculator.add(testCase.argument)).to.eql(testCase.expect);
            });
        });

/*
        [
            {
                it: "should throw an exception with negative number given",
                argument: "-1,2",
                expect: "Negatives not allowed: -1"
            },
            {
                it: "should throw an exception with negative numbers given",
                argument: "2,-4,3,-5",
                expect: "Negatives not allowed: -4,-5"
            }
        ]
        .forEach(function (testCase) {
            it(testCase.it, function () {
                expect(this.stringCalculator.add.bind(this.stringCalculator, testCase.argument)).to.throw(Error, testCase.expect);
            });
        });
*/

    });
});
