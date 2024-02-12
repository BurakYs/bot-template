'use strict';

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
        },
        'equalsTo': {
            value: function (targetArray) {
                if (this.length !== targetArray.length) return false;

                const sortedThis = [...this].sort();
                const sortedTarget = [...targetArray].sort();

                for (let i = 0; i < this.length; i++) {
                    const element = sortedThis[i];
                    const targetElement = sortedTarget[i];
                    const [element1Type, element2Type] = [Array.isArray(element) ? 'array' : typeof element, Array.isArray(targetElement) ? 'array' : typeof targetElement];

                    if (element1Type !== element2Type) return false;
                    if (element1Type === 'array' && !element.equalsTo(targetElement)) return false;
                    if (element1Type === 'object' && !element.equalsTo(targetElement)) return false;

                    const otherTypes = ['array', 'object'];
                    if (!otherTypes.includes(element1Type) && element !== targetElement) return false;
                }

                return true;
            }
        }
    });
    return true;
};