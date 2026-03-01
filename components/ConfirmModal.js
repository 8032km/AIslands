"use client";

import React from "react";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content pixel-border" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title pixel-text">{title || "Confirm"}</h2>
                <div className="modal-body">
                    <p style={{ marginBottom: "20px", color: "var(--text-light)", fontSize: "1.1rem" }}>
                        {message}
                    </p>
                    <div className="modal-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            className="pixel-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel();
                            }}
                        >
                            {cancelText || "Cancel"}
                        </button>
                        <button
                            type="button"
                            className="pixel-btn pixel-btn-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                onConfirm();
                            }}
                        >
                            {confirmText || "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
