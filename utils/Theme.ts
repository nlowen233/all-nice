import { createTheme } from '@mui/material/styles'
import { Colors } from './Colors'

export const Theme = createTheme({
    palette: {
        primary: {
            main: Colors.dark,
        },
        secondary: {
            main: Colors.lightest,
        },
        error: {
            main: Colors.error
        }
    },
})
