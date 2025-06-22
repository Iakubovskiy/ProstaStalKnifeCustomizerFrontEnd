import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Layout from "@/app/components/Layout/Layout";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // Використовуємо той самий i18n

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <I18nextProvider i18n={i18n}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </I18nextProvider>
        </div>
    );
}