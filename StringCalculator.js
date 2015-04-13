"use strict";

var CustomDelimiter = (function () {

    function _CustomDelimiter (defaultOptions) {
        this.delimiter = defaultOptions.delimiter || ",";
        this.customDelimiterPattern = defaultOptions.pattern || /\/\/[.:,;|\n\t \"\']\n/;
        this.hasCustomDelimiter = false;
    }

    _CustomDelimiter.prototype = {
        getDelimiter: function (stringOfNumbers) {
            this._setCustomDelimiterFrom(stringOfNumbers);
            return this.delimiter;
        },
        _setCustomDelimiterFrom: function (stringOfNumbers) {
            var matchArray = stringOfNumbers.match(this.customDelimiterPattern);
            if (matchArray) {
                this.delimiter = this._getCustomDelimiterFrom(matchArray);
                this.hasCustomDelimiter = true;
            }
        },
        _getCustomDelimiterFrom: function (matchArray) {
            return matchArray[0].substr(2, 1);
        }
    };

    return _CustomDelimiter;
})();

var StringConverter = (function () {

    function _StringConverter () {
        this.customDelimiter = new CustomDelimiter({});
    }

    _StringConverter.prototype = {
        toNumberArray: function (stringOfNumbers) {
            return this
                ._toStringArray(stringOfNumbers.trim())
                .map(function (stringNumber) {
                    return parseInt(stringNumber.trim());
                });
        },
        _toStringArray: function (stringOfNumbers) {

            var delimiter = this.customDelimiter.getDelimiter(stringOfNumbers);
            var resultStringArray = null;

            if (this.customDelimiter.hasCustomDelimiter) {
                resultStringArray = stringOfNumbers.slice(4).split(delimiter);
            }
            else {
                resultStringArray = stringOfNumbers.split(delimiter);
            }

            return resultStringArray;
        }
    };

    return _StringConverter;
})();

var StringNumberAccumulator = (function () {

    function _StringNumberAccumulator () {
        this.stringConverter = new StringConverter();
    }

    _StringNumberAccumulator.prototype = {
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

    return _StringNumberAccumulator;
})();

var StringCalculator = (function () {

    function _StringCalculator () {
        this.stringNumberAccumulator = new StringNumberAccumulator();
    }

    _StringCalculator.prototype = {
        add: function (stringOfNumbers) {
            if (stringOfNumbers === "") {
                return 0;
            }
            return this.stringNumberAccumulator.sum(stringOfNumbers);
        }
    };

    return _StringCalculator;
})();

module.exports = StringCalculator;
