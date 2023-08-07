/**
 * Determines whether the input is an instance of Date.
 *
 * @param {*} target
 * @returns {boolean}
 */
export function isDate(target) {
    return target && // Check date is truthy
        Object.prototype.toString.call(target) === '[object Date]' && // Check target is date object
        target != 'Invalid Date' // Check target is not 'inavlid date';
};

/**
 * Get a date object or an error. Creates a new Date() at calltime if no target
 * date is provided. Returns the supplied date if it is already an instance of
 * Date. Returns a new Date set to the supplied time if parseable into a Date
 * object. Throws an error if none of the above are applicable.
 *
 * @param {Date|dateString} [target=now] the date to target
 * @returns {Date|Error}
 */
export function parseDate(target) {

    if (!target) return new Date();
    if (isDate(target)) return target;
    const newDate = new Date(target);
    if (isDate(newDate)) return newDate;
    throw new Error(`Unable to parse date from '${target}'`);
};

/**
 * Check whether a supplied date (or the current date if none specified) is
 * within {startTime, endTime}. Throws if either dates.startTime or
 * dates.endTime is ommitted or if any of the values are invalid dates.
 *
 * @param {Date} dates.startTime the starting time as a parseable date
 * @param {Date} dates.endTime the ending time as a parseable date
 * @param {Date} target the date to target, current date if not provided
 * @returns {Boolean} whether target is between supplied dates
 */
export function withinDates({startTime, endTime}, target = new Date()) {
    if (!startTime) throw new Error('startTime required, received', startTime);
    if (!endTime) throw new Error('endTime required, received', endTime);
    const start = parseDate(startTime);
    const end = parseDate(endTime);
    const _target = parseDate(target);

    if (_target >= start && _target < end) return true;
    return false;
};
