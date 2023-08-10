# ApexObj

A filterable, queryable object providing data about the game [Apex Legends](https://www.ea.com/games/apex-legends).

Forked from another personal project to use as an information source for current map rotations without having to rely on HTTP-based APIs (that may not be available, and have latency).

Prioritises keeping the amount of data you need to provide upfront to an absolute minimum, because I'll be the one having to maintain it, and writing detailed config is error-prone and boring.

Achieves this by inferring gamemode, type of map rotation, takeover events etc. from the small amount of data provided, and using this to generate rich structures of highly filterable and remappable data, which extend built-in structures such as Array with methods to provide functions such as additional data parsing, transforming, querying.

The end-user experience is intended to be as intuitive as possbile, providing data via dynamic read-only accessors such as `apex.legends.random.squad`, `apex.seasons.current`, `apex.maps.next` and so on. And because it's written in TypeScript and described in the source via [tsdoc](https://tsdoc.org) comments, TS-aware editors (such as VS Code) will provide automatic property descriptions and valid arguments for methods for end-users, even if they're writing vanilla JS.

- Start and end times for seasons, playlists, and limited-time modes
- Current and next maps per season or playlist
- Active maps per date query
- Random Legend/squad generator

Still to come:

- Daily/weekly crafter items schedule
- Additional data for Legends for easy filtering
- Automatically-generated API documentation

## Beta information

There will be many breaking changes before the project reaches the v1 milestone. The shape of the API is not yet set, and porting both from its parent project and from ES6 to TypeScript are highlighting many areas for improvement, with which I intend to be fairly liberal before locking in a v1.0.0.
