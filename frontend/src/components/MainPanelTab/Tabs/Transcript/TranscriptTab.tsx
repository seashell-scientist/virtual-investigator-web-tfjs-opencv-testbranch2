import { Container } from '@material-ui/core'
import * as React from 'react'
import { TranscriptMessage } from './TranscriptMessage'
import './Transcript.css'
import { useLayoutEffect, useState } from 'react'
import videoCall, { VideoCallState } from '../../../../VideoCall'

export const TranscriptTab: React.FC = () => {
    const [videoCallState, setVideoCallState] = useState<VideoCallState>(videoCall.state);

    useLayoutEffect(() => {
        videoCall.subscribe(setVideoCallState);
    });

    return (
        <>
            <Container>
                {videoCallState.TranscriptMessages.map((m, i) => (
                    <TranscriptMessage {...m} key={i} />
                ))}
            </Container>
        </>
    );
}

