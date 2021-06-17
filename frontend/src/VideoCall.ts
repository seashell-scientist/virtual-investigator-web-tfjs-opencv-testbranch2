import { Subject } from "rxjs";

export interface TranscriptMessageProps {
    speaker: string;
    position: string;
    message: string;
    time: Date;
}

export interface VideoCallState {
    TranscriptMessages: TranscriptMessageProps[];
}

export class VideoCall {
    public state: VideoCallState; // TODO: Make private and add a get accessor?
    private subject: Subject<VideoCallState>;

    constructor() {
        this.state = {
            TranscriptMessages: [{ speaker: 'ChatBot', position: 'Bot', message: 'Call Started', time: new Date() }]
        };
        this.subject = new Subject<VideoCallState>();
        this.subject.next(this.state);
    }

    public subscribe(setState: (value: VideoCallState) => void) {
        this.subject.subscribe(setState);
    }

    public addMessage(message: TranscriptMessageProps) {
        this.state = {
            ...this.state,
            TranscriptMessages: [...this.state.TranscriptMessages, message]
        };

        this.subject.next(this.state);
    }
}

let videoCall = new VideoCall();
export default videoCall;
