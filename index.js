#!/usr/bin/env node
var q = process.argv[2];

if (! q) {
	console.error('Usage: %s <query>', process.argv[1]);
	process.exit(1);
}

var query = require('./query');
query(q, results);

function results(err, results) {
	if (err) throw err;

	var count = results.length;
	console.log('Tweet count matching %j: %d', q, count);
	if ( ! results.length) {
		console.log('no results found');
		process.exit(1);
	}
	var winnerIdx = Math.floor(Math.random() * count);

	var winner = results[winnerIdx];

	console.log('winner tweet: %j, from %s', winner.text, winner.user.name + ' (@' + winner.user.screen_name + ')');
}

function result(err, winner, tweetCount) {
	if (err) throw err;
	console.log('base tweet count: %d', tweetCount);
	if (winner) console.log('winner: %j', winner);
	else console.log('no winner');
}