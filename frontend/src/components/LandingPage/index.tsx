import { Grid, ListItem } from '@material-ui/core'
import * as React from 'react'
import HeaderPanel from '../HeaderPanel';
import { MainPanelTab } from '../MainPanelTab';
import { WebRtcVideoCall } from '../Webrtc';

export const LandingPage: React.FC = () => {
  return (
    <>
      <HeaderPanel />
      <ListItem>
        <Grid className="mainpanel-container" item lg={6}>
          <MainPanelTab />
        </Grid>
        <Grid className="mainpanel-container" item lg={6}>
          <WebRtcVideoCall />
        </Grid>
      </ListItem>
    </>
  )
}

