import { Container, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

export const GoogleSpeechTranslator: React.FC = () => {
    const [transcript, setTranscript] = useState<any>("")

    useEffect(() => {
        fetch('http://localhost:5000/speech/')
            .then(res => res.json())
            .then(
                (result) => setTranscript(result))
    }
    )

    return (
        <>
            <Container>
                <Typography>  {transcript} </Typography>
            </Container>
        </>
    );
}
