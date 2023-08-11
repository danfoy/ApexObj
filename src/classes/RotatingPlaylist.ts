import { ParseableDate, parseDate, withinDates } from '../util/date.js';
import BasePlaylist, { PlaylistData } from './BasePlaylist.js';
import PlaylistItem from './PlaylistItem.js';
import ScheduledPlaylistItem from './ScheduledPlaylistItem.js';
import Season, { SeasonData } from './Season.js';

/**
 * Playlist class for modes which rotate through a collection of maps at set
 * intervals, e.g. the default 'Play Apex' mode.
 */
export default class RotatingPlaylist extends BasePlaylist {
  rotations: Array<PlaylistItem>;

  constructor(playlistData: PlaylistData, seasonData: SeasonData | Season) {
    super(playlistData, seasonData);

    // Argument validation
    if (!playlistData.maps || !playlistData.mapDurations)
      throw new Error('Requires .maps and .mapDurations from Season');

    // Private properties
    const { maps, mapDurations } = playlistData;
    this.rotations = [...mapDurations.map((duration) => duration * 60 * 1000)]
      .map((duration) =>
        [...maps].map(
          (map) =>
            new PlaylistItem({ mapName: map, mapDuration: duration }, this),
        ),
      )
      .flat();
  }

  /**
   * Returns the `baseTime` of the playlist - a time before
   * [startTime]{@link RotatingPlaylist#startTime} when a cycle of the
   * [rotations]{@link RotatingPlaylist#rotations} array begins. This is
   * needed in some cases where for whatever reason the start time of the
   * playlist is offset from when it became available to play. Returns
   * [startTime]{@link RotatingPlaylist#startTime} if not explicitly set in
   * `/data/seasons.json`.
   * @todo refactor this into #getPlaylistTimeElapsed, only place it is used and is confusing next to baseTime.
   */
  get rotationBaseTime() {
    return this.baseTime ? this.baseTime : this.startTime;
  }

  /**
   * Calculate the total duration of one complete cycle of all
   * {@link PlaylistItem}s in this playlist, in milliseconds.
   */
  get playlistRotationsDuration() {
    return this.rotations.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.duration;
    }, 0);
  }

  /**
   * Calculate the current index position of [rotations]{@link RotatingPlaylist#rotations}
   * – i.e. how many {@link PlaylistItem}s deep we are into the current
   * rotations cycle, minus 1.
   */
  get currentIndex() {
    return this.getIndexByOffset(this.getPlaylistTimeElapsed());
  }

  /**
   * Returns the current map rotation in this playlist.
   */
  get currentMap() {
    return this.getMapByDate();
  }

  /**
   * Calculate the next map rotation in this playlist. Returns the first item of
   * the playlist if before this playlist's start time, or {@link null} if the
   * current map is the last item before [endTime]{@link BasePlaylist#endTime} or if
   * called after the playlist has ended.
   */
  get nextMap() {
    if (new Date() < this.startTime) return this.getMapByDate(this.startTime);
    if (new Date() >= this.endTime) return null;
    if (this.currentMap && this.currentMap.endTime >= this.endTime) return null;
    if (this.currentMap) return this.getMapByDate(this.currentMap.endTime);
    return null;
  }

  /**
   * Calculate the index of the position in {@link RotatingPlaylist#rotations}
   * for a given millisecond offset from the start of a cycle of rotations.
   */
  getIndexByOffset(offset: number) {
    const offsets = [
      0,
      ...this.rotations
        .map((playlistItem) => playlistItem.duration)
        .map((duration, index, arr) =>
          arr.slice(0, index + 1).reduce((acc, current) => acc + current),
        )
        .slice(0, this.rotations.length - 1),
    ];
    return this.rotations.findIndex(
      (map, index) => offsets[index] + map.duration > offset,
    );
  }

  /**
   * Calculate the offset in milliseconds for a given index of [rotations]{@link RotatingPlaylist#rotations}
   * from the start of the rotation cycle.
   */
  getOffsetByIndex(index: number) {
    const targetIndex = this.normaliseIndex(index);
    if (targetIndex === 0) return 0;
    return this.rotations
      .map((rotation) => rotation.duration)
      .slice(0, targetIndex)
      .reduce((acc, current) => current + acc);
  }

  /**
   * Takes a potentially overflowed index for {@link RotatingPlaylist#rotations}
   * and returns a valid index.
   * @todo move this to a utility function
   */
  normaliseIndex(target: number) {
    if (target < this.rotations.length) return target;
    return target % this.rotations.length;
  }

  /**
   * Returns the milliseconds elapsed since the start of this rotation cycle.
   */
  getPlaylistTimeElapsed(date: ParseableDate = new Date()) {
    const targetDate = parseDate(date);
    const startDate = this.rotationBaseTime;
    const offset =
      (targetDate.valueOf() - startDate.valueOf()) %
      this.playlistRotationsDuration;

    if (Number.isNaN(offset))
      throw new Error(`Unable to get requested offset; got '${offset}'`);

    return offset;
  }

  /**
   * Get the map active for the given date, or the current date if not provided.
   */
  getMapByDate(date: ParseableDate = new Date()) {
    const targetDate = parseDate(date);
    if (!withinDates(this, targetDate)) return null;

    const targetIndex = this.getIndexByOffset(
      this.getPlaylistTimeElapsed(targetDate),
    );
    const targetRotation = this.rotations[targetIndex];
    const mapTimeElapsed =
      this.getPlaylistTimeElapsed(targetDate) -
      this.getOffsetByIndex(targetIndex);
    const targetStartTime = new Date(targetDate.valueOf() - mapTimeElapsed);

    return new ScheduledPlaylistItem(
      {
        mapName: targetRotation.map,
        mapDuration: targetRotation.duration,
        startTime: targetStartTime,
      },
      this,
    );
  }
}
