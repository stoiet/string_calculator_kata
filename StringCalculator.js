"use strict";

var StringConverter = (function () {
    
    function InnerStringConverter (defaultDelimiter) {
        this.delimiter = defaultDelimiter;
    }
    
    InnerStringConverter.prototype = {
        toNumberArray: function (string) {
        	this._setDelimiter();

            return string.split(this.delimiter).
            map(function (stringNumber) {
                return parseInt(stringNumber.trim());
            });
        },
        _setDelimiter: function () {}
    };
    
    return InnerStringConverter;
})();

var Accumulator = (function () {
        
    function InnerAccumulator () {
        this.stringConverter = new StringConverter(",");
    }
    
    InnerAccumulator.prototype = {
        sum: function (stringNumbers) {
            return this.stringConverter.toNumberArray(stringNumbers).
            reduce(function(previousValue, currentValue) {
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
        add: function (stringNumbers) {
            if (stringNumbers === "") return 0;
            return this.accumulator.sum(stringNumbers);
        }
    }
    
    return InnerStringCalculator;    
})();

module.exports = StringCalculator;