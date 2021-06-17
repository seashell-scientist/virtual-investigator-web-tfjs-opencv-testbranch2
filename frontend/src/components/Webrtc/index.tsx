import { Box, Container, Grid, Paper } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { io } from "socket.io-client";
import Peer from "simple-peer"
import CloseIcon from '@material-ui/icons/Close';
import setupTranscript, { addTranscriptMessage, sendData } from './setup-transcript';

import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import Stats from 'stats.js';
import {TRIANGULATION} from './triangulation';

const VIDEO_SIZE = 400;
const renderPointcloud = true;
const stats = new Stats();
const state:any = { //add any for the property type check
    backend: 'webgl',
    maxFaces: 1,
    triangulateMesh: true,
    predictIrises: true}

const socket = io('http://localhost:5000');

declare global {
    interface Window { webkitSpeechRecognition: any; }
}
export const WebRtcVideoCall: React.FC = () => {
    const [me, setMe] = useState("")
    const [stream, setStream] = useState<MediaStream>()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callerName, setCallerName] = useState("")
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const [position, setPosition] = useState("")
    const [isListening, setIsListening] = useState(true)
    const [isWindowFocused, setIsWindowFocused] = useState(true)
    const myVideo = useRef<any>()
    //const testVideo = useRef<any>()
    const userVideo = useRef<any>()
    const connectionRef = useRef<any>()

    
