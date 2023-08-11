import { ParseableDate, parseDate } from '../util/date.js';
import Season, { SeasonData } from './Season.js';
import LegendsArray from './LegendsArray.js';
import { LegendData } from './Legend.js';

/**
 * This is the base class for the module, and the first port of call for making
 * queries. All data available for the module is parsed into an object, for
 * which this class is the starting point.
 *
 * It parses information from `/data/seasons.json` and uses this to construct
 * an array of {@link Season} objects. Each is comprised of properties (and
 * psuedo, 'read only' properties retrieved using [getters]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get})
 * containing useful information such as start and end times, and an array
 * of playlists available during the season, each constructed from a class
 * which extends the base {@link BasePlaylist} class. Each season and playlist
 * contains further methods for querying current maps and modes available at
 * the time the methods were called or at some specified date.
 */
export default class ApexObj {
  seasons: Array<Season>;
  legends: LegendsArray;

  constructor(seasonsData: SeasonData[], legendsData: LegendData[]) {
    if (!seasonsData) throw new Error('No Seasons data provided');
    if (!legendsData) throw new Error('No Legends data provided');
    const legendsSubmittable = [...legendsData] as const;
    this.seasons = seasonsData.map((season) => new Season(season));
    this.legends = new LegendsArray(...legendsSubmittable);
  }

  /**
   * Returns the current {@link Season}, or {@link null} if outside of the date
   * boundaries for available seasons.
   */
  get currentSeason() {
    if (new Date() < this.seasons[0].startTime) return null;
    if (new Date() > this.seasons[this.seasons.length - 1].endTime) return null;
    return this.getSeasonByDate();
  }

  /**
   * Returns the next {@link Season} via {@link Season#getSeasonByDate}, or
   * {@link null} if no data available.
   */
  get nextSeason() {
    return this.getSeasonByDate(this.currentSeason?.endTime) || null;
  }

  /**
   * Returns an array of current maps ({@link PlaylistItem}s), or
   * {@link null} if not called during a season or if no maps are found.
   */
  get currentMaps() {
    if (!this.currentSeason) return null;
    return this.currentSeason.currentMaps;
  }

  /**
   * Returns an array of the upcoming maps (as {@link ScheduledPlaylistItem}s)
   * or `null` if none found.
   */
  get nextMaps() {
    if (!this.currentSeason) return null;
    return this.currentSeason.nextMaps;
  }

  /**
   * Returns an array of the currently-running limited time modes for the
   * current season, or {@link null} if none found.
   */
  get currentLTMs() {
    if (!this.currentSeason) return null;
    return this.currentSeason.currentLTMs;
  }

  /**
   * Returns an array of the current limited time modes which replace
   * 'standard' modes, or {@link null} if none found.
   */
  get currentTakeovers() {
    if (!this.currentSeason) return null;
    return this.currentSeason.currentTakeovers;
  }

  /**
   * Returns the season for the given date, or {@link null} if none found. Uses
   * the current date if none provided.
   */
  getSeasonByDate(date?: ParseableDate) {
    const targetDate = date ? parseDate(date) : new Date();
    const foundSeason = this.seasons.find(
      (season) => season.startTime <= targetDate && season.endTime > targetDate,
    );
    return foundSeason || null;
  }

  /**
   * Returns an array of the current maps ({@link ScheduledPlaylistItem}s)
   * for the given date, or {@link null} if none found. Uses the current date
   * if none provided.
   */
  getMapsByDate(date: ParseableDate = new Date()) {
    const targetDate = parseDate(date);
    const targetSeason = this.getSeasonByDate(targetDate);
    if (!targetSeason) return null;
    return targetSeason.getMapsByDate(targetDate);
  }
}
