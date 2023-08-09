
export type ParseableDate = string | number | Date;

export interface DateRange {
    startTime: ParseableDate;
    endTime: ParseableDate;
};

/**
 * Determines whether the input is an instance of Date.
 */
export function isDate(target: Date | string): boolean {
    return !!target && // Check date is truthy
        Object.prototype.toString.call(target) === '[object Date]' && // Check target is date object
        target != 'Invalid Date' // Check target is not 'inavlid date';
};

/**
 * Check whether a supplied date (or the current date if none specified) is
 * within {startTime, endTime}. Throws if either dates.startTime or
 * dates.endTime is ommitted or if any of the values are invalid dates.
 */
export function withinDates(dateRange: DateRange, target = new Date()) {
    if (!dateRange.startTime) throw new Error('startTime required, received ' + dateRange.startTime);
    if (!dateRange.endTime) throw new Error('endTime required, received' + dateRange.endTime);

    const {startTime, endTime} = dateRange;
    const start = parseDate(startTime);
    const end = parseDate(endTime);
    const targetTime = parseDate(target);

    if (targetTime >= start && targetTime < end) return true;
    return false;
};

/**
 * Get a date object or an error. Creates a new Date() at calltime if no target
 * date is provided. Returns the supplied date if it is already an instance of
 * Date. Returns a new Date set to the supplied time if parseable into a Date
 * object. Throws an error if none of the above are applicable.
 *
 * todo: refactor to accept only type ParseableDate, with guards
 */
export function parseDate(target: ParseableDate): Date {
    if (typeof target == "number" || typeof target == "string") {
        const newDate = new Date(target);
        if (isDate(newDate)) return newDate;
    } else {
        if (isDate(target)) return target;
    }
    throw new Error(`Unable to parse date from '${target}'`);
};
