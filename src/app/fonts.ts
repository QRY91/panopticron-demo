// src/app/fonts.ts
import { Inter, JetBrains_Mono } from 'next/font/google';

// Google Font: Inter (for general UI if needed, or can be your main body font)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Google Font: JetBrains Mono (for headers, code, etc.)
export const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});
