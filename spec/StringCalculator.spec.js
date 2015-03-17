var expect = require("chai").expect;
var StringCalculator = require("../StringCalculator.js");

describe("StringCalculator", function () {
    
    describe("#Add", function () {
        
        beforeEach(function () {
            this.stringCalculator = new StringCalculator();
        });
        
        function returnPrintableArgument (argument) {
            return argument.split(",").
            map(function (stringNumber) { return stringNumber.trim(); }).
            concat();
        }

        [
            { argument: "", expect: 0 },
            { argument: "1", expect: 1 },
            { argument: "1,2", expect: 3 },
            { argument: "1,2,3,4,5,6,7,8,9", expect: 45 },
            { argument: "1,\n2,3", expect: 6 }
        ].
        forEach(function (testObject) {
            it("should return " + testObject.expect + " with " + returnPrintableArgument(testObject.argument) + " given", function () {
                expect(this.stringCalculator.Add(testObject.argument)).to.eql(testObject.expect);
            });
        });
        
    });
});
