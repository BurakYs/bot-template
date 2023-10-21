'use strict';

module.exports = function () {
    Object.defineProperties(String.prototype, {
        "title": {
            value: function () {
                const splitStr = this.toLowerCase().split(" ");
                for (let i = 0; i < splitStr.length; i++) {
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                }
                return splitStr.join(" ");
            },
        },
    });
    return true;
}