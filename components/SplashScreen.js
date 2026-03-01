"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/useTranslation";

export default function SplashScreen() {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        // Fast splash — local app loads instantly, just a quick branding flash
        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setHidden(true), 150);
                    return 100;
                }
                return p + Math.random() * 40 + 30;
            });
        }, 60);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`splash-overlay ${hidden ? "hidden" : ""}`}>
            <div className="splash-particles">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="splash-particle" style={{ left: `${10 + i * 12}%` }} />
                ))}
            </div>
            <div className="splash-title">AIslands</div>
            <div className="splash-bar-track">
                <div
                    className="splash-bar-fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
            <div className="splash-loading-text">{t("splash.loading")}</div>
        </div>
    );
}
