define(['jquery', 'underscore', 'backbone', 'app',
	'modules/Header'
],
function ($, _, Backbone, app,
	Header
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Base = Backbone.View.extend({
		initialize: function (options) {
			window.scrollTo(0, 0);
		}
	});

	Views.Install = Views.Base.extend({
		template: 'layouts/install'
	});

	Views.Landing = Views.Base.extend({
		template: 'layouts/landing'
	});

	Views.Login = Views.Base.extend({
		template: 'layouts/login'
	});

	Views.Menu = Views.Base.extend({
		template: 'layouts/menu'
	});

	Views.Network = Views.Base.extend({
		template: 'layouts/network'
	});

	Views.Setup = Views.Base.extend({
		template: 'layouts/setup'
	});

	Views.Add = Views.Base.extend({
		template: 'layouts/add'
	});

	Views.Current = Views.Base.extend({
		template: 'layouts/current'
	});

	Views.Assigned = Views.Base.extend({
		template: 'layouts/assigned'
	});

	Views.Schedule = Views.Base.extend({
		template: 'layouts/schedule'
	});

	Views.Available = Views.Base.extend({
		template: 'layouts/available'
	});

	Views['404'] = Views.Base.extend({
		template: 'layouts/404'
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
