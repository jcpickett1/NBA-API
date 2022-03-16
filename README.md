# Player Game Statistics API

This is a prototype API for retrieving statistics about the seasons between 2014 and 2020 (inclusive.) The primary concern is categorizing players' seasons where they played 50 or more games.

## Getting Started

Run `npm i` to install required packages.

Run `tsc` to compile JS file from TypeScript. Some TypeScript compilers may not detect all installed modules and flag an error for missing dependency. Your `.js` file should still be compiled correctly and will properly import the module from `node_modules`

Your environment should now be

Run `npm start` to run compiled JS server

OR

Run `npm test` to run a mocha test suite

## Endpoints

#### GET `/`

Returns welcome message.

#### GET `/playerSearch/:search`

Returns a list of players with the first or last name specified in `:search` term. Useful for finding IDs of players for more specific searching.

#### GET `/player/:id`

Returns name and game data for player with specified ID.

#### Get `/lebron`

Bespoke route for the king, returns data on LeBron James, no ID required. (It's 237)
