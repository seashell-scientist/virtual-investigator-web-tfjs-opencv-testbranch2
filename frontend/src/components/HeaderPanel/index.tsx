import { Container, Grid, InputAdornment, ListItem, TextField } from '@material-ui/core'
import * as React from 'react'
import SearchIcon from "@material-ui/icons/Search";

const HeaderPanel: React.FC = () => {

    return (
        <>
            <Grid item>
                <Container>
                    <ListItem>
                        <Grid item xs={6}>
                            <img src="https://uploads-ssl.webflow.com/5ed7b3b66935d248e09d48e1/5edf7d8e833aaf9e4b341ea9_zeal_color.svg" />

                        </Grid>
                        {/* <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                InputProps={
                                    {
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment
                                                className="search-icon"
                                                position="start"
                                                style={{}}
                                            >
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }
                                }
                                size="small"
                                fullWidth
                            />

                        </Grid> */}



                    </ListItem>
                </Container>
            </Grid>
        </>
    )
}

export default HeaderPanel;
;
