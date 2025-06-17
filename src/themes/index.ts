// src/themes/index.ts
import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
// No direct font object imports needed here if using CSS variables defined in layout

// ----- Base Theme Options -----
const commonTypography = {
  // Set the DEFAULT font for the application (e.g., body text, most components)
  fontFamily: 'var(--font-inter)', // Default to Inter via CSS variable

  // Headings will use JetBrains Mono
  h1: { fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 700 },
  h2: { fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 700 },
  h3: { fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 500 },
  h4: { fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 500 },
  h5: { fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 }, // Regular weight
  h6: { fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 },

  // Button text can also use a specific font if desired
  button: {
    fontFamily: 'var(--font-jetbrains-mono)', // Example: buttons also use JetBrains Mono
    textTransform: 'none' as const,
    // fontWeight: 500, // Example
  },
};

const commonComponents = (mode: 'light' | 'dark') => ({
  MuiCssBaseline: {
    styleOverrides: (themeParam: Theme) => ({
      body: {
        fontFamily: themeParam.typography.fontFamily, // Uses the default from commonTypography
      },
      'code, pre, kbd, samp': {
        fontFamily: 'var(--font-jetbrains-mono)', // Code elements use JetBrains Mono
      }
    }),
  },
  MuiCard: {
      styleOverrides: {
          root: {
              border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          }
      }
  },
  MuiButton: {
      styleOverrides: {
          root: {
              fontFamily: '"JetBrains Mono", "Fira Code", monospace', // Redundant if commonTypography.button sets it
          }
      }
  },
  MuiInputBase: { styleOverrides: { input: { fontFamily: 'var(--font-jetbrains-mono)' } } }, // Form inputs
  MuiInputLabel: { styleOverrides: { root: { fontFamily: 'var(--font-jetbrains-mono)' } } }, // Form labels
  MuiChip: { // Style Chips to use Inter by default for their labels
    styleOverrides: {
      label: {
        fontFamily: 'var(--font-inter)',
      }
    }
  }
  // MuiTypography's defaultProps for fontFamily is not needed if variants are set
});


// ----- 1. Zenburn (Our Default Dark Theme) -----
export const zenburnThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#87ceeb' }, // Sky blue
    secondary: { main: '#f0e68c' }, // Khaki
    background: { default: '#3f3f3f', paper: '#4f4f4f' },
    text: { primary: '#dcdccc', secondary: '#9f9f9f' },
    error: { main: '#dca3a3' }, warning: { main: '#f0dfaf' },
    info: { main: '#7cb8bb' }, success: { main: '#a3dca3' },
    divider: 'rgba(220, 220, 204, 0.12)',
  },
  typography: commonTypography,
  components: {
    ...commonComponents('dark'),
    MuiAppBar: { styleOverrides: { colorDefault: { backgroundColor: '#333333' }}},
  }
};
export const zenburnTheme: Theme = createTheme(zenburnThemeOptions);


// ----- 2. Dracula (Dark Theme) -----
// Ref: https://draculatheme.com/contribute
export const draculaThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#bd93f9' },    // Purple
    secondary: { main: '#ff79c6' },  // Pink
    background: { default: '#282a36', paper: '#343746' }, // Dark Background, slightly lighter paper
    text: { primary: '#f8f8f2', secondary: '#bdc7d9' }, // White text, lighter grey secondary
    error: { main: '#ff5555' },      // Red
    warning: { main: '#f1fa8c' },    // Yellow
    info: { main: '#8be9fd' },       // Cyan
    success: { main: '#50fa7b' },    // Green
    divider: 'rgba(248, 248, 242, 0.1)',
  },
  typography: commonTypography,
  components: {
    ...commonComponents('dark'),
    MuiAppBar: { styleOverrides: { colorDefault: { backgroundColor: '#21222c' }}}, // Even darker app bar
  }
};
export const draculaTheme: Theme = createTheme(draculaThemeOptions);


