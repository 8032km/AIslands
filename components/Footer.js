"use client";
import { useTranslation } from "@/i18n/useTranslation";

export default function Footer() {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <div className="footer-logo">AIslands</div>
                    <p className="footer-tagline">{t("footer.tagline")}</p>
                    <p className="footer-email">
                        <a href="mailto:sundrikvlad@gmail.com">sundrikvlad@gmail.com</a>
                    </p>
                </div>

                <div className="footer-col">
                    <h4>{t("footer.product")}</h4>
                    <a href="#features">{t("footer.features")}</a>
                    <a href="#">{t("footer.docs")}</a>
                </div>

                <div className="footer-col">
                    <h4>{t("footer.company")}</h4>
                    <a href="#">{t("footer.about")}</a>
                    <a href="https://ai-land.vercel.app" target="_blank" rel="noopener noreferrer">Live Version</a>
                </div>

                <div className="footer-col">
                    <h4>Open Source</h4>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="#">MIT License</a>
                </div>
            </div>

            <div className="footer-bottom">
                © {year} AIslands. {t("footer.rights")} · Open Source · MIT License
            </div>
        </footer>
    );
}
