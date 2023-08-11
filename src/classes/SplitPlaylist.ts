import { ParseableDate, parseDate } from '../util/date.js';
import BasePlaylist, { PlaylistData } from './BasePlaylist.js';
import ScheduledPlaylistItem from './ScheduledPlaylistItem.js';
import Season, { SeasonData } from './Season.js';

/**
* An implementation for playlists which have two maps and change at a
* designated 'split time', e.g. Ranked Leagues.
*/
export default class SplitPlaylist extends BasePlaylist {
  splitTime: Date;
  rotations: Array<ScheduledPlaylistItem>;

  constructor(playlistData: PlaylistData, seasonData: SeasonData | Season) {
    super(playlistData, seasonData);

    if(!playlistData.splitTime || !playlistData.maps)
    throw new Error('requires maps and splitTime from playlistData');

    this.splitTime = parseDate(playlistData.splitTime);
    this.rotations = [
      new ScheduledPlaylistItem({
        mapName: this.maps[0],
        mapDuration: ((this.splitTime.valueOf() - this.startTime.valueOf())),
        startTime: this.startTime,
      }, this),
      new ScheduledPlaylistItem({
        mapName: this.maps[1],
        mapDuration: ((this.endTime.valueOf() - this.splitTime.valueOf())),
        startTime: this.splitTime,
      }, this),
    ];
  };

  /**
  * Gets the current map rotation, or {@link null} if none available (e.g.
  * outside of date boundaries).
  */
  get currentMap() {
    if (new Date().valueOf() < this.startTime.valueOf()) return null;
    if (new Date().valueOf() > this.endTime.valueOf()) return null;
    return this.getMapByDate();
  };

  /**
  * Gets the next map rotation, the first map rotation if called before the
  * playlist startTime, or {@link null} if during the last rotation or after
  * the playlist endTime.
  */
  get nextMap() {
    if (new Date().valueOf() > this.endTime.valueOf()) return null;
    if (new Date().valueOf() < this.startTime.valueOf()) return this.rotations[0]
    if (this.getMapByDate() == this.rotations[0]) return this.rotations[1];
    return null;
  };

  /**
  * Get the map rotation for a given date, or the current date if none
  * provided, or {@link null} if outside of date boundaries.
  */
  getMapByDate(date: ParseableDate = new Date()) {
    const targetDate = parseDate(date);

    if (targetDate.valueOf() < this.startTime.valueOf()) return null;
    if (targetDate.valueOf() > this.endTime.valueOf()) return null;

    return this.rotations.find(rotation =>
      rotation.startTime.valueOf() < targetDate.valueOf() &&
      rotation.endTime.valueOf() > targetDate.valueOf()
    );
  };
};
