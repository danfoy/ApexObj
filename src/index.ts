import ApexObj from './classes/ApexObj.js';
import seasonsData from './data/seasons.json' assert { type: 'json' };
import legendsData from './data/legends.json' assert { type: 'json' };

/**
 * The module exports a new instance of ApexObj. This causes the module to act
 * like a singleton due to the way nodejs caching works - as long as every
 * consumer of this module within a given package is using the same version of
 * it, each will receive the same instance of ApexObj.
 *
 * I have chosen this approach because of the way the module imports data from
 * an external JSON file. Exporting a faux singleton massively cuts down on
 * file reads and blocking.
 */
export default new ApexObj(seasonsData, legendsData);
