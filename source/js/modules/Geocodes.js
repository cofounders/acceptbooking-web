define(['jquery', 'underscore', 'backbone', 'app',
	'leaflet'
], function ($, _, Backbone, app,
	L
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	var dummyStreets = function () {
		return _.chain([
				'Kallang Pudding Rd',
				'Sims Ave',
				'Sengkang East Way',
				'Changi Road',
				'Marina Boulevard',
				'Jalan Terusan',
				'Faber Heights',
				'Cactus Drive',
				'Edgefield Plains'
			])
			.shuffle()
			.map(function (street) {
				var number = Math.ceil(Math.random() * 500);
				var letter = Math.random() < 0.1 ?
						_.shuffle('ABCDEFGH'.split(''))[0] :
						'';
				return number + letter + ' ' + street;
			})
			.value();
	};

	Models.Reverse = Backbone.Model.extend({
		url: function () {
			return app.api(
				'/geocodes/reverse/:lat/:lng/',
				this.toJSON()
			);
		},
		fetch: function (options) {
			var that = this;
			setTimeout(function () {
				var response = {
					address: dummyStreets()[0]
				};
				that.set(response);
				if (options && options.success) {
					options.success(that, response, options);
				}
			}, 100 + Math.random() * 300);
		}
	});

	Collections.Search = Backbone.Collection.extend({
		url: function () {
			return app.api(
				'/geocodes/:query/',
				this.options
			);
		},
		initialize: function (options) {
			this.options = options || {};
		},
		getQuery: function () {
			return this.options.query;
		},
		setQuery: function (query) {
			this.options.query = query;
		},
		fetch: function (options) {
			var that = this;
			setTimeout(function () {
				var streets = that.options.query.length ?
					dummyStreets() : [];
				var response = _.map(streets, function (street) {
					var geocode = {
						address: street
					};
					var lng = Math.random() > 0.5 ? 1 : -1;
					var lat = Math.random() > 0.5 ? 1 : -1;
					geocode.lng = 103.8000 + lng * (Math.random() * 0.15);
					geocode.lat = 1.3267 + lat * (Math.random() * 0.08);
					return geocode;
				});
				that.reset(response);
				that.trigger('sync');
			}, 100 + Math.random() * 300);
		}
	});

	Views.Search = Backbone.View.extend({
		template: 'geocodes/search',
		initialize: function () {
			this.listenTo(this.collection, 'sync', this.render);
		},
		serialize: function () {
			return {
				query: this.collection.getQuery(),
				geocodes: this.collection.toJSON()
			};
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
