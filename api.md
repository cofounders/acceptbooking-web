# API

## Paths

Base: `http://api.ot.mediapop.co/`
API: `http://api.ot.mediapop.co/api/v1/?format=json`
Admin: `http://api.ot.mediapop.co/admin/`

## Creating a Booking

```js
$.ajax({
	url: 'http://dev.driver.acceptbooking.localhost/api/api/v1/bookings/?format=json',
	data: JSON.stringify({
		"booking_type":1,
		"driver":"/api/v1/drivers/3/",
		"dropoff_time":null,
		"pickup_time":"2013-06-17T21:37:43",
		"number_passengers":1,
		"passenger":"/api/v1/passenger/4/",
		"special_instructions":"On the double!",
		"status":2,
		"network":"/api/v1/networks/1/",
		"route":[
			"181 Edgefield Plains",
			"60D Kallang Pudding Road",
			"834 Sims Ave",
			"3A Jalan Terusan"
		]
	}),
	contentType : 'application/json; charset=utf-8',
	dataType: "json",
	type: 'POST'
})
```

## Add a Booking

```bash
curl 'http://api.ot.mediapop.co/api/v1/bookings/?format=json' --verbose -H 'Origin: http://api.ot.mediapop.co/' -H 'Host: api.ot.mediapop.co' -H 'Referer: http://api.ot.mediapop.co/' -H 'Content-Type: application/json; charset=UTF-8' --data-binary '{"booking_type":1,"driver":"/api/v1/drivers/3/","dropoff_time":null,"pickup_time":"2013-06-17T21:37:43","number_passengers":1,"passenger":"/api/v1/passenger/4/","special_instructions":"On the double!","status":2,"network":"/api/v1/networks/1/","route":["181 Edgefield Plains","60D Kallang Pudding Road","834 Sims Ave","3A Jalan Terusan"]}'

curl 'http://dev.driver.acceptbooking.localhost/api/api/v1/bookings/?format=json' --verbose -H 'Origin: http://dev.driver.acceptbooking.localhost/' -H 'Host: dev.driver.acceptbooking.localhost' -H 'Referer: http://dev.driver.acceptbooking.localhost/' -H 'Content-Type: application/json; charset=UTF-8' --data-binary '{"booking_type":1,"driver":"/api/v1/drivers/3/","dropoff_time":null,"pickup_time":"2013-06-17T21:37:43","number_passengers":1,"passenger":"/api/v1/passenger/4/","special_instructions":"On the double!","status":2,"network":"/api/v1/networks/1/","route":["181 Edgefield Plains","60D Kallang Pudding Road","834 Sims Ave","3A Jalan Terusan"]}'
```

## List All Bookings
curl api.ot.mediapop.co/api/v1/bookings/

## Log In

User: `cbas`
Password: `ilikeponies`
Role: `Admin`

User: `tester`
Password: `ilikeponies`
Role: `Driver`
Note: Can only log in via API. Not via Admin.
