"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import * as store from "@/lib/localStore";
import Navbar from "@/components/Navbar";
import WaterCanvas from "@/components/WaterCanvas";
import PixelClouds from "@/components/PixelClouds";
import {
    HubIsland,
    ProjectsIsland,
    CollabIsland,
    FeedIsland,
    AgentsIsland,
} from "@/components/PixelSprites";

const SPRITES = [
    (w) => <HubIsland width={w} />,
    (w) => <ProjectsIsland width={w} />,
    (w) => <CollabIsland width={w} />,
    (w) => <FeedIsland width={w} />,
    (w) => <AgentsIsland width={w} />,
];

function hash(s) {
    if (!s) return 0;
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
}

const AVATARS = ["🧙", "🧑‍🚀", "🧜‍♀️", "🥷", "🕵️", "🧑‍🔬", "🤖", "🧝"];

export default function FeedPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [islands, setIslands] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    // Selected island modal state
    const [selectedIsland, setSelectedIsland] = useState(null);
    const [islandAiProfiles, setIslandAiProfiles] = useState([]);

    // Load user's own local projects as floating islands
    useEffect(() => {
        const projects = store.getProjects();
        const LANE_COUNT = 3;
        const mapped = projects.map((project, i) => ({
            ...project,
            lane: i % LANE_COUNT,
            speed: 22 + (hash(project.id) % 12),
            delay: Math.floor(i / LANE_COUNT) * 6 + (hash(project.id) % 3),
            avatar: AVATARS[hash(project.id) % AVATARS.length],
        }));
        setIslands(mapped);
        setLoading(false);
    }, []);

    // Handle island click — show project details + AI profiles
    const handleIslandClick = (island) => {
        setSelectedIsland(island);
        const profiles = store.getAiProfiles(island.id);
        setIslandAiProfiles(profiles);
    };

    return (
        <>
            <Navbar />
            <div className="dash-world feed-world" ref={containerRef}>
                <WaterCanvas />
                <PixelClouds />

                <div className="dash-world-header feed-header">
                    <div>
                        <h1 className="dash-world-title">Your Archipelago</h1>
                        <p className="dash-world-subtitle">Watch your islands drift across the ocean</p>
                    </div>
                </div>

                {loading ? (
                    <div className="dash-ocean-loading">
                        <p className="pixel-text">{t("explore.loading")}</p>
                    </div>
                ) : islands.length === 0 ? (
                    <div className="dash-ocean-empty">
                        <div className="dash-ocean-empty-icon">🌊</div>
                        <h2>No islands yet</h2>
                        <p style={{ marginTop: "12px", opacity: 0.8 }}>Head to the Dashboard to create your first island!</p>
                        <button
                            className="pixel-btn pixel-btn-accent"
                            style={{ marginTop: "16px" }}
                            onClick={() => router.push("/dashboard")}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="feed-ocean-container">
                        {islands.map((island) => (
                            <div
                                key={island.id}
                                className={`feed-island-float feed-lane-${island.lane}`}
                                style={{
                                    animationDuration: `${island.speed}s`,
                                    animationDelay: `${island.delay}s`,
                                }}
                                onClick={() => handleIslandClick(island)}
                            >
                                <div className="feed-island-sprite">
                                    {SPRITES[hash(island.id) % SPRITES.length](100)}
                                </div>
                                <div className="feed-island-tooltip">
                                    <div className="feed-tooltip-header">
                                        <span className="feed-avatar">{island.avatar}</span>
                                        <span className="feed-username">{island.title}</span>
                                    </div>
                                    <div className="feed-project">{island.description?.slice(0, 50) || "No description"}{island.description?.length > 50 ? "..." : ""}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Island Detail Modal */}
            {selectedIsland && (
                <div className="modal-overlay" onClick={() => setSelectedIsland(null)}>
                    <div className="feed-modal pixel-border" onClick={(e) => e.stopPropagation()}>
                        <button className="feed-modal-close" onClick={() => setSelectedIsland(null)}>X</button>

                        <div className="feed-modal-island-name">{selectedIsland.title}</div>

                        {selectedIsland.description && (
                            <p className="feed-modal-desc">{selectedIsland.description}</p>
                        )}

                        {/* AI Profiles */}
                        <div className="feed-modal-section-title">{t("feed.aiResidents")}</div>
                        {islandAiProfiles.length === 0 ? (
                            <p className="feed-modal-empty">{t("feed.noAgents")}</p>
                        ) : (
                            <div className="feed-modal-agents">
                                {islandAiProfiles.map((p) => (
                                    <div key={p.id} className="feed-modal-agent">
                                        <div className="feed-modal-agent-name">{p.name}</div>
                                        {p.description && (
                                            <div className="feed-modal-agent-desc">{p.description}</div>
                                        )}
                                        <div className="feed-modal-agent-model">{p.model || "gpt-4o-mini"}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="pixel-btn pixel-btn-primary"
                            style={{ marginTop: "16px", width: "100%" }}
                            onClick={() => { setSelectedIsland(null); router.push(`/project/${selectedIsland.id}`); }}
                        >
                            Go to Island →
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
