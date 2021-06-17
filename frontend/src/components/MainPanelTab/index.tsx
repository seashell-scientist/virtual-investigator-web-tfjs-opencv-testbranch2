import { AppBar, Box, Paper, Tab, Tabs } from '@material-ui/core'
import * as React from 'react'
import { NotesTab } from './Tabs/NotesTab';
import { TranscriptTab } from './Tabs/Transcript/TranscriptTab';
import { TabSection } from './TabSection';
import EventNoteIcon from '@material-ui/icons/EventNote';
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined';
import { ProfileTab } from './Tabs/ProfileTab';

export const MainPanelTab: React.FC = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (_event: any, newValue: any) => {
        setValue(newValue);
    };

    const a11yProps = (index: number) => {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-TabSection-${index}`,
        };
    }

    return (
        <Paper elevation={4} className="mainpanel-container">
            <Box>
                <AppBar position="static" color="transparent">
                    <Tabs
                        centered
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        scrollButtons="desktop"
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab color="primary" icon={<TextsmsOutlinedIcon />} label="Transcript" {...a11yProps(0)} />
                        <Tab icon={<EventNoteIcon />} label="Notes" {...a11yProps(1)} />
                        <Tab icon={<EventNoteIcon />} label="Profile" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabSection value={value} index={0}>
                    <TranscriptTab />

                </TabSection>
                <TabSection value={value} index={1}>
                    <NotesTab />
                </TabSection>
                <TabSection value={value} index={2}>
                    <ProfileTab />
                </TabSection>
            </Box >
        </Paper >

    )
}

