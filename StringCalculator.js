"use strict";

var StringConverter = (function () {
    
    function InnerStringConverter (defaultDelimiter) {
        this.delimiter = defaultDelimiter;
    }
    
    InnerStringConverter.prototype = {
        toNumberArray: function (stringOfNumbers) {
            return stringOfNumbers
                .split(this.delimiter)
                .map(function (stringNumber) {
                    return parseInt(stringNumber.trim());
                });
        }
    };
    
    return InnerStringConverter;
})();

var Accumulator = (function () {

    var DefaultDelimiter = ",";
        
    function InnerAccumulator () {
        this.stringConverter = new StringConverter(DefaultDelimiter);
    }
    
    InnerAccumulator.prototype = {
        sum: function (stringOfNumbers) {
            return this
                ._toNumberArray(stringOfNumbers)
                .reduce(function(previousValue, currentValue) {
                    return previousValue + currentValue;
                });
        },
        _toNumberArray: function (stringOfNumbers) {
            return this.stringConverter.toNumberArray(stringOfNumbers);
        }
    };
    
    return InnerAccumulator;    
})();

var StringCalculator = (function () {
        
    function InnerStringCalculator () {
        this.accumulator = new Accumulator();
    }
    
    InnerStringCalculator.prototype = {
        add: function (stringOfNumbers) {
            if (stringOfNumbers === "") return 0;
            return this.accumulator.sum(stringOfNumbers);
        }
    }
    
    return InnerStringCalculator;    
})();

module.exports = StringCalculator;