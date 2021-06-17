import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    Grid,
    makeStyles,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightBold,
        color: '#444',
    },
}));

export const NotesTab: React.FC = () => {
    const classes = useStyles();

    const saveNote = () => {
        //save notes
    };

    const headTitles = [
        'Case Notes',
        'Questions',
        'Requests',
        'Theories',
        'Suspicions',
        'Strategies',
    ];

    return (
        <>
            <Container>
                <Box color="text.primary" clone>
                    <Grid className={classes.root}>
                        {headTitles && headTitles.map((title: string) => (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.heading}>{title}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="caption">
                                        {title} SHOULD GO HERE
                  </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Box>
                <Grid>
                    {/* <Textarea placeholder="Add new notes" /> */}
                </Grid>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => saveNote()}
                >
                    Save
        </Button>
            </Container>
        </>
    );
};
