"use strict";

var NegativeNumberException = (function () {

    function _NegativeNumberException(numberArray) {
        this.numberArray = numberArray;
        this.exceptionString = "Negatives not allowed: ";
    }

    _NegativeNumberException.prototype = {
        hasNegativeNumber: function() {
            var hasNegativeNumbers = false;

            for (var i = 0; i < this.numberArray.length; ++i) {
                if (this.numberArray[i] < 0) {
                    if (hasNegativeNumbers) {
                        this.exceptionString += ",";
                        hasNegativeNumbers = true;
                    }
                    this.exceptionString += this.numberArray[i].toString();
                }
            }

            return hasNegativeNumbers;
        },
        getString: function() {
            throw this.exceptionString;
        }
    };

    return _NegativeNumberException;
})();

var CustomDelimiter = (function () {

    function _CustomDelimiter (options) {
        this._delimiter = options.delimiter || ",";
        this._customDelimiterPattern = options.pattern || /\/\/[.:,;|\n\t \"\']\n/;
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

    function _StringConverter () {}

    _StringConverter.prototype = {
        toNumberArray: function (stringOfNumberArray) {
            var _toNumber = this._toNumber;
            return stringOfNumberArray.map(function (stringOfNumber) { return _toNumber(stringOfNumber); });
        },
        _toNumber: function(stringOfNumber) {
            return parseInt(stringOfNumber.trim());
        }
    };

    return _StringConverter;
})();

var StringOfNumberArray = (function () {

    function _StringOfNumberArray () {
        this._customDelimiter = new CustomDelimiter({});
    }

    _StringOfNumberArray.prototype = {
        generateFrom: function (stringOfNumbers) {
            var delimiter = this._customDelimiter.getDelimiter(stringOfNumbers);
            var resultStringOfNumberArray = null;

            if (this._customDelimiter.hasCustomDelimiter()) {
                resultStringOfNumberArray = stringOfNumbers.slice(4).split(delimiter);
            }
            else {
                resultStringOfNumberArray = stringOfNumbers.split(delimiter);
            }

            return resultStringOfNumberArray;
        }
    };

    return _StringOfNumberArray;
})();

var NumberArray = (function () {

    var defaultHighestValidNumber = 1000;

    function _NumberArray (highestValidNumber) {
        this._highestValidNumber = highestValidNumber || defaultHighestValidNumber;
        this._stringOfNumberArray = new StringOfNumberArray();
    }

    _NumberArray.prototype = {
        generateFrom: function (stringOfNumbers) {
            var stringOfNumberArray = this._stringOfNumberArray.generateFrom(stringOfNumbers);
            return this._getValidNumberArray(stringOfNumberArray);
        },
        _getValidNumberArray: function(stringOfNumberArray) {
            var numberArray = this._toNumberArray(stringOfNumberArray);
            this._throwExceptionIfHasNegativeNumber(numberArray);
            return this._eliminateInvalidNumbers(numberArray);
        },
        _throwExceptionIfHasNegativeNumber: function (numberArray) {
            var negativeNumberException = new NegativeNumberException(numberArray);
            if (negativeNumberException.hasNegativeNumber()) {
                throw new Error(negativeNumberException.getString());
            }
        },
        _eliminateInvalidNumbers: function(numberArray) {
            for (var i = 0; i < numberArray.length; ++i) {
                if (numberArray[i] > this._highestValidNumber) {
                    numberArray.splice(i, 1);
                }
            }
            return numberArray;
        },
        _toNumberArray: function(stringOfNumberArray) {
            var stringConverter = new StringConverter();
            return stringConverter.toNumberArray(stringOfNumberArray);
        }
    };

    return _NumberArray;
})();

var NumberArrayAccumulator = (function () {

    function _NumberArrayAccumulator () {
        this.numberArray = new NumberArray();
    }

    _NumberArrayAccumulator.prototype = {
        sumFrom: function(stringOfNumbers) {
            return this.numberArray
                .generateFrom(stringOfNumbers)
                .reduce(function(previousValue, currentValue) {
                    return previousValue + currentValue;
                });
        }
    };

    return _NumberArrayAccumulator;
})();

var StringCalculator = (function () {

    function _StringCalculator () {
        this.numberArrayAccumulator = new NumberArrayAccumulator();
    }

    _StringCalculator.prototype = {
        add: function (stringOfNumbers) {
            if (stringOfNumbers === "") {
                return 0;
            }
            return this.numberArrayAccumulator.sumFrom(stringOfNumbers);
        }
    };

    return _StringCalculator;
})();

module.exports = StringCalculator;
