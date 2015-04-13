"use strict";

var StringConverter = (function () {

    function InnerStringConverter (defaultDelimiter) {
        this.delimiter = defaultDelimiter;
    }

    InnerStringConverter.prototype = {
        toNumberArray: function (stringOfNumbers) {
            return this
                ._toStringArray(stringOfNumbers.trim())
                .map(function (stringNumber) {
                    return parseInt(stringNumber.trim());
                });
        },
        _toStringArray: function (stringOfNumbers) {

            this._stringOfNumbers = stringOfNumbers;
            this._setDelimiterFromStringOfNumbers();

            return this._stringOfNumbers.split(this.delimiter);
        },
        _setDelimiterFromStringOfNumbers: function () {

            var customDelimiterPattern = /\/\/[.:,;|\n\t \"\']\n/;
            var matchArray = this._stringOfNumbers.match(customDelimiterPattern);

            if (matchArray) {
                this.delimiter = this._getCustomDelimiter(matchArray);
                this._stringOfNumbers = this._stringOfNumbers.slice(4);
            }
        },
        _getCustomDelimiter: function (matchArray) {
            return matchArray[0].substr(2, 1);
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
            if (stringOfNumbers === "") {
                return 0;
            }
            return this.accumulator.sum(stringOfNumbers);
        }
    };

    return InnerStringCalculator;
})();

module.exports = StringCalculator;
