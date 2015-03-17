"use strict";

function Accumulator (numberStringArray) {
    this._numberStringArray = numberStringArray;
}

Accumulator.prototype = {
    getSum: function () {
        return this._sumOfNumbers(this._getNumbersFromString(this._numberStringArray));
    },
    _sumOfNumbers: function (numbersArray) {
        return numbersArray.reduce(function(previousValue, currentValue) {
            return previousValue + currentValue;
        });
    },
    _getNumbersFromString: function (numbersString) {
        return numbersString.map(function (numberString) {
            return parseInt(numberString);
        });
    }
};

function StringCalculator (delimiter) {
    this.delimiter = delimiter;
}

StringCalculator.prototype = {
    Add: function (numbersString) {
        if (numbersString !== "") return (new Accumulator(numbersString.split(this.delimiter))).getSum();
        return 0;
    }
}

module.exports = StringCalculator;