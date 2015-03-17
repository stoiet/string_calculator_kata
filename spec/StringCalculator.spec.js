var expect = require("chai").expect;
var StringCalculator = require("../StringCalculator.js");

describe("StringCalculator", function () {
    
    describe("#Add", function () {
        
        beforeEach(function () {
            this.stringCalculator = new StringCalculator(",");
        });
        
        it("should return 0 with empty string given", function () {
            expect(this.stringCalculator.Add("")).to.eql(0);
        });
        
        it("should return 1 with one number given", function () {
            expect(this.stringCalculator.Add("1")).to.eql(1);
        });
 
        it("should return sum with two numbers given", function () {
            expect(this.stringCalculator.Add("1,2")).to.eql(3);
        });
        
    });
});
