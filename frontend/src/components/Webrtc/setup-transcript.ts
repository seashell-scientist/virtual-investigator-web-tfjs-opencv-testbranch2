import { io } from 'socket.io-client';
import videoCall from '../../VideoCall';
const socket = io('http://localhost:5000');

export default function setupTranscript() {
    console.log('setting up text stream...');

    socket.on('addTranscriptMessage', data => {
        console.log('receiving addTranscriptMessage event...');
        videoCall.addMessage({
            speaker: data.speaker,
            position: data.position,
            message: data.message,
            time: new Date()
        })
    });
}

export function sendData(speaker: string, position: string, textarea: EventTarget & (HTMLInputElement | HTMLTextAreaElement)) {
    if (!textarea.value) {
        return;
    }

    addTranscriptMessage(speaker, position, textarea.value);

    textarea.value = '';
}


export function addTranscriptMessage(speaker: string, position: string, message: string) {
    var data = {
        speaker: speaker,
        position: position,
        message: message,
        time: new Date()
    };

    console.log('emitting new transcript message...');

    socket.emit('addTranscriptMessage', data);

    console.log(`Sent Data: ${data}`);
}
