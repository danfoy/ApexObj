import PlaylistItem from './PlaylistItem.js';
import { ParseableDate, parseDate } from '../util/date.js';
import { Playlist } from './BasePlaylist.js';

interface SchedulingOptions {
  mapName: string;
  mapDuration: number;
  startTime: ParseableDate;
}

/**
 * A {@link PlaylistItem} with a designated start and end time.
 */
export default class ScheduledPlaylistItem extends PlaylistItem {
  startTime: Date;
  endTime: Date;

  constructor(
    { mapName, mapDuration, startTime }: SchedulingOptions,
    playlist: Playlist,
  ) {
    super({ mapName, mapDuration }, playlist);

    this.startTime = parseDate(startTime);
    this.endTime = new Date(this.startTime.getTime() + mapDuration);
  }

  /**
   * The time until (or since the end of) this map rotation. Returns a negative
   * value if the end of this rotation has already passed when called.
   */
  get timeRemaining() {
    return this.endTime.valueOf() - new Date().valueOf();
  }
}
