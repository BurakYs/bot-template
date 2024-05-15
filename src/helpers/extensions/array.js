module.exports = function () {
    Object.defineProperties(Array.prototype, {
        'random': {
            value: function () {
                return this[Math.floor(Math.random() * this.length)];
            }
        },
        'last': {
            value: function () {
                return this[this.length - 1];
            }
        }
    });
    return true;
};