"use client";
import { useTranslation } from "@/i18n/useTranslation";
import WaterCanvas from "./WaterCanvas";
import Island from "./Island";
import PixelClouds from "./PixelClouds";
import {
    HubIsland,
    ProjectsIsland,
    CollabIsland,
    FeedIsland,
    AgentsIsland,
    PricingIsland,
    PixelPalm,
} from "./PixelSprites";

export default function IslandMap() {
    const { t } = useTranslation();

    const scrollTo = (id) => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="island-world">
            {/* Full-bleed ocean background */}
            <WaterCanvas />

            {/* Clouds & birds drifting across the sky */}
            <PixelClouds />

            {/* Hero text overlay */}
            <div className="hero-text">
                <h1 className="hero-title">{t("hero.title")}</h1>
                <p className="hero-subtitle">{t("hero.subtitle")}</p>
                <p className="hero-desc">{t("hero.description")}</p>
                <button
                    className="pixel-btn pixel-btn-primary"
                    onClick={() =>
                        document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })
                    }
                >
                    {t("hero.cta")}
                </button>
                <p className="hero-scroll-hint">{t("hero.scrollHint")}</p>
            </div>

            {/* Island archipelago */}
            <div className="island-map">
                {/* Decorative pixel palm trees */}
                <span className="palm-deco" style={{ left: "18%", top: "5%" }}>
                    <PixelPalm width={28} />
                </span>
                <span className="palm-deco" style={{ left: "68%", top: "3%", animationDelay: "1s" }}>
                    <PixelPalm width={24} />
                </span>
                <span className="palm-deco" style={{ left: "88%", top: "50%", animationDelay: "1.5s" }}>
                    <PixelPalm width={26} />
                </span>

                {/* ── Central Hub Island ── */}
                <Island
                    sprite={<HubIsland width={220} />}
                    label="AIslands"
                    position={{ x: "50%", y: "40%" }}
                    isHub
                    onClick={() => scrollTo("#features")}
                />

                {/* ── Feature Islands ── */}
                <Island
                    sprite={<ProjectsIsland width={140} />}
                    label={t("islands.projects.name")}
                    position={{ x: "20%", y: "20%" }}
                    onClick={() => scrollTo("#features")}
                />

                <Island
                    sprite={<CollabIsland width={155} />}
                    label={t("islands.collaborate.name")}
                    position={{ x: "80%", y: "18%" }}
                    onClick={() => scrollTo("#features")}
                />

                <Island
                    sprite={<FeedIsland width={140} />}
                    label={t("islands.feed.name")}
                    position={{ x: "18%", y: "68%" }}
                    onClick={() => scrollTo("#features")}
                />

                <Island
                    sprite={<AgentsIsland width={140} />}
                    label={t("islands.agents.name")}
                    position={{ x: "82%", y: "65%" }}
                    onClick={() => scrollTo("#how")}
                />



            </div>

            {/* Gradient fade from ocean → cream background */}
            <div className="hero-ocean-fade" />
        </div>
    );
}
