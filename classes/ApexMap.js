class ApexMap {
    constructor(map, duration, timeRemaining) {
        if (typeof map !== 'string' || map == '') throw new Error('Map name required and not provided');
        if (typeof duration !== 'number') throw new Error('Map duration required and not provided');
        if (timeRemaining && timeRemaining > duration)
            throw new Error('timeRemaining cannot be greater than duration');

        this.map = map;
        this.duration = duration;
        this.timeRemaining = timeRemaining ?? undefined;
    };
};

module.exports = ApexMap;