// ----- 3. Gruvbox Dark (Dark Theme) -----
// Ref: https://github.com/morhetz/gruvbox
export const gruvboxDarkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#fabd2f' },    // Yellow
    secondary: { main: '#83a598' },  // Blue/Aqua
    background: { default: '#282828', paper: '#3c3836' },
    text: { primary: '#ebdbb2', secondary: '#a89984' }, // Beige text
    error: { main: '#fb4934' },      // Red
    warning: { main: '#fabd2f' },    // Yellow (same as primary)
    info: { main: '#83a598' },       // Blue/Aqua (same as secondary)
    success: { main: '#b8bb26' },    // Green
    divider: 'rgba(235, 219, 178, 0.1)',
  },
  typography: commonTypography,
  components: {
    ...commonComponents('dark'),
    MuiAppBar: { styleOverrides: { colorDefault: { backgroundColor: '#1d2021' }}},
  }
};
export const gruvboxDarkTheme: Theme = createTheme(gruvboxDarkThemeOptions);


// ----- 4. Nord (Dark Theme) -----
// Ref: https://www.nordtheme.com/docs/colors-and-palettes
export const nordThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#88c0d0' },    // Frost - Bluish
    secondary: { main: '#81a1c1' },  // Frost - Lighter Bluish
    background: { default: '#2e3440', paper: '#3b4252' }, // Polar Night
    text: { primary: '#d8dee9', secondary: '#e5e9f0' },   // Snow Storm
    error: { main: '#bf616a' },      // Aurora - Red
    warning: { main: '#ebcb8b' },    // Aurora - Yellow
    info: { main: '#8fbcbb' },       // Frost - Cyanish
    success: { main: '#a3be8c' },    // Aurora - Green
    divider: 'rgba(216, 222, 233, 0.1)',
  },
  typography: commonTypography,
  components: {
    ...commonComponents('dark'),
    MuiAppBar: { styleOverrides: { colorDefault: { backgroundColor: '#242933' }}},
  }
};
export const nordTheme: Theme = createTheme(nordThemeOptions);


// ----- 5. Catppuccin Latte (Light Theme) -----
// Ref: https://github.com/catppuccin/catppuccin
export const catppuccinLatteThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#1e66f5' },    // Blue
    secondary: { main: '#ea76cb' },  // Pink
    background: { default: '#eff1f5', paper: '#e6e9ef' }, // Base, Mantle
    text: { primary: '#4c4f69', secondary: '#5c5f77' },   // Text, Subtext0
    error: { main: '#d20f39' },      // Red
    warning: { main: '#fe640b' },    // Peach
    info: { main: '#04a5e5' },       // Sapphire
    success: { main: '#40a02b' },    // Green
    divider: 'rgba(76, 79, 105, 0.1)',
  },
  typography: commonTypography,
  components: {
    ...commonComponents('light'),
    MuiAppBar: { styleOverrides: { colorDefault: { backgroundColor: '#ccd0da' }}}, // Crust
  }
};
export const catppuccinLatteTheme: Theme = createTheme(catppuccinLatteThemeOptions);


// ----- 6. Solarized Light (Light Theme) -----
// Ref: http://ethanschoonover.com/solarized/
export const solarizedLightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: { main: '#268bd2' },    // Blue
        secondary: { main: '#6c71c4' },  // Violet
        background: { default: '#fdf6e3', paper: '#eee8d5' }, // base3, base2
        text: { primary: '#657b83', secondary: '#586e75' },   // base00, base01
        error: { main: '#dc322f' },      // Red
        warning: { main: '#b58900' },    // Yellow
        info: { main: '#2aa198' },       // Cyan
        success: { main: '#859900' },    // Green
        divider: 'rgba(101, 123, 131, 0.15)',
    },
    typography: commonTypography,
    components: {
        ...commonComponents('light'),
        MuiAppBar: { styleOverrides: { colorDefault: { backgroundColor: '#eee8d5' }}}, // base2
    }
};
export const solarizedLightTheme: Theme = createTheme(solarizedLightThemeOptions);


// ----- Collection of all themes -----
export const availableThemes: Record<string, Theme> = {
  zenburn: zenburnTheme,
  dracula: draculaTheme,
  gruvboxDark: gruvboxDarkTheme,
  nord: nordTheme,
  catppuccinLatte: catppuccinLatteTheme,
  solarizedLight: solarizedLightTheme,
};

export type ThemeKey = keyof typeof availableThemes;