const NUM_KEYPOINTS = 468;
const NUM_IRIS_KEYPOINTS = 5;
const GREEN = '#32EEDB';
const RED = '#FF2C35';
const BLUE = '#157AB3';
let stopRendering = false;


    window.onfocus = () => setIsWindowFocused(true);
    window.onblur = () => setIsWindowFocused(false);

    useEffect(setupTranscript, []); 

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        setName(urlParams.get('name'));
        setPosition(urlParams.get('position'));
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })
        // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        //     setStream(stream)
        //     testVideo.current.srcObject = stream
        // })

        socket.on("me", (id) => {
            setMe(id)
        })

        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setCallerName(data.name)
            setCallerSignal(data.signal)
        })
    }, [])

    // const handleListen = () => {
    //     console.log('executing handleListen...')
    //     setIsListening(true);

    //     const windowSpeechRecognition =
    //         window.SpeechRecognition || (window as any).webkitSpeechRecognition || {};
    //     const mic: SpeechRecognition = new windowSpeechRecognition();

    //     console.log(mic);

    //     mic.continuous = true;
    //     mic.interimResults = false;
    //     mic.lang = 'en-US';

    //     mic.onstart = () => {
    //         console.log('Mics on');
    //     }

    //     mic.onerror = event => {
    //         console.log('mic error!', event.error);
    //     }

    //     mic.onresult = event => {
    //         console.log('received speech result!');

    //         var transcript = Array.from(event.results)[event.results.length - 1][0].transcript;

    //         console.log(transcript);

    //         addTranscriptMessage(name, position, transcript);
    //     }

    //     if (isListening && isWindowFocused /* checking isWindowFocused is a temporary hack to let us switch between tabs for mic input */) {
    //         console.log('starting speech recognition...........');
    //         mic.start();
    //         mic.onend = () => {
    //             console.log('continue..');
    //             //mic.start()
    //         }
    //     } else {
    //         console.log('stopping speech recognition...........');
    //         mic.stop();
    //         mic.onend = () => {
    //             console.log('Stopped Mic on Click');
    //         }
    //     }
    //     console.log('speech recognition:', mic);
    // }

    // useEffect(handleListen, [isListening, isWindowFocused, name, position]);

    const [isVideoCallOn, setisVideoCallOn] = useState(false);
    const callHandler = () => {
        setisVideoCallOn(true);
    }
    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name,
                position: position
            });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        });
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        });
        connectionRef.current = peer;
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
    }

    const keypressHandler = event => {
        if (event.key === "Enter") {
            event.target.blur();
            event.target.focus();
        }
    };

        if (renderPointcloud) {
            state.renderPointcloud = true;
        }
        
    let model, ctx, videoWidth, videoHeight, video, canvas,
        scatterGLHasInitialized = false, scatterGL, rafID;

    function distance(a, b) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }
    
    function drawPath(ctx, points, closePath) {
        const region = new Path2D();
        region.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point[0], point[1]);
        }
    
        if (closePath) {
        region.closePath();
        }
        ctx.stroke(region);
    }
    
    async function renderPrediction() { //js version
        if (stopRendering) {
        return;
        }
    
        stats.begin();
    
        const predictions = await model.estimateFaces({
        input: video,
        returnTensors: false,
        flipHorizontal: false,
        predictIrises: state.predictIrises
        });
        ctx.drawImage(
            video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height);
    
        if (predictions.length > 0) {
        predictions.forEach(prediction => {
            const keypoints = prediction.scaledMesh;
    
            if (state.triangulateMesh) {
            ctx.strokeStyle = GREEN;
            ctx.lineWidth = 0.5;
    
            for (let i = 0; i < TRIANGULATION.length / 3; i++) {
                const points = [
                    TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
                    TRIANGULATION[i * 3 + 2]
                ].map(index => keypoints[index]);
    
                drawPath(ctx, points, true);
            }
            } else {
            ctx.fillStyle = GREEN;
    
            for (let i = 0; i < NUM_KEYPOINTS; i++) {
                const x = keypoints[i][0];
                const y = keypoints[i][1];
    
                ctx.beginPath();
                ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
                ctx.fill();
            }
            }
    
            if (keypoints.length > NUM_KEYPOINTS) {
            ctx.strokeStyle = RED;
            ctx.lineWidth = 1;
    
            const leftCenter = keypoints[NUM_KEYPOINTS];
            const leftDiameterY = distance(
                keypoints[NUM_KEYPOINTS + 4], keypoints[NUM_KEYPOINTS + 2]);
            const leftDiameterX = distance(
                keypoints[NUM_KEYPOINTS + 3], keypoints[NUM_KEYPOINTS + 1]);
    
            ctx.beginPath();
            ctx.ellipse(
                leftCenter[0], leftCenter[1], leftDiameterX / 2, leftDiameterY / 2,
                    0, 0, 2 * Math.PI);
            ctx.stroke();
    
            if (keypoints.length > NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS) {
                const rightCenter = keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS];
                const rightDiameterY = distance(
                    keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 2],
                    keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 4]);
                const rightDiameterX = distance(
                    keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 3],
                    keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 1]);
    
                ctx.beginPath();
                ctx.ellipse(
                    rightCenter[0], rightCenter[1], rightDiameterX / 2,
                    rightDiameterY / 2, 0, 0, 2 * Math.PI);
                ctx.stroke();
            }
            }
        });
    
        if (renderPointcloud && state.renderPointcloud && scatterGL != null) {
            const pointsData = predictions.map(prediction => {
            let scaledMesh = prediction.scaledMesh;
            return scaledMesh.map(point => ([-point[0], -point[1], -point[2]]));
            });
    
            let flattenedPointsData = [];
            for (let i = 0; i < pointsData.length; i++) {
            flattenedPointsData = flattenedPointsData.concat(pointsData[i]);
            }
            const dataset = new scatterGL.Dataset(flattenedPointsData);
    
            if (!scatterGLHasInitialized) {
            scatterGL.setPointColorer((i) => {
                if (i % (NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS * 2) > NUM_KEYPOINTS) {
                return RED;
                }
                return BLUE;
            });
            scatterGL.render(dataset);
            } else {
            scatterGL.updateDataset(dataset);
            }
            scatterGLHasInitialized = true;
        }
        }
    
        stats.end();
        rafID = requestAnimationFrame(renderPrediction);
    };

    async function setupCamera() {
        video = document.getElementById('video');
    
        const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            //facingMode: 'user',
            // Only setting the video to a specified size in order to accommodate a
            // point cloud, so on mobile devices accept the default size.
            width: VIDEO_SIZE,
            height: VIDEO_SIZE
        },});
        video.srcObject = stream;

        return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
        });
    }

        
        async function main() {//move to top level of module? 
            await tf.setBackend(state.backend);
            stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
            document.getElementById('main').appendChild(stats.dom);
        
            await setupCamera(); //set this the existing camera input?
            
            //hmm so this will run for a few seconds than crash
            //, requires some sort of wait for loaded video data? 

            // video.onloadeddata = function() {//don't play video till data is loaded? this only pauses for a single frame
            //     //alert("Browser has loaded the current frame");
            //     // setTimeout(()=>{video.play();}, 2000); //pause 2k ms //nope
            //     //video.play();
            // }; 

            video.play(); 
            videoWidth = video.videoWidth;
            videoHeight = video.videoHeight;
            video.width = videoWidth;
            video.height = videoHeight;
        
            canvas = document.getElementById('output');
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            const canvasContainer = document.querySelector('.canvas-wrapper');
            //canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;
        
            ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.fillStyle = GREEN;
            ctx.strokeStyle = GREEN;
            ctx.lineWidth = 0.5;
        
            model = await faceLandmarksDetection.load(
                faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
                {maxFaces: state.maxFaces});
            renderPrediction();
        
            // if (renderPointcloud) { //renders the size of the scatter gl container that holds pointcloud
            // document.querySelector('#scatter-gl-container').style =
            //     `width: ${VIDEO_SIZE}px; height: ${VIDEO_SIZE}px;`;
        
            // scatterGL = new scatterGL(
            //     document.querySelector('#scatter-gl-container'),
            //     {'rotateOnStart': false, 'selectEnabled': false});
            // }
        };

        main();

    return (
        <Paper elevation={4} className="mainpanel-container">
            <script src="https://cdn.jsdelivr.net/npm/three@0.106.2/build/three.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/scatter-gl@0.0.1/lib/scatter-gl.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js"></script>
            <script src="index.js"></script>
            <Container >
                <CopyToClipboard text={me} >
                    <Button variant="text" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
                        Copy ID
					</Button>
                </CopyToClipboard>

                <Grid >
                    {stream && <video id='video'playsInline muted ref={myVideo} autoPlay />}
                </Grid>
                <Grid id='main'>
                    <canvas id='output'>canvas location here </canvas>
                    
                </Grid>
                {/* <Grid>{stream && <video id='video' playsInline muted ref={testVideo} autoPlay />}</Grid> */}
                <Grid >
                    {callAccepted && !callEnded ?
                        <video playsInline ref={userVideo} autoPlay /> :
                        null}
                </Grid>
                <Grid >
                    <TextField
                        label="Name"
                        variant="filled"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid >
                    <TextField
                        label="Position"
                        variant="filled"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </Grid>
                <Grid>
                    <TextField
                        id="filled-basic"
                        label="ID to call"
                        variant="filled"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                    />
                </Grid>

                <Grid className="call-button">
                    {callAccepted && !callEnded ? (
                        <IconButton color="secondary" aria-label="call" onClick={leaveCall}>
                            <Button variant="contained" color="secondary" onClick={callHandler} startIcon={<CloseIcon />}>
                                End Video call
                            </Button>
                        </IconButton>

                    ) : (
                            <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                                <Button variant="contained" color="primary" onClick={callHandler} startIcon={<PhoneIcon />}>
                                    Start Video call
                            </Button>
                            </IconButton>
                        )}
                    {idToCall}
                </Grid>

                {receivingCall && !callAccepted ? (
                    <Grid >
                        <h1 >{callerName} is calling...</h1>
                        <Button variant="contained" color="primary" onClick={answerCall}>
                            Answer
						</Button>
                    </Grid>
                ) : null}

                <Box m={1}>
                    <TextField
                        id="transcriptSend"
                        label="Add message to Transcript"
                        rowsMax={4}
                        placeholder="Enter a message"
                        variant="outlined"
                        fullWidth={true}
                        onBlur={(e) => { sendData(name, position, e.target) }}
                        onKeyPress={event => keypressHandler(event)}
                    />
                </Box>
            </Container>
        </Paper>
    )
}
