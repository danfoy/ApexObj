/**
 * Determines whether the input is an instance of Date.
 *
 * @param {*} target
 * @returns {boolean}
 */
function isDate(target) {
    return target && // Check date is truthy
        Object.prototype.toString.call(target) === '[object Date]' && // Check target is date object
        target != 'Invalid Date' // Check target is not 'inavlid date';
};
module.exports.isDate = isDate;

/**
 * Get a date object or an error. Creates a new Date() at calltime if no target
 * date is provided. Returns the supplied date if it is already an instance of
 * Date. Returns a new Date set to the supplied time if parseable into a Date
 * object. Throws an error if none of the above are applicable.
 *
 * @param {Date|ISO date string} target
 * @returns {Date|Error}
 */
function parseDate(target) {

    if (!target) return new Date();
    if (isDate(target)) return target;
    const newDate = new Date(target);
    if (isDate(newDate)) return newDate;
    throw new Error(`Unable to parse date from '${target}'`);
};
module.exports.parseDate = parseDate

/**
 * Select [quantity] items from [array]. By default returns a string in single
 * mode, unless {array: true} is passed in the options object. Doesn't allow
 * duplicates unless {subtractive: false} is passed in the options object.
 *
 * @param {array} source
 * @param {number} [quantity=1]
 * @param {boolean} [options={
 *         subtractive: true,
 *         array: false
 *     }]
 * @returns {string|array}
 */
function randomFrom(
    source,
    quantity = 1,
    options = {
        subtractive: true,
        array: false
    }
){
    // Error if input is not compatiable
    if (!Array.isArray(source))
        throw new Error(`${source} is not an array`);

    // Error if in subtractive mode and requested quantity is larger than input
    if (options.subtractive && quantity > source.length)
        throw new Error(`Requested quantity ${quantity} is greater than the ${source.length} available items`);

    // Return a single item in single mode (no array)
    if (quantity === 1 && !options.array)
        return source[Math.floor(Math.random() * source.length)];

    // Pick random items as if from a hat
    let availableEntries = [...source];
    let selectedEntries = [];
    for (let i = 0; quantity > i; i++) {
        const randomIndex = Math.floor(Math.random() * availableEntries.length);
        selectedEntries.push(availableEntries[randomIndex]);
        if (options.subtractive) availableEntries.splice(randomIndex, 1);
    };
    return selectedEntries;

};
module.exports.randomFrom = randomFrom;
