"use client";

export default function Island({ sprite, label, position, isHub, onClick, onDelete }) {
    return (
        <div
            className={`island ${isHub ? "island-hub" : ""}`}
            style={{
                left: position.x,
                top: position.y,
                transform: "translate(-50%, -50%)",
            }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick?.()}
        >
            {onDelete && (
                <button
                    className="island-delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    title="Delete Island"
                >
                    ✖
                </button>
            )}
            <div className="island-sprite">
                {sprite}
            </div>
            <span className="island-label">{label}</span>
        </div>
    );
}
