# ApexObj

Provides a cached instance of an object providing information on map rotation timings for Apex Legends via properties, computed properties, and methods.

## Beta information

ApexObj is a nodejs module which provides data about the game Apex Legends by Respawn Entertainment. It was spun off from a Discord bot when the functionality grew enough to warrant it. The Discord bot is also being rewritten from the ground up, and this project is under active development alongside it.

Full documentation is a target of the v1.0.0 release. There may be frequent breaking changes before the project reaches the v1 milestone.

## Basic usage

Install via NPM

```sh
npm install --save apexobj
```

Use as a nodejs module

```js
const Apex = require('apexobj')
```

Access data about Apex Legends map locations via the properties and methods on the object.

```js
Apex.seasons
// -> list of seasons for which data is available

Apex.currentMaps
// -> array of PlaylistItem/ScheduledPlaylistItem(s) describing current maps, or null if no data

Apex.nextMaps
// -> as above but with the upcoming map rotations

Apex.currentSeason
// -> a Season object describing the current season inc. dates, available playlists etc

Apex.getMapsByDate(date)
// -> the map for a specific date in ISO format, e.g. 2022-03-22T17:00:00Z

Apex.getSeasonByDate(date)
// -> as above, but for seasons
```

Returned objects are filterable also have their own properties and methods for convenience:

```js
const season11 = Apex.seasons.find(season => season.id === 11);
console.log(`Limited Time Modes for ${season11.name}:`, season11.LTMs)
```

There are several computed properties and methods for each class. These will be documented using JSDoc for the v1.0.0 release and published as an online reference. Until then they are fairly self-describing within the code.
