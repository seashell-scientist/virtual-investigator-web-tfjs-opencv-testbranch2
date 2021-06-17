import { Container, Grid, Typography } from '@material-ui/core'
import * as React from 'react'
import { TranscriptMessageProps } from '../../../../VideoCall';

export const TranscriptMessage: React.FC<TranscriptMessageProps> = (props) => {
    return (
        <>
            <Grid className="transcript-wrapper">
                <Grid className="info-text-wrapper">
                    <Grid className="info-line">
                        <p className="transcript-speaker">
                            {props.speaker} ({props.position})
                        </p>
                    </Grid>
                    <Grid>
                        <p className="transcript-time">
                            {props.time.toLocaleString()}
                        </p>
                    </Grid>
                </Grid>
                <p className="transcript-message">
                    {props.message}
                </p>
            </Grid>
        </>
    );
}

