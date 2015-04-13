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

    var DefaultCustomDelimiterPatterns = [
        { name: "single", pattern: /\/\/[.:,;\|\n\t \"\'\*]\n/ },
        { name: "multiple", pattern: /\/\/\[[.:,;|\n\t \"\'\*]*\]\n/ }
    ];

    function _CustomDelimiter (options) {
        this._delimiter = options.delimiter || ",";
        this._customDelimiterPatterns = options.patterns || DefaultCustomDelimiterPatterns;
        this._hasCustomDelimiter = false;
        this._customDelimiterPatternName = "";
        this._delimiterLength = 0;
    }

    _CustomDelimiter.prototype = {
        getDelimiter: function (stringOfNumbers) {
            this._setCustomDelimiterFrom(stringOfNumbers);
            return this._delimiter;
        },
        hasCustomDelimiter: function () {
            return this._hasCustomDelimiter;
        },
        getPatternName: function () {
            return this._customDelimiterPatternName;
        },
        getDelimiterLength: function () {
            return this._delimiterLength;
        },
        _setCustomDelimiterFrom: function (stringOfNumbers) {
            for (var patternIndex in this._customDelimiterPatterns) {
                this._matchWithCustomDelimiterPattern(stringOfNumbers, this._customDelimiterPatterns[patternIndex]);
                if (this.hasCustomDelimiter()) {
                    this._customDelimiterPatternName = this._customDelimiterPatterns[patternIndex].name;
                    break;
                }
            }
        },
        _matchWithCustomDelimiterPattern: function(stringOfNumbers, delimiterPattern) {
            var matchArray = stringOfNumbers.match(delimiterPattern.pattern);
            if (matchArray) {
                this._delimiterLength = this._getCustomDelimiterLength(matchArray[0], delimiterPattern.name);
                this._delimiter = this._getCustomDelimiterFrom(matchArray, delimiterPattern.name);
                this._hasCustomDelimiter = true;
            }
        },
        _getCustomDelimiterLength: function (delimiterOfMatchArray, delimiterPatternName) {
            switch (delimiterPatternName) {
                case "single": return 1;
                case "multiple": return this._getCustomDelimiterLengthFromMultiple(delimiterOfMatchArray);
                default: return 1;
            }
        },
        _getCustomDelimiterLengthFromMultiple: function (delimiterOfMatchArray) {
            return delimiterOfMatchArray.substring(3, delimiterOfMatchArray.length - 2).length;
        },
        _getCustomDelimiterFrom: function (matchArray, delimiterPatternName) {
            switch (delimiterPatternName) {
                case "single": return matchArray[0].substr(2, this.getDelimiterLength());
                case "multiple": return matchArray[0].substr(3, this.getDelimiterLength());
                default: return matchArray[0].substr(2, this.getDelimiterLength());
            }
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
                resultStringOfNumberArray = this._getResultStringOfNumberArrayFromPatternName(stringOfNumbers, delimiter);
            }
            else {
                resultStringOfNumberArray = stringOfNumbers.split(delimiter);
            }

            return resultStringOfNumberArray;
        },
        _getResultStringOfNumberArrayFromPatternName: function (stringOfNumbers, delimiter) {
            switch (this._customDelimiter.getPatternName()) {
                case "single": return stringOfNumbers.slice(this._customDelimiter.getDelimiterLength() + 3).split(delimiter);
                case "multiple": return stringOfNumbers.slice(this._customDelimiter.getDelimiterLength() + 5).split(delimiter);
                default: return stringOfNumbers.slice(this._customDelimiter.getDelimiterLength() + 3).split(delimiter);
            }
        }
    };

    return _StringOfNumberArray;
})();

var NumberArray = (function () {

    var defaultHighestValidNumber = 1000;

    function _NumberArray (highestValidNumber) {
        this._highestValidNumber = highestValidNumber || defaultHighestValidNumber;
    }

    _NumberArray.prototype = {
        generateFrom: function (stringOfNumbers) {
            var _stringOfNumberArray = new StringOfNumberArray();
            var stringOfNumberArray = _stringOfNumberArray.generateFrom(stringOfNumbers);
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
