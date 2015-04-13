"use strict";

var NegativeNumberExceptionHandler = (function () {

    function _NegativeNumberError(numberArray) {
        this.numberArray = numberArray;
        this.exceptionString = "Negatives not allowed: ";
    }

    _NegativeNumberError.prototype = {
        hasNegativeNumber: function() {
            var hasNegativeNumbers = false;

            for (var i = 0; i < this.numberArray.length; ++i) {
                if (this.numberArray[i] < 0) {
                    if (hasNegativeNumbers) {
                        this.exceptionString += ",";
                    }
                    this.exceptionString += this.numberArray[i].toString();
                }
            }

            return hasNegativeNumbers;
        },
        throw: function() {
            throw new Error(this.exceptionString);
        }
    };

    return _NegativeNumberError;
})();

var CustomDelimiter = (function () {

    function _CustomDelimiter (defaultOptions) {
        this._delimiter = defaultOptions.delimiter || ",";
        this._customDelimiterPattern = defaultOptions.pattern || /\/\/[.:,;|\n\t \"\']\n/;
        this._hasCustomDelimiter = false;
    }

    _CustomDelimiter.prototype = {
        getDelimiter: function (stringOfNumbers) {
            this._setCustomDelimiterFrom(stringOfNumbers);
            return this._delimiter;
        },
        hasCustomDelimiter: function () {
            return this._hasCustomDelimiter;
        },
        _setCustomDelimiterFrom: function (stringOfNumbers) {
            var matchArray = stringOfNumbers.match(this._customDelimiterPattern);
            if (matchArray) {
                this._delimiter = this._getCustomDelimiterFrom(matchArray);
                this._hasCustomDelimiter = true;
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
                    var number = parseInt(stringNumber.trim());
                    return number;
                });
        },
        _toStringArray: function (stringOfNumbers) {
            var delimiter = this.customDelimiter.getDelimiter(stringOfNumbers);
            var resultStringArray = null;

            if (this.customDelimiter.hasCustomDelimiter()) {
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
            var numberArray = this.stringConverter.toNumberArray(stringOfNumbers);
            var negativeNumberExceptionHandler = new NegativeNumberExceptionHandler(numberArray);

            if (negativeNumberExceptionHandler.hasNegativeNumber()) {
                negativeNumberExceptionHandler.throw();
            }

            return numberArray;
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
