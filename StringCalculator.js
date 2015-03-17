"use strict";

var StringConverter = (function () {
    
    function InnerStringConverter (delimiter) {
        this.delimiter = delimiter;
    }
    
    InnerStringConverter.prototype = {
        convertToNumberArray: function (string) {
            return string.split(this.delimiter)
            .map(function (stringNumber) {
                return parseInt(stringNumber);
            });
        }
    };
    
    return InnerStringConverter;
})();

var Accumulator = (function () {
        
    function InnerAccumulator () {
        this.stringConverter = new StringConverter(",");
    }
    
    InnerAccumulator.prototype = {
        sum: function (numbersString) {
            return this.stringConverter.convertToNumberArray(numbersString)
            .reduce(function(previousValue, currentValue) {
                return previousValue + currentValue;
            });
        }
    };
    
    return InnerAccumulator;    
})();

var StringCalculator = (function () {
        
    function InnerStringCalculator () {
        this.accumulator = new Accumulator();
    }
    
    InnerStringCalculator.prototype = {
        Add: function (numbersString) {
            if (numbersString === "") return 0;
            return this.accumulator.sum(numbersString);
        }
    }
    
    return InnerStringCalculator;    
})();

module.exports = StringCalculator;