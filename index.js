var port = 3000
var targetTime = null

var express = require('express')
var app = express()

// serve bower_components (javascript libraries)
app.use('/static',  express.static(__dirname + '/bower_components'));
app.set('view engine', 'jade')

var http = require('http').Server(app)
var io = require('socket.io')(http)
var moment = require('moment')

// Client
app.get('/', function(req, res){
	res.render('client')
})

// Server
app.get('/server', function(req, res){
	res.render('server')
})

// handle socket.io
io.on('connection', function(socket) {
	console.log('device connected')
	socket.on('disconnect', function() {
		console.log('device disconnected')
	})
	socket.on('resetCountdown', function() {
		console.log('resetCountdown')
		targetTime = moment().add(60, 'minutes')
	})
})

/**
 * This function runs every second to update the current state of the countdown
 */
setInterval(function() {
	if(targetTime) {
		io.emit('countdown', targetTime.diff(moment()))
	}
}, 1000)

// start server
http.listen(3000, function(){
	console.log('listening on *:3000')
})
