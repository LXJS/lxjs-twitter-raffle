var fs = require('fs');
var Url = require('url');
var _ = require('lodash');
var home = require('osenv').home();
var join = require('path').join;
var Twitter = require('twitter');

module.exports = query;

function query(q, cb) {
	var credentials = fs.readFileSync(join(home, '.twitter_credentials.json'), {encoding: 'utf8'});
	credentials = JSON.parse(credentials);
	var twitter = Twitter(credentials);

	var sinceId = 0;
	var retStatuses = [];
	getOnePage(replied);

	function replied(results) {
		if (results instanceof Error) throw results;
		if (! results) throw new Error('Results: ' + JSON.stringify(results));
		var statuses = results.statuses;
		if (statuses.length) retStatuses = retStatuses.concat(statuses);

		var thisSinceId = extractSinceId(results);
		if (statuses.length && sinceId != thisSinceId) {
			sinceId = thisSinceId;
			getOnePage(replied);
		} else callback(null, retStatuses);
	}

	function getOnePage(cb) {
		var options = {
			count: 100,
			result_type: 'recent',
			max_id: sinceId
		};

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



function extractSinceId(results) {
	var maxId = _.min(_.pluck(results.statuses, 'id'));
	return maxId;
}