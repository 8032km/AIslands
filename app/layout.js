import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "AIslands — Where Humans and AI Build Together",
  description:
    "Create AI-powered projects, collaborate with custom AI personas, and manage everything locally — a beautiful pixel-art workspace for builders.",
  keywords: "AI, collaboration, pixel art, projects, agents, open source, local",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
