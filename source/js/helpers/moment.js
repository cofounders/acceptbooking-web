define(['underscore', 'handlebars', 'moment'],
function (_, Handlebars, moment) {

	return function (timestamp, options) {
		if (!timestamp) {
			return new Handlebars.SafeString('');
		}

		var hash = _.defaults(options.hash, {
			format: '',
			calendar: false,
			fromNow: false
		});

		var time = moment(timestamp);

		var output = hash.fromNow ? time.fromNow() :
				hash.calendar ? time.calendar() :
				time.format(hash.format);

		return new Handlebars.SafeString(output);
	};

});
