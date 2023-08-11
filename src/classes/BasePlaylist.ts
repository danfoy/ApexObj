import { parseDate } from '../util/date.js';
import Season, { SeasonData } from './Season.js';
import SplitPlaylist from './SplitPlaylist.js';
import RotatingPlaylist from './RotatingPlaylist.js';
import SingleItemPlaylist from './SingleItemPlaylist.js';

export interface PlaylistData {
  mode: string;
  maps: Array<string>;
  startTime?: string;
  endTime?: string;
  baseTime?: string;
  splitTime?: string;
  mapDurations?: Array<number>;
  LTM?: boolean;
  replaces?: string;
}

export type Playlist = SplitPlaylist | RotatingPlaylist | SingleItemPlaylist;

/**
 * Base Playlist class, used as a foundation for the more specialised playlist
 * types. You will rarely if ever see this class used explicitly - refer to the
 * specialised Playlist derivatives for each mode:
 *
 * - {@link SingleItemPlaylist}: Single-map LTMs
 * - {@link RotatingPlaylist}: Play Apex, most LTMs
 * - {@link SplitPlaylist}: Ranked Leagues
 *
 * @export
 * @class BasePlaylist
 */
export default class BasePlaylist {
  mode: string;
  LTM: boolean;
  maps: Array<string>;
  startTime: Date;
  endTime: Date;
  takeover: boolean;
  replaces: string | null;
  ranked: boolean;
  baseTime: Date;
  constructor(playlistData: PlaylistData, seasonData: SeasonData | Season) {
    this.mode = playlistData.mode;
    this.maps = playlistData.maps;
    this.LTM = playlistData?.LTM ? true : false;
    this.takeover = playlistData?.replaces ? true : false;
    this.replaces = playlistData?.replaces ?? null;
    this.ranked = this.mode.toLowerCase().includes('ranked') ? true : false;
    this.startTime = playlistData.startTime
      ? parseDate(playlistData.startTime)
      : parseDate(seasonData.startTime);
    this.endTime = playlistData.endTime
      ? parseDate(playlistData.endTime)
      : parseDate(seasonData.endTime);
    this.baseTime = playlistData?.baseTime
      ? parseDate(playlistData.baseTime)
      : this.startTime;
  }
}
