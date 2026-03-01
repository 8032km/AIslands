"use client";
import { useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import {
    HubIsland,
    ProjectsIsland,
    CollabIsland,
    FeedIsland,
    AgentsIsland,
} from "./PixelSprites";

/* Pick a deterministic island sprite based on project ID */
const ISLAND_SPRITES = [
    (w) => <HubIsland width={w} />,
    (w) => <ProjectsIsland width={w} />,
    (w) => <CollabIsland width={w} />,
    (w) => <FeedIsland width={w} />,
    (w) => <AgentsIsland width={w} />,
];

function hashId(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(h);
}

export default function ProjectCard({ project, onDelete, onOpen }) {
    const { t } = useTranslation();

    const spriteIndex = useMemo(
        () => hashId(project.id) % ISLAND_SPRITES.length,
        [project.id]
    );

    const statusColors = {
        active: "#6BBF7A",
        archived: "#B0B0B8",
    };

    const formattedDate = new Date(project.created_at).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
    );

    return (
        <div className="project-card pixel-border" onClick={() => onOpen(project.id)}>
            {/* Island banner */}
            <div className="project-card-island">
                {ISLAND_SPRITES[spriteIndex](120)}
            </div>

            <div className="project-card-body">
                <div className="project-card-header">
                    <span
                        className="project-status"
                        style={{ backgroundColor: statusColors[project.status] || "#B0B0B8" }}
                    />
                    <span className="project-date">{formattedDate}</span>
                </div>

                <h3 className="project-card-title">{project.title}</h3>

                {project.description && (
                    <p className="project-card-desc">{project.description}</p>
                )}

                <div className="project-card-actions">
                    <button
                        className="pixel-btn pixel-btn-sm pixel-btn-primary"
                        onClick={(e) => { e.stopPropagation(); onOpen(project.id); }}
                    >
                        {t("projectCard.open")}
                    </button>
                    <button
                        className="pixel-btn pixel-btn-sm pixel-btn-danger"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        {t("projectCard.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
}
