"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";

export default function Navbar() {
    const { t } = useTranslation();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useCallback((path) => {
        setMenuOpen(false);
        router.push(path);
    }, [router]);

    return (
        <div onMouseLeave={() => setMenuOpen(false)}>
            <nav className="navbar">
                <button
                    className="navbar-logo-btn"
                    onClick={() => setMenuOpen((o) => !o)}
                    onMouseEnter={() => setMenuOpen(true)}
                    aria-label="Open navigation"
                >
                    AIslands
                    <span className={`logo-chevron ${menuOpen ? "open" : ""}`}>▾</span>
                </button>

                <div className="nav-right" />
            </nav>

            <div className={`nav-mega-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}>
                <div className="nav-mega-menu" onClick={(e) => e.stopPropagation()}>
                    <button className="nav-mega-item" style={{ animationDelay: "0.05s" }} onClick={() => navigate("/#features")}>
                        <span className="nav-mega-icon">🏝️</span>
                        <span className="nav-mega-label">{t("nav.features")}</span>
                    </button>

                    <div className="nav-mega-divider" style={{ animationDelay: "0.15s" }} />

                    <button className="nav-mega-item" style={{ animationDelay: "0.2s" }} onClick={() => navigate("/dashboard")}>
                        <span className="nav-mega-icon">🗺️</span>
                        <span className="nav-mega-label">{t("nav.dashboard")}</span>
                    </button>
                    <button className="nav-mega-item" style={{ animationDelay: "0.25s" }} onClick={() => navigate("/feed")}>
                        <span className="nav-mega-icon">🌊</span>
                        <span className="nav-mega-label">{t("feed.navLink")}</span>
                    </button>
                    <button className="nav-mega-item" style={{ animationDelay: "0.35s" }} onClick={() => navigate("/settings")}>
                        <span className="nav-mega-icon">⚙️</span>
                        <span className="nav-mega-label">{t("settings.navLink")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
