"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import * as store from "@/lib/localStore";
import Navbar from "@/components/Navbar";
import ConfirmModal from "@/components/ConfirmModal";
import { IconRobot } from "@/components/PixelSprites";

const LANGS = [
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
    { code: "de", label: "DE" },
];

export default function SettingsPage() {
    const { t, lang, setLang } = useTranslation();

    const [keys, setKeys] = useState([]);
    const [loadingKeys, setLoadingKeys] = useState(true);

    // New key form
    const [provider, setProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");
    const [label, setLabel] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [keyToDelete, setKeyToDelete] = useState(null);

    const fetchKeys = () => {
        setLoadingKeys(true);
        const allKeys = store.getApiKeys().map(k => ({
            id: k.id,
            provider: k.provider,
            label: k.label,
            created_at: k.created_at,
        }));
        setKeys(allKeys);
        setLoadingKeys(false);
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleAddKey = (e) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            setError(t("settings.keyRequired"));
            return;
        }
        setSaving(true);
        setError("");

        try {
            const newKey = store.addApiKey({
                provider,
                label: label.trim() || `${provider} key`,
                api_key: apiKey.trim(),
            });
            setApiKey("");
            setLabel("");
            setKeys([{ id: newKey.id, provider: newKey.provider, label: newKey.label, created_at: newKey.created_at }, ...keys]);
        } catch (err) {
            setError("Failed to save key.");
        }
        setSaving(false);
    };

    const handleDeleteKey = (keyId) => {
        setKeyToDelete(keyId);
    };

    const confirmDeleteKey = () => {
        if (!keyToDelete) return;
        store.deleteApiKey(keyToDelete);
        setKeys(prev => prev.filter(k => k.id !== keyToDelete));
        setKeyToDelete(null);
    };

    return (
        <>
            <Navbar />
            <main className="settings-page">
                <div className="settings-header">
                    <div className="settings-header-icon">
                        <IconRobot size={48} />
                    </div>
                    <div>
                        <h1 className="settings-title">{t("settings.title")}</h1>
                        <p className="settings-subtitle">{t("settings.subtitle")}</p>
                    </div>
                </div>

                {/* Add new key */}
                <section className="settings-section pixel-border">
                    <h2 className="settings-section-title">{t("settings.addKey")}</h2>
                    <p className="settings-section-desc">{t("settings.addKeyDesc")}</p>

                    <p className="settings-section-desc" style={{ marginBottom: 12, color: "var(--primary)" }}>
                        {t("settings.localSecurityNote")}
                    </p>

                    <form onSubmit={handleAddKey} className="api-key-form">
                        <div className="api-key-form-row">
                            <label className="api-key-label">
                                {t("settings.provider")}
                                <select
                                    className="auth-input api-key-select"
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                >
                                    <option value="openai">OpenAI</option>
                                    <option value="anthropic">Anthropic (Claude)</option>
                                    <option value="deepseek">DeepSeek</option>
                                    <option value="gemini">Google Gemini</option>
                                </select>
                            </label>
                            <label className="api-key-label">
                                {t("settings.label")}
                                <input
                                    className="auth-input"
                                    type="text"
                                    autoComplete="off"
                                    name="api-key-label"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder={t("settings.labelPlaceholder")}
                                />
                            </label>
                        </div>

                        <label className="api-key-label">
                            {t("settings.apiKey")}
                            <input
                                className="auth-input"
                                type="password"
                                name="api-key-value"
                                autoComplete="new-password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder={provider === "openai" ? "sk-..." : provider === "anthropic" ? "sk-ant-..." : provider === "gemini" ? "AIza..." : "sk-..."}
                            />
                        </label>

                        {error && <p className="api-key-error">{error}</p>}

                        <button
                            type="submit"
                            className="pixel-btn pixel-btn-primary"
                            disabled={saving}
                        >
                            {saving ? t("settings.saving") : t("settings.saveKey")}
                        </button>
                    </form>
                </section>

                {/* Existing keys */}
                <section className="settings-section pixel-border">
                    <h2 className="settings-section-title">{t("settings.yourKeys")}</h2>
                    {loadingKeys ? (
                        <p className="pixel-text">{t("auth.loading")}</p>
                    ) : keys.length === 0 ? (
                        <p className="settings-empty">{t("settings.noKeys")}</p>
                    ) : (
                        <ul className="api-key-list">
                            {keys.map((k) => (
                                <li key={k.id} className="api-key-item">
                                    <div className="api-key-info">
                                        <span className={`api-key-provider ${k.provider}`}>
                                            {k.provider === "openai" ? "OpenAI" : k.provider === "anthropic" ? "Anthropic" : k.provider === "gemini" ? "Gemini" : "DeepSeek"}
                                        </span>
                                        <span className="api-key-item-label">{k.label}</span>
                                        <span className="api-key-date">
                                            {new Date(k.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="pixel-btn pixel-btn-danger pixel-btn-sm"
                                        onClick={() => handleDeleteKey(k.id)}
                                    >
                                        {t("settings.deleteKey")}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Language Settings */}
                <section className="settings-section pixel-border" style={{ marginTop: "32px", marginBottom: "64px" }}>
                    <h2 className="settings-section-title">{t("Navbar.language") || "Language"}</h2>
                    <p className="settings-section-desc">Choose your preferred language for the interface.</p>
                    <div className="lang-switcher" style={{ display: "inline-flex", gap: "12px", background: "rgba(0,0,0,0.3)", padding: "8px", borderRadius: "8px" }}>
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                className={`lang-btn ${lang === l.code ? "active" : ""}`}
                                onClick={() => setLang(l.code)}
                                style={{
                                    padding: "8px 16px",
                                    color: lang === l.code ? "#000" : "#fff",
                                    background: lang === l.code ? "#fff" : "transparent",
                                    border: "2px solid",
                                    borderColor: lang === l.code ? "#fff" : "transparent",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontFamily: '"Press Start 2P", cursive',
                                    fontSize: "0.8rem",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Security note */}
                <section className="settings-section settings-security-note">
                    <p>{t("settings.securityNote")}</p>
                </section>
            </main>

            <ConfirmModal
                isOpen={!!keyToDelete}
                title={t("settings.deleteKey") || "Delete API Key"}
                message={t("settings.deleteKeyConfirm") || "Are you sure you want to delete this API Key? It won't be recoverable."}
                onConfirm={confirmDeleteKey}
                onCancel={() => setKeyToDelete(null)}
            />
        </>
    );
}
