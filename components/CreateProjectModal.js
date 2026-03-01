"use client";
import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";

export default function CreateProjectModal({ onClose, onCreate }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError(t("createModal.nameRequired"));
            return;
        }
        setLoading(true);
        setError("");
        try {
            await onCreate(title.trim(), description.trim());
        } catch (err) {
            setError(err.message || t("createModal.createFailed"));
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content pixel-border"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="modal-title">{t("createModal.title")}</h2>
                <p className="modal-subtitle">{t("createModal.subtitle")}</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label className="auth-label">{t("createModal.nameLabel")}</label>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder={t("createModal.namePlaceholder")}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={100}
                            autoFocus
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">{t("createModal.descLabel")}</label>
                        <textarea
                            className="auth-input auth-textarea"
                            placeholder={t("createModal.descPlaceholder")}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            maxLength={500}
                        />
                    </div>

                    {error && <p className="auth-error">⚠ {error}</p>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="pixel-btn pixel-btn-sm"
                            onClick={onClose}
                        >
                            {t("createModal.cancel")}
                        </button>
                        <button
                            type="submit"
                            className="pixel-btn pixel-btn-primary"
                            disabled={loading}
                        >
                            {loading ? t("createModal.creating") : t("createModal.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
