var fs = require('fs');
var Twitter = require('twitter');


module.exports = query;

function query(q, cb) {
	var credentials = fs.readFileSync(__dirname + '/.credentials.json', {encoding: 'utf8'});
	credentials = JSON.parse(credentials);
	var twitter = Twitter(credentials);

	var maxId = 0;
	var retStatuses = [];
	getOnePage(replied);

	function replied(results) {
		if (! results) throw new Error('Results: ' + JSON.stringify(results));
		var statuses = results.statuses;
		if (statuses.length) retStatuses = retStatuses.concat(statuses);

		var thisMaxId = results.search_metadata.max_id;
		if (statuses.length && thisMaxId != maxId) {
			maxId = thisMaxId;
			getOnePage(replied);
		} else callback(null, retStatuses);
	}

	function getOnePage(cb) {
		var options = {
			count: 100,
			result_type: 'recent'
		};

		if (maxId) options.since_id = maxId;

		twitter.search(q, options, cb);
	}

	var calledback = false;
	function callback() {
		if (! calledback) {
			calledback = true;
			cb.apply(null, arguments);
		}
	}
}

