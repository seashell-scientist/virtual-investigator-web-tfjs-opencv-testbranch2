import { Box, Container, Typography } from '@material-ui/core'
import * as React from 'react'

type TabSectionProps = {
    children: any,
    index: any,
    value: any,
};

export const TabSection: React.FC<TabSectionProps> = (props) => {

    const { children, value, index, ...rest } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...rest}
        >
            {value === index && (
                <Box p={6}>
                    <Container>
                        <Typography>{children}</Typography>
                    </Container>
                </Box>
            )}
        </div>
    );
}

