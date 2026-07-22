import { Cinzel, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-cinzel",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-jetbrains-mono",
  display: "swap",
});
