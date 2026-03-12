import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "WoW Raid Tools",
		template: "%s | WoW Raid Tools",
	},
	description: "Raid core analyzer for World of Warcraft",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
