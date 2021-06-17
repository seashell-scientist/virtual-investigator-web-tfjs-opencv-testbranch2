

import { Container, Paper } from '@material-ui/core'
import * as React from 'react'

import './App.css'
import { LandingPage } from './components/LandingPage';
/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />

export const App = () => {
	return (
		<>
			<Paper className="main-page">
				<Container>
					<LandingPage />
				</Container>
			</Paper>
		</>
	);
}



