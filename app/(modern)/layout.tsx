import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

export const metadata: Metadata = {
    title: "Death & Taxes Tracker",
    description: "Track your decisions and their impact in Death and Taxes",
    icons: {
        icon: "/img/logo.svg",
    },
};

export default function ModernLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Layout específico de la sección (modern):
    // aplica estilos globales y el GameProvider, pero deja <html>/<body> al layout raíz.
    return <GameProvider>{children}</GameProvider>;
}
