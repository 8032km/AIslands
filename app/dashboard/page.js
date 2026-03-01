"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import * as store from "@/lib/localStore";
import Navbar from "@/components/Navbar";
import WaterCanvas from "@/components/WaterCanvas";
import PixelClouds from "@/components/PixelClouds";
import Island from "@/components/Island";
import CreateProjectModal from "@/components/CreateProjectModal";
import ConfirmModal from "@/components/ConfirmModal";
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
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
}

const POSITIONS = [
    { x: "25%", y: "30%" },
    { x: "70%", y: "25%" },
    { x: "18%", y: "65%" },
    { x: "75%", y: "60%" },
    { x: "50%", y: "48%" },
    { x: "40%", y: "20%" },
    { x: "60%", y: "72%" },
    { x: "35%", y: "55%" },
    { x: "82%", y: "42%" },
    { x: "15%", y: "42%" },
    { x: "55%", y: "30%" },
    { x: "30%", y: "78%" },
];

export default function DashboardPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // AI Generation State
    const [aiPrompt, setAiPrompt] = useState("");
    const [generating, setGenerating] = useState(false);
    const [userApiKey, setUserApiKey] = useState(null);

    const loadProjects = () => {
        setLoadingProjects(true);
        const allProjects = store.getProjects();
        setProjects(allProjects);
        const allKeys = store.getApiKeys();
        if (allKeys.length > 0) setUserApiKey(allKeys[0]);
        setLoadingProjects(false);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreateProject = (title, description) => {
        store.createProject({ title, description });
        setShowCreateModal(false);
        loadProjects();
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt.trim() || !userApiKey) return;
        setGenerating(true);

        try {
            const res = await fetch("/api/ai-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider: userApiKey.provider,
                    prompt: aiPrompt,
                    apiKeyRaw: userApiKey.api_key,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("AI Generation error:", err);
                alert("Failed to build island. Check console.");
                setGenerating(false);
                return;
            }

            const { project: projectData } = await res.json();
            // Save to localStorage and navigate to new project
            const newProject = store.createProject({
                title: projectData.title,
                description: projectData.description,
                tasks: projectData.tasks,
                notes: projectData.notes,
            });
            router.push(`/project/${newProject.id}`);
        } catch (err) {
            console.error(err);
            setGenerating(false);
        }
    };

    const triggerDeleteProject = (project) => {
        setProjectToDelete(project);
    };

    const confirmDeleteProject = () => {
        if (!projectToDelete) return;
        store.deleteProject(projectToDelete.id);
        setProjectToDelete(null);
        loadProjects();
    };

    return (
        <>
            <Navbar />

            <div className="dash-world">
                <WaterCanvas />
                <PixelClouds />

                <div className="dash-world-header">
                    <div>
                        <h1 className="dash-world-title">
                            {t("dashboard.welcome")} Explorer
                        </h1>
                        <p className="dash-world-subtitle">{t("dashboard.subtitle")}</p>
                    </div>

                    <div className="dash-ai-builder" style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                        {projects.length >= 6 ? (
                            <div style={{ color: "#d9534f", fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "8px 16px", borderRadius: "8px", border: "2px solid #d9534f" }}>
                                {t("dashboard.islandLimitReached") || "Maximum island limit (6) reached. Delete an existing island to create more."}
                            </div>
                        ) : (
                            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "800px" }}>
                                <input
                                    type="text"
                                    className="pixel-input"
                                    placeholder={t("aiBuilder.placeholder")}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    disabled={generating || !userApiKey}
                                    autoComplete="off"
                                    style={{ flex: 1 }}
                                />
                                {!userApiKey ? (
                                    <button className="pixel-btn pixel-btn-ai disabled" onClick={() => router.push("/settings")}>
                                        {t("aiBuilder.noKey")}
                                    </button>
                                ) : (
                                    <button
                                        className="pixel-btn pixel-btn-ai"
                                        onClick={handleAIGenerate}
                                        disabled={generating || !aiPrompt.trim()}
                                    >
                                        {generating ? <span className="ai-thinking">{t("aiBuilder.building")}</span> : `🪄 ${t("aiBuilder.button")}`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="dash-ocean-map">
                    {loadingProjects ? (
                        <div className="dash-ocean-loading">
                            <p className="pixel-text">{t("dashboard.loadingIslands")}</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="dash-ocean-empty">
                            <div className="dash-ocean-empty-icon">🏝️</div>
                            <h2>{t("dashboard.emptyTitle")}</h2>
                            <p>{t("dashboard.emptyDesc")}</p>
                            <button
                                className="pixel-btn pixel-btn-accent"
                                onClick={() => setShowCreateModal(true)}
                            >
                                {t("dashboard.createFirst")}
                            </button>
                        </div>
                    ) : (
                        projects.map((project, i) => {
                            const pos = POSITIONS[i % POSITIONS.length];
                            const spriteIdx = hash(project.id) % SPRITES.length;
                            const size = 120 + (hash(project.id + "s") % 40);
                            return (
                                <Island
                                    key={project.id}
                                    sprite={SPRITES[spriteIdx](size)}
                                    label={project.title}
                                    position={pos}
                                    onClick={() => router.push(`/project/${project.id}`)}
                                    onDelete={() => triggerDeleteProject(project)}
                                />
                            );
                        })
                    )}
                </div>

                <button
                    className={`pixel-btn ${projects.length >= 6 ? 'disabled' : 'pixel-btn-primary'}`}
                    onClick={() => {
                        if (projects.length < 6) setShowCreateModal(true);
                    }}
                    disabled={projects.length >= 6}
                    title={projects.length >= 6 ? "Maximum island limit (6) reached." : "Create Island"}
                    style={{
                        position: "fixed",
                        bottom: "40px",
                        right: "40px",
                        zIndex: 1000,
                        padding: "16px 24px",
                        fontSize: "1.1rem",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.6)",
                        opacity: projects.length >= 6 ? 0.5 : 1,
                        cursor: projects.length >= 6 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        borderRadius: "8px"
                    }}
                >
                    <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>+</span>
                    Create Island
                </button>
            </div>

            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateProject}
                />
            )}

            <ConfirmModal
                isOpen={!!projectToDelete}
                title={t("dashboard.deleteIslandTitle") || "Delete Island"}
                message={`${t("dashboard.deleteConfirm") || "Are you sure you want to permanently destroy this island and all associated data?"} (${projectToDelete?.title})`}
                onConfirm={confirmDeleteProject}
                onCancel={() => setProjectToDelete(null)}
            />
        </>
    );
}
