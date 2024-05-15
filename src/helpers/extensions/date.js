module.exports = function () {
    Object.defineProperties(Date.prototype, {
        'formatTime': {
            value: function (code = 'D') {
                return `<t:${Math.floor(this.getTime() / 1000)}:${code}>`;
            }
        }
    });
    return true;
};