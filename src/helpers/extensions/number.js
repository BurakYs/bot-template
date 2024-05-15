module.exports = function () {
    Object.defineProperties(Number.prototype, {
        'formatTime': {
            value: function (code = 'D') {
                return `<t:${Math.floor(this / 1000)}:${code}>`;
            }
        }
    });
    return true;
};