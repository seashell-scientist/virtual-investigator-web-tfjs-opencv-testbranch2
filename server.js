const express = require( "express" )
const http = require( "http" )
const app = express()
const server = http.createServer( app )
// Node-Record-lpcm16
const recorder = require( 'node-record-lpcm16' );
// Imports the Google Cloud client library
const speech = require( '@google-cloud/speech' );

const io = require( "socket.io" )( server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
} )

app.use( '/speech/', function ( req, res ) {
	speechFunction( function ( err, result ) {
		if ( err ) {
			console.log( 'Error retrieving transcription: ', err );
			res.status( 500 ).send( 'Error 500' );
			return;
		}
		res.send( result );
	} )
} );

function speechFunction() {
	const encoding = 'LINEAR16';
	const sampleRateHertz = 16000;
	const languageCode = 'en-US';
	const command_and_search = 'command_and_search';
	const keywords = ['turn on', 'turn off', 'turn it on', 'turn it off'];

	const request = {
		config: {
			encoding: encoding,
			sampleRateHertz: sampleRateHertz,
			languageCode: languageCode,
			model: command_and_search,
			speech_contexts: keywords
		},
		singleUtterance: true,
		interimResults: false // If you want interim results, set this to true
	};

	// Creates a client
	const client = new speech.SpeechClient();

	// Create a recognize stream
	const recognizeStream = client
		.streamingRecognize( request )
		.on( 'error', console.error )
		.on( 'data', data =>
			// process.stdout.write(
			console.log(
				data.results[0] && data.results[0].alternatives[0]
					? `Transcription: ${ data.results[0].alternatives[0].transcript }\n`
					: `\n\nReached transcription time limit, press Ctrl+C\n`
			)
		);

	// Start recording and send the microphone input to the Speech API
	recorder
		.record( {
			sampleRateHertz: sampleRateHertz,
			threshold: 0, //silence threshold
			recordProgram: 'rec', // Try also "arecord" or "sox"
			silence: '5.0', //seconds of silence before ending
			endOnSilence: true,
			thresholdEnd: 0.5
		} )
		.stream()
		.on( 'error', console.error )
		.pipe( recognizeStream );

	console.log( 'Listening, press Ctrl+C to stop.' );
	// [END micStreamRecognize]
}

io.on( "connection", ( socket ) => {
	socket.emit( "me", socket.id )

	socket.on( "disconnect", () => {
		socket.broadcast.emit( "callEnded" )
	} )

	socket.on( "callUser", ( data ) => {
		io.to( data.userToCall ).emit( "callUser", { signal: data.signalData, from: data.from, name: data.name } )
	} )

	socket.on( "answerCall", ( data ) => {
		io.to( data.to ).emit( "callAccepted", data.signal )
	} )

	socket.on( "addTranscriptMessage", ( data ) => {
		io.emit( "addTranscriptMessage", { speaker: data.speaker, position: data.position, message: data.message, time: data.time } )
	} )
} )

server.listen( 5000, () => console.log( "server is running on port 5000" ) )
