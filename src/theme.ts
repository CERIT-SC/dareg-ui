import { createTheme, ThemeOptions } from '@mui/material/styles'
import { Palette, PaletteOptions } from '@mui/material/styles/createPalette'

declare module '@mui/material/styles' {
    interface Palette {
        superGreen: {
            bg: string
            border: string
        }
    }
    interface PaletteOptions {
        superGreen?: {
            bg?: string
            border?: string
        }
    }
}

const lightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {main: "#2b8600"},
        secondary: {main: "#54604d"},
        superGreen: {
            bg: '#dcf1d2',
            border: '#9ed060',
        }
    }
}
  
const darkThemeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {main: "#2b8600"},
        secondary: {main: "#54604d"},
        superGreen: {
            bg: '#1A3600',
            border: '#4F7E13',
        }
    }
}
  
export const lightTheme = createTheme(lightThemeOptions)
export const darkTheme = createTheme(darkThemeOptions)
