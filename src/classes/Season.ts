import { ParseableDate, parseDate, withinDates } from '../util/date.js';
import RotatingPlaylist from './RotatingPlaylist.js';
import SplitPlaylist from './SplitPlaylist.js';
import SingleItemPlaylist from './SingleItemPlaylist.js';
import PlaylistItem from './PlaylistItem.js';
import BasePlaylist, { Playlist, PlaylistData } from './BasePlaylist.js';

export interface SeasonData {
  id: number;
  name: string;
  playlists: Array<PlaylistData>;
  startTime: string;
  endTime: string;
  LTMs?: Array<PlaylistData>;
}

export default class Season {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date;
  playlists: Array<Playlist>;

  constructor(seasonData: SeasonData) {
    this.id = seasonData.id;

    this.name = seasonData.name;

    this.startTime = parseDate(seasonData.startTime);

    this.endTime = parseDate(seasonData.endTime);

    this.playlists = (() => {
      // Array of standard playlists
      const availablePlaylists = seasonData.playlists.map((playlist) =>
        this.parsePlaylist(playlist),
      );

      // Array of LTM playlists if available, else empty array
      const availableLTMs = seasonData.LTMs
        ? [...seasonData.LTMs].map((ltm) =>
            this.parsePlaylist({ ...ltm, LTM: true }),
          )
        : [];

      // return combined standard and LTM playlists
      return [...availablePlaylists, ...availableLTMs];
    })();
  }

  get unranked() {
    return {
      battleRoyale: this.playlists.find(
        (playlist) => playlist.mode == 'Play Apex',
      ),
    };
  }

  /**
   * Alias for Ranked Leagues.
   *
   * @readonly
   * @memberof Season
   * @deprecated
   * @todo remove this alias?
   */
  get ranked() {
    return {
      battleRoyale: this.playlists.find(
        (playlist) => playlist.mode == 'Ranked Leagues',
      ),
    };
  }

  /**
   * Gets an array of current playlists via this instance's
   * [getPlaylistsByDate]{@link Season#getPlaylistsByDate} method.
   *
   * @readonly
   * @memberof Season
   */
  get currentPlaylists() {
    return this.getPlaylistsByDate();
  }

  /**
   * Gets an array of current maps from this instance's
   * [getMapsByDate]{@link Season#getMapsByDate} method.
   *
   * @readonly
   * @memberof Season
   */
  get currentMaps() {
    return this.getMapsByDate();
  }

  /**
   * Gets an array containing the upcoming {@link PlaylistItem}s for each
   * {@link BasePlaylist} by calling the `.nextMap` method on each instance
   * (depending on playlist type, e.g. {@link RotatingPlaylist#nextMap}).
   * Takes into account whether a takeover LTM is about to end and will
   * attempt to replace this entry with the 'regular' mode map.
   *
   * @todo deal with nextmap being an ltm?
   *
   */
  get nextMaps() {
    const nextMaps = this.playlists
      .map((playlist) => playlist.nextMap)
      .filter((map) => map !== null);

    if (!nextMaps.length) return null;

    return nextMaps;

    // let nextMaps = this.playlists
    //     .map(playlist => playlist.nextMap)
    //     .filter(map => map !== null);

    // if (!nextMaps.length) return null;

    // if (this.currentTakeovers) this.currentTakeovers.forEach(takeover => {
    //     nextMaps = nextMaps.filter(map => map?.mode !== takeover.replaces);
    //     nextMaps.push(this.playlists
    //         .find(playlist => playlist.mode === takeover.replaces)
    //         .getMapByDate(takeover.endTime)
    //     );
    // // });

    // if (!nextMaps.length) return null;

    // return nextMaps;
  }

  /**
   * Array of limited time modes for this season, or null if none found.
   */
  get LTMs() {
    const availableLTMs = this.playlists.filter((playlist) => playlist.LTM);
    if (!availableLTMs.length) return null;
    return availableLTMs;
  }

  /**
   * Array of currently-active limited time modes, or null if none found.
   */
  get currentLTMs() {
    if (!this.LTMs) return null;
    const currentLTMs = this.LTMs.filter((ltm) => withinDates(ltm));
    if (currentLTMs.length === 0) return null;
    return currentLTMs;
  }

  /**
   * Array of limited time modes in this season which replace another mode, or
   * null if none found.
   */
  get takeovers() {
    if (!this.LTMs) return null;
    const takeovers = this.LTMs.filter((ltm) => ltm.takeover);
    if (!takeovers.length) return null;
    return takeovers;
  }

  /**
   * Array of currently-active limited time modes which replace another
   * playlist in the season, or null if none found.
   */
  get currentTakeovers() {
    if (!this.takeovers) return null;
    const currentTakeovers = this.takeovers.filter((takeover) =>
      withinDates(takeover),
    );
    if (!currentTakeovers.length) return null;
    return currentTakeovers;
  }

  /**
   * Take playlist data and parse into an instance of a {@link BasePlaylist}
   * subclass, determined by querying sections of the data.
   */
  parsePlaylist(playlistData: PlaylistData): Playlist {
    if (playlistData.splitTime) return new SplitPlaylist(playlistData, this);
    if (playlistData.mapDurations)
      return new RotatingPlaylist(playlistData, this);
    if (playlistData.maps.length === 1)
      return new SingleItemPlaylist(playlistData, this);
    throw new Error(`Unable to parse playlist data '${playlistData}'`);
  }

  /**
   * Get an array of {@link BasePlaylist} subclass instances active during the
   * provided date, or the current date if not provided. Returns null
   * if none found.
   */
  getPlaylistsByDate(date: ParseableDate = new Date()) {
    const targetDate = date ? parseDate(date) : new Date();
    let availablePlaylists = this.playlists.filter((playlist) =>
      withinDates(playlist, targetDate),
    );

    const takeovers = availablePlaylists.filter(
      (playlist) => playlist.takeover,
    );

    takeovers.forEach(
      (takeover) =>
        (availablePlaylists = availablePlaylists.filter(
          (playlist) => playlist.mode !== takeover.replaces,
        )),
    );

    if (availablePlaylists.length === 0) return null;
    return availablePlaylists;
  }

  /**
   * Get an Array of maps active at a given date, or the current date if not
   * provided. Returns null if outside of season date boundaries.
   *
   * @todo should return null if no maps found.
   */
  getMapsByDate(date: ParseableDate = new Date()) {
    const targetDate = parseDate(date);
    if (!withinDates(this, targetDate)) return null;
    return this.getPlaylistsByDate(targetDate)?.map((playlist) =>
      playlist.getMapByDate(targetDate),
    );
  }
}
