/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const framezMidnight = "#050E1A";
const framezNightfall = "#0B1423";
const framezSlate = "#1C2836";
const framezSky = "#59B2D9";
const framezAccent = "#F6A33D";

export const Colors = {
  tint: framezSky,
  accent: framezAccent,
  light: {
    text: "#F1F5F9",
    background: framezMidnight,
    surface: framezNightfall,
    elevated: framezSlate,
    tint: framezSky,
    icon: "#9CA3AF",
    tabIconDefault: "#64748B",
    tabIconSelected: framezSky,
  },
  dark: {
    text: "#F8FAFC",
    background: "#020817",
    surface: "#0F172A",
    elevated: "#1E293B",
    tint: framezSky,
    icon: "#CBD5F5",
    tabIconDefault: "#64748B",
    tabIconSelected: framezSky,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
