var expect = require("chai").expect;
var StringCalculator = require("../StringCalculator.js");

describe("StringCalculator", function () {
    
    describe("#Add", function () {
        
        beforeEach(function () {
            this.stringCalculator = new StringCalculator();
        });

        [
            { argument: "", expect: 0 },
            { argument: "1", expect: 1 },
            { argument: "1,2", expect: 3 }
        ].
        forEach(function (testObject) {
            it("should return " + testObject.expect + " with " + testObject.argument + " given", function () {
                expect(this.stringCalculator.Add(testObject.argument)).to.eql(testObject.expect);
            });
        });
        
    });
});
