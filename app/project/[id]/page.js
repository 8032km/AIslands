"use client";
import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";
import * as store from "@/lib/localStore";
import Navbar from "@/components/Navbar";
import WaterCanvas from "@/components/WaterCanvas";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ConfirmModal from "@/components/ConfirmModal";
import {
    HubIsland,
    ProjectsIsland,
    CollabIsland,
    FeedIsland,
    AgentsIsland,
    IconNotes,
} from "@/components/PixelSprites";

const TABS = ["overview", "tasks", "notes", "aiWorkspace", "aiChat", "settings"];

const ISLAND_SPRITES = [
    (w) => <HubIsland width={w} />,
    (w) => <ProjectsIsland width={w} />,
    (w) => <CollabIsland width={w} />,
    (w) => <FeedIsland width={w} />,
    (w) => <AgentsIsland width={w} />,
];

function hashId(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
}

/* Parse AI action commands from response text */
function parseActions(text) {
    const actions = [];
    const regex = /\[ACTION:(ADD_TASK|UPDATE_DESC|ADD_NOTE):(.+?)\]/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
        actions.push({ type: m[1], value: m[2] });
    }
    // Clean text: remove action tags
    const cleanText = text.replace(regex, "").trim();
    return { cleanText, actions };
}

export default function ProjectPage({ params }) {
    const { id } = use(params);
    const { t } = useTranslation();
    const router = useRouter();
    const chatEndRef = useRef(null);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Tasks state
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Notes state
    const [notes, setNotes] = useState("");
    const [notesSaved, setNotesSaved] = useState(false);

    // Description editing
    const [editingDesc, setEditingDesc] = useState(false);
    const [descDraft, setDescDraft] = useState("");

    // AI Chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [userApiKey, setUserApiKey] = useState(null);
    const [userProviders, setUserProviders] = useState([]);
    const [allUserKeys, setAllUserKeys] = useState([]);
    const [pendingActions, setPendingActions] = useState([]);
    // Chat sessions
    const [chatSessions, setChatSessions] = useState([]);
    const [activeChatSessionId, setActiveChatSessionId] = useState(null);
    const [chatSessionsLoaded, setChatSessionsLoaded] = useState(false);
    const [renamingSessionId, setRenamingSessionId] = useState(null);
    const [renameValue, setRenameValue] = useState("");

    // Web Link state
    const [webLink, setWebLink] = useState("");
    const [webLinkSaved, setWebLinkSaved] = useState(false);

    // AI Workspace state
    const [aiProfiles, setAiProfiles] = useState([]);
    const [selectedProfileId, setSelectedProfileId] = useState("");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [aiProfileDraft, setAiProfileDraft] = useState({ name: "", description: "", system_prompt: "", model: "gpt-4o-mini" });
    const [aiPromptSaved, setAiPromptSaved] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [saveProfileError, setSaveProfileError] = useState("");
    const promptTextareaRef = useRef(null);

    useEffect(() => {
        if (promptTextareaRef.current) {
            promptTextareaRef.current.style.height = 'auto';
            promptTextareaRef.current.style.height = promptTextareaRef.current.scrollHeight + 'px';
        }
    }, [aiProfileDraft.system_prompt, activeTab, isEditingProfile]);

    useEffect(() => {
        if (!id) return;
        (async () => {
            // Fetch project from local store
            const data = store.getProject(id);

            if (!data) {
                router.push("/dashboard");
                return;
            }
            setProject(data);
            setDescDraft(data.description || "");
            setWebLink(data.web_link || "");

            // Load tasks
            const savedTasks = store.getTasks(id);
            if (savedTasks && savedTasks.length > 0) setTasks(savedTasks);

            // Load notes
            const savedNotes = store.getNotes(id);
            if (savedNotes) setNotes(savedNotes);

            // Load chat sessions from local store
            const sessions = store.getChatSessions(id);
            if (sessions && sessions.length > 0) {
                setChatSessions(sessions);
                setActiveChatSessionId(sessions[0].id);
                setChatMessages(sessions[0].messages || []);
            } else {
                // No sessions yet — create a default one
                const newSession = store.createChatSession(id, "Chat 1");
                if (newSession) {
                    setChatSessions([newSession]);
                    setActiveChatSessionId(newSession.id);
                }
            }
            setChatSessionsLoaded(true);

            // Load API keys from local store
            const allKeys = store.getApiKeys();
            if (allKeys.length > 0) {
                setUserApiKey(allKeys[0]);
                setAllUserKeys(allKeys);
                setUserProviders([...new Set(allKeys.map(k => k.provider))]);
            } else {
                setAllUserKeys([]);
                setUserProviders([]);
            }

            // Load AI Profiles from local store
            const profilesData = store.getAiProfiles(id);
            if (profilesData && profilesData.length > 0) {
                setAiProfiles(profilesData);
                setSelectedProfileId(profilesData[0].id);
            }

            setLoading(false);
        })();
    }, [id]);

    const saveTasks = (updated) => {
        setTasks(updated);
        store.saveTasks(id, updated);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        saveTasks([...tasks, { id: Date.now(), text: newTask.trim(), done: false }]);
        setNewTask("");
    };

    const toggleTask = (taskId) => {
        saveTasks(tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
    };

    const deleteTask = (taskId) => {
        saveTasks(tasks.filter((t) => t.id !== taskId));
    };

    const handleSaveNotes = () => {
        store.saveNotes(id, notes);
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
    };

    const handleSaveDescription = async () => {
        store.updateProject(id, { description: descDraft });
        setProject({ ...project, description: descDraft });
        setEditingDesc(false);
    };

    const confirmDeleteProject = async () => {
        store.deleteProject(id);
        router.push("/dashboard");
    };

    const handleDeleteProject = () => {
        setShowDeleteModal(true);
    };

    // ── Chat session helpers ──────────────────────────────────────────────────

    const createChatSession = async () => {
        const name = `Chat ${chatSessions.length + 1}`;
        const data = store.createChatSession(id, name);
        if (data) {
            setChatSessions(prev => [data, ...prev]);
            setActiveChatSessionId(data.id);
            setChatMessages([]);
        }
    };

    const switchChatSession = (session) => {
        setActiveChatSessionId(session.id);
        setChatMessages(session.messages || []);
    };

    const renameChatSession = async (sessionId, newName) => {
        store.updateChatSession(id, sessionId, { name: newName });
        setChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, name: newName } : s));
        setRenamingSessionId(null);
    };

    const deleteChatSession = async (sessionId) => {
        store.deleteChatSession(id, sessionId);
        const remaining = chatSessions.filter(s => s.id !== sessionId);
        setChatSessions(remaining);
        if (activeChatSessionId === sessionId) {
            if (remaining.length > 0) {
                setActiveChatSessionId(remaining[0].id);
                setChatMessages(remaining[0].messages || []);
            } else {
                // Create a fresh session if none remain
                createChatSession();
            }
        }
    };

    // Apply an AI action
    const applyAction = (action) => {
        if (action.type === "ADD_TASK") {
            const updated = [...tasks, { id: Date.now(), text: action.value, done: false }];
            saveTasks(updated);
        } else if (action.type === "UPDATE_DESC") {
            setDescDraft(action.value);
            store.updateProject(id, { description: action.value });
            setProject((p) => ({ ...p, description: action.value }));
        } else if (action.type === "ADD_NOTE") {
            const updated = notes ? notes + "\n" + action.value : action.value;
            setNotes(updated);
            store.saveNotes(id, updated);
        }
        // Remove from pending
        setPendingActions((prev) => prev.filter((a) => a !== action));
    };

    // AI Chat — real LLM call
    const handleChatSend = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = { role: "user", text: chatInput.trim() };
        const updated = [...chatMessages, userMsg];
        setChatMessages(updated);
        setChatInput("");
        setChatLoading(true);
        // Scroll to bottom immediately so user sees their own message
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

        try {
            if (!userApiKey) {
                // No API key — show helpful message
                const noKeyMsg = {
                    role: "assistant",
                    text: t("aiWorkspace.noKeyMessage"),
                };
                const withMsg = [...updated, noKeyMsg];
                setChatMessages(withMsg);
                setChatLoading(false);
                return;
            }

            const activeProfile = aiProfiles.find(p => p.id === selectedProfileId);
            const personaName = activeProfile?.name || "AI";

            const chatRequestBody = {
                provider: userApiKey.provider,
                messages: updated.slice(-20),
                personaName,
                model: (() => {
                    const profileModel = activeProfile?.model;
                    if (profileModel && profileModel !== "gpt-4o-mini") return profileModel;
                    if (userApiKey.provider === "gemini") return "gemini-2.0-flash";
                    if (userApiKey.provider === "deepseek") return "deepseek-chat";
                    if (userApiKey.provider === "anthropic") return "claude-3-haiku-20240307";
                    return profileModel || "gpt-4o-mini";
                })(),
                projectContext: {
                    title: project?.title,
                    description: project?.description,
                    status: project?.status,
                    tasks,
                    notes,
                    ai_custom_prompt: activeProfile?.system_prompt || "",
                    _currentPersonaId: selectedProfileId,
                },
                apiKeyRaw: userApiKey.api_key,
            };

            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(chatRequestBody),
            });

            const data = await res.json();

            if (data.error) {
                const errMsg = {
                    role: "assistant",
                    text: `⚠️ ${data.error}${data.details ? "\n" + data.details.substring(0, 200) : ""}`,
                };
                const withErr = [...updated, errMsg];
                setChatMessages(withErr);
                // Save to local store session
                if (activeChatSessionId) {
                    store.updateChatSession(id, activeChatSessionId, { messages: withErr });
                    setChatSessions(prev => prev.map(s => s.id === activeChatSessionId ? { ...s, messages: withErr } : s));
                }
            } else {
                // Parse actions from response
                const { cleanText, actions } = parseActions(data.text);

                const aiMsg = {
                    role: "assistant",
                    text: cleanText,
                    personaId: selectedProfileId,
                    personaName,
                    actions: actions.length > 0 ? actions : undefined,
                };
                const withAi = [...updated, aiMsg];
                setChatMessages(withAi);
                // Save to local store session
                if (activeChatSessionId) {
                    store.updateChatSession(id, activeChatSessionId, { messages: withAi });
                    setChatSessions(prev => prev.map(s => s.id === activeChatSessionId ? { ...s, messages: withAi } : s));
                }

                if (actions.length > 0) {
                    setPendingActions((prev) => [...prev, ...actions]);
                }
            }
        } catch (err) {
            const errMsg = { role: "assistant", text: `⚠️ ${err.message}` };
            const withErr = [...updated, errMsg];
            setChatMessages(withErr);
        }

        setChatLoading(false);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const handleSaveWebLink = async () => {
        store.updateProject(id, { web_link: webLink });
        setProject({ ...project, web_link: webLink });
        setWebLinkSaved(true);
        setTimeout(() => setWebLinkSaved(false), 2000);
    };

    const handleSaveProfile = async () => {
        setSaveProfileError("");
        if (!aiProfileDraft.name?.trim()) {
            setSaveProfileError("Please give this AI profile a name.");
            return;
        }

        if (aiProfileDraft.id) {
            // Update existing
            const updated = store.updateAiProfile(id, aiProfileDraft.id, {
                name: aiProfileDraft.name,
                description: aiProfileDraft.description,
                system_prompt: aiProfileDraft.system_prompt,
                model: aiProfileDraft.model || "gpt-4o-mini"
            });
            if (updated) {
                setAiProfiles(aiProfiles.map(p => p.id === updated.id ? updated : p));
            }
        } else {
            // Create new — scoped to this project
            const inserted = store.createAiProfile(id, {
                name: aiProfileDraft.name,
                description: aiProfileDraft.description || "",
                system_prompt: aiProfileDraft.system_prompt?.trim() || " ",
                model: aiProfileDraft.model || "gpt-4o-mini"
            });
            if (inserted) {
                setAiProfiles(prev => [inserted, ...prev]);
                setSelectedProfileId(inserted.id);
            }
        }

        setAiPromptSaved(true);
        setTimeout(() => setAiPromptSaved(false), 2000);
        setIsEditingProfile(false);
    };

    const handleDeleteProfile = (profile) => {
        setProfileToDelete(profile);
    };

    const confirmDeleteProfile = async () => {
        if (!profileToDelete) return;
        store.deleteAiProfile(id, profileToDelete.id);
        const updated = aiProfiles.filter(p => p.id !== profileToDelete.id);
        setAiProfiles(updated);
        if (selectedProfileId === profileToDelete.id) {
            setSelectedProfileId(updated.length > 0 ? updated[0].id : "");
        }
        setProfileToDelete(null);
    };

    const handleExportProfile = () => {
        const payload = {
            name: aiProfileDraft.name || "My AI",
            description: aiProfileDraft.description || "Exported AI Configuration from AIslands",
            system_prompt: aiProfileDraft.system_prompt,
            model: aiProfileDraft.model || "gpt-4o-mini",
            temperature: 0.7,
            messages: [
                { role: "system", content: aiProfileDraft.system_prompt }
            ]
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `ai_profile_${aiProfileDraft.name.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportProfile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonObj = JSON.parse(event.target.result);
                const importedPrompt = jsonObj.system_prompt ||
                    (jsonObj.messages && jsonObj.messages[0] && jsonObj.messages[0].content) ||
                    jsonObj.prompt;

                if (importedPrompt !== undefined && typeof importedPrompt === 'string') {
                    setAiProfileDraft({
                        ...aiProfileDraft,
                        name: jsonObj.name || "Imported AI",
                        description: jsonObj.description || "",
                        system_prompt: importedPrompt,
                        model: jsonObj.model || "gpt-4o-mini"
                    });
                }
            } catch (err) {
                console.error("Failed to parse JSON", err);
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p className="pixel-text">{t("auth.loading")}</p>
            </div>
        );
    }

    if (!project) return null;

    const spriteIdx = hashId(id) % ISLAND_SPRITES.length;
    const formattedDate = new Date(project.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <>
            <Navbar />

            {/* Immersive island hero */}
            <div className="project-hero">
                <WaterCanvas />
                <div className="project-hero-island">
                    {ISLAND_SPRITES[spriteIdx](180)}
                </div>
                <div className="project-hero-overlay">
                    <Link href="/dashboard" className="project-back-hero">
                        {t("project.backToDashboard")}
                    </Link>
                    <h1 className="project-hero-title">{project.title}</h1>
                    <div className="project-meta-hero">
                        <span>{t("project.created")}: {formattedDate}</span>
                        <span className="project-meta-status" data-status={project.status}>
                            {project.status === "active" ? t("project.active") : t("project.archived")}
                        </span>
                        {project.web_link && (
                            <a href={project.web_link} target="_blank" rel="noopener noreferrer" className="pixel-btn pixel-btn-primary pixel-btn-sm" style={{ textDecoration: "none", marginLeft: "8px" }}>
                                🌐 {t("project.visitLink")}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content area */}
            <main className="project-page">
                <div className="project-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`project-tab ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {t(`project.${tab}`)}
                        </button>
                    ))}
                </div>

                <div className="project-content pixel-border">
                    {/* Overview */}
                    {activeTab === "overview" && (
                        <div className="project-overview">
                            <div className="project-section">
                                <div className="project-section-header">
                                    <h3>{t("project.description")}</h3>
                                    {!editingDesc && (
                                        <button className="pixel-btn pixel-btn-sm" onClick={() => setEditingDesc(true)}>
                                            {t("project.editDescription")}
                                        </button>
                                    )}
                                </div>
                                {editingDesc ? (
                                    <div className="project-desc-edit">
                                        <textarea className="auth-input auth-textarea" value={descDraft} onChange={(e) => setDescDraft(e.target.value)} rows={4} />
                                        <button className="pixel-btn pixel-btn-primary pixel-btn-sm" onClick={handleSaveDescription}>{t("project.saveDescription")}</button>
                                    </div>
                                ) : (
                                    <p className="project-desc-text">{project.description || t("project.noDescription")}</p>
                                )}
                            </div>

                            <div className="project-stats">
                                <div className="project-stat pixel-border">
                                    <span className="project-stat-value">{tasks.length}</span>
                                    <span className="project-stat-label">{t("project.tasks")}</span>
                                </div>
                                <div className="project-stat pixel-border">
                                    <span className="project-stat-value">{tasks.filter((t) => t.done).length}</span>
                                    <span className="project-stat-label">✓ Done</span>
                                </div>
                                <div className="project-stat pixel-border">
                                    <span className="project-stat-value">
                                        {notes.length > 0 ? <IconNotes size={24} /> : "—"}
                                    </span>
                                    <span className="project-stat-label">{t("project.notes")}</span>
                                </div>
                            </div>

                            {/* AI connection status */}
                            <div className="project-section" style={{ marginTop: "16px" }}>
                                <div className="ai-status-bar pixel-border">
                                    <span className={`ai-status-dot ${userApiKey ? "connected" : "disconnected"}`} />
                                    <span className="ai-status-text">
                                        {userApiKey
                                            ? `${t("aiWorkspace.connected")} (${userApiKey.provider})`
                                            : t("aiWorkspace.notConnected")}
                                    </span>
                                    {!userApiKey && (
                                        <Link href="/settings" className="pixel-btn pixel-btn-sm" style={{ marginLeft: "auto" }}>
                                            {t("aiWorkspace.addKeyLink")}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tasks */}
                    {activeTab === "tasks" && (
                        <div className="project-tasks">
                            <form onSubmit={handleAddTask} className="task-add-form">
                                <input className="auth-input task-input" type="text" placeholder={t("project.taskPlaceholder")} value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                                <button type="submit" className="pixel-btn pixel-btn-primary pixel-btn-sm">{t("project.addTask")}</button>
                            </form>
                            {tasks.length === 0 ? (
                                <p className="project-empty-tab">{t("project.noTasks")}</p>
                            ) : (
                                <ul className="task-list">
                                    {tasks.map((task) => (
                                        <li key={task.id} className={`task-item ${task.done ? "done" : ""}`}>
                                            <label className="task-check">
                                                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                                                <span className="task-text">{task.text}</span>
                                            </label>
                                            <button className="task-delete" onClick={() => deleteTask(task.id)} title="Delete">✕</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    {activeTab === "notes" && (
                        <div className="project-notes">
                            <textarea className="auth-input notes-textarea" placeholder={t("project.notesPlaceholder")} value={notes} onChange={(e) => setNotes(e.target.value)} rows={12} />
                            <div className="notes-actions">
                                {notesSaved && <span className="notes-saved">{t("project.notesSaved")}</span>}
                                <button className="pixel-btn pixel-btn-primary pixel-btn-sm" onClick={handleSaveNotes}>{t("project.saveNotes")}</button>
                            </div>
                        </div>
                    )}

                    {/* AI Workspace - Profile Manager */}
                    {activeTab === "aiWorkspace" && (
                        <div className="ai-workspace">
                            {!isEditingProfile ? (
                                <div className="project-section pixel-border" style={{ padding: "24px" }}>
                                    <div className="project-section-header" style={{ marginBottom: "24px" }}>
                                        <h3 style={{ fontSize: "1.2rem", color: "#f0b875", textTransform: "uppercase" }}>{t("aiWorkspace.createdAis")}</h3>
                                        <button
                                            className="pixel-btn pixel-btn-primary pixel-btn-sm"
                                            onClick={() => {
                                                // Use the user's first registered provider model as default
                                                const defaultModel = userProviders.includes('gemini') ? 'gemini-2.0-flash'
                                                    : userProviders.includes('deepseek') ? 'deepseek-chat'
                                                    : userProviders.includes('anthropic') ? 'claude-3-haiku-20240307'
                                                        : 'gpt-4o-mini';
                                                setAiProfileDraft({ name: "", description: "", system_prompt: "", model: defaultModel });
                                                setIsEditingProfile(true);
                                            }}
                                        >
                                            {t("aiWorkspace.createNewAi")}
                                        </button>
                                    </div>
                                    <div className="ai-profile-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {aiProfiles.length === 0 ? (
                                            <p className="project-empty-tab" style={{ textAlign: "center", padding: "32px 0", opacity: 0.7 }}>
                                                {t("aiWorkspace.noProfiles")}
                                            </p>
                                        ) : (
                                            aiProfiles.map(profile => (
                                                <div
                                                    key={profile.id}
                                                    className="pixel-border"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        padding: "16px",
                                                        background: "transparent"
                                                    }}
                                                >
                                                    <div>
                                                        <h4 style={{ color: "#f0b875", marginBottom: "4px", fontSize: "1.1rem" }}>{profile.name}</h4>
                                                        <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>{profile.description || "No description provided."}</p>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "8px" }}>
                                                        <button
                                                            className="pixel-btn pixel-btn-sm"
                                                            onClick={() => {
                                                                setAiProfileDraft(profile);
                                                                setIsEditingProfile(true);
                                                            }}
                                                        >
                                                            {t("project.editDescription")}
                                                        </button>
                                                        <button
                                                            className="pixel-btn pixel-btn-danger pixel-btn-sm"
                                                            onClick={() => handleDeleteProfile(profile)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="ai-profile-editor" style={{ padding: "12px 0" }}>
                                    {/* Editor Form WITHOUT gray background */}
                                    <div className="project-section-header" style={{ marginBottom: "24px" }}>
                                        <h3 style={{ color: "#f0b875", textTransform: "uppercase", letterSpacing: "1px", fontSize: "1.4rem" }}>
                                            {aiProfileDraft.id ? t("aiWorkspace.editProfile") : t("aiWorkspace.createProfile")}
                                        </h3>
                                        <button className="pixel-btn pixel-btn-sm" onClick={() => setIsEditingProfile(false)}>
                                            {t("aiWorkspace.backToList")}
                                        </button>
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ display: "block", marginBottom: "8px", color: "#a5a5a5", fontSize: "1rem" }}>{t("aiWorkspace.aiName")}</label>
                                        <input
                                            type="text"
                                            className="auth-input"
                                            value={aiProfileDraft.name}
                                            onChange={(e) => setAiProfileDraft({ ...aiProfileDraft, name: e.target.value })}
                                            placeholder="e.g. Pirate Assistant"
                                            style={{ width: "100%", maxWidth: "400px", color: "#2b2b2b" }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: "24px" }}>
                                        <label style={{ display: "block", marginBottom: "8px", color: "#a5a5a5", fontSize: "1rem" }}>{t("aiWorkspace.aiDesc")}</label>
                                        <input
                                            type="text"
                                            className="auth-input"
                                            value={aiProfileDraft.description}
                                            onChange={(e) => setAiProfileDraft({ ...aiProfileDraft, description: e.target.value })}
                                            placeholder="e.g. A helpful bot that talks like a pirate"
                                            style={{ width: "100%", color: "#2b2b2b" }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "24px" }}>
                                        <label style={{ display: "block", marginBottom: "8px", color: "#a5a5a5", fontSize: "1rem" }}>{t("aiWorkspace.aiModel")}</label>
                                        {allUserKeys.length === 0 ? (
                                            <div style={{ color: "#d9534f", fontSize: "0.9rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                                                <span>{t("aiWorkspace.noKeyMessage") || "No models available. Add API keys to use AI."}</span>
                                                <button onClick={() => router.push('/settings')} className="pixel-btn" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
                                                    Settings
                                                </button>
                                            </div>
                                        ) : (
                                            <select
                                                className="auth-input pixel-border"
                                                value={aiProfileDraft.model || ""}
                                                onChange={(e) => setAiProfileDraft({ ...aiProfileDraft, model: e.target.value })}
                                                style={{ margin: 0, padding: "8px 12px", width: "100%", maxWidth: "400px", color: "#2b2b2b", cursor: "pointer", appearance: "none" }}
                                            >
                                                {allUserKeys.map(k => {
                                                    const defaultModel = k.provider === "gemini" ? "gemini-2.0-flash"
                                                        : k.provider === "deepseek" ? "deepseek-chat"
                                                        : k.provider === "anthropic" ? "claude-3-haiku-20240307"
                                                            : "gpt-4o-mini";
                                                    return (
                                                        <option key={k.id} value={defaultModel}>
                                                            {k.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        )}
                                    </div>

                                    <div style={{ width: "100%", marginBottom: "24px" }}>
                                        <label style={{ display: "block", marginBottom: "8px", color: "#8b5a2b", fontSize: "1rem", fontWeight: "bold" }}>{t("aiWorkspace.aiInstructions")}</label>
                                        <div className="pixel-border" style={{
                                            padding: "4px",
                                            background: "rgba(0,0,0,0.1)",
                                        }}>
                                            <textarea
                                                ref={promptTextareaRef}
                                                className="auth-input auth-textarea"
                                                placeholder={t("aiWorkspace.customPromptPlaceholder")}
                                                value={aiProfileDraft.system_prompt}
                                                onChange={(e) => setAiProfileDraft({ ...aiProfileDraft, system_prompt: e.target.value })}
                                                style={{
                                                    width: "100%",
                                                    minHeight: "180px",
                                                    resize: "none",
                                                    boxSizing: "border-box",
                                                    overflow: "hidden",
                                                    border: "none",
                                                    background: "transparent",
                                                    fontSize: "1.1rem",
                                                    lineHeight: "1.6",
                                                    padding: "16px",
                                                    color: "#2b2b2b",
                                                    outline: "none"
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        gap: "16px",
                                        alignItems: "center",
                                        paddingTop: "16px",
                                        borderTop: "2px dashed rgba(255,255,255,0.1)",
                                        flexWrap: "wrap",
                                    }}>
                                        <button className="pixel-btn pixel-btn-primary" onClick={handleSaveProfile}>
                                            {t("aiWorkspace.saveConfig")}
                                        </button>
                                        <button className="pixel-btn" onClick={handleExportProfile} disabled={!aiProfileDraft.system_prompt}>
                                            📥 {t("aiWorkspace.exportAi")}
                                        </button>
                                        <label className="pixel-btn" style={{ cursor: "pointer", margin: 0 }}>
                                            📤 {t("aiWorkspace.importAi")}
                                            <input type="file" accept=".json" style={{ display: "none" }} onChange={handleImportProfile} />
                                        </label>
                                        {aiPromptSaved && <span className="notes-saved" style={{ marginLeft: "8px", fontSize: "1.1rem" }}>✓ Saved</span>}
                                        {saveProfileError && <span style={{ color: "#d9534f", fontSize: "0.9rem" }}>⚠ {saveProfileError}</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI Chat Arena */}
                    {activeTab === "aiChat" && (
                        <div className="ai-chat-arena">
                            {/* ── Chat Session Tabs ── */}
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                                {chatSessions.map(session => (
                                    <div
                                        key={session.id}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "6px",
                                            padding: "6px 12px",
                                            background: activeChatSessionId === session.id ? "#f0b875" : "transparent",
                                            border: "2px solid",
                                            borderColor: activeChatSessionId === session.id ? "#f0b875" : "rgba(255,255,255,0.2)",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            color: activeChatSessionId === session.id ? "#1a1a1a" : "inherit",
                                            fontSize: "0.9rem",
                                            flexShrink: 0,
                                            transition: "all 0.15s"
                                        }}
                                        onClick={() => switchChatSession(session)}
                                        onDoubleClick={() => { setRenamingSessionId(session.id); setRenameValue(session.name); }}
                                    >
                                        {renamingSessionId === session.id ? (
                                            <input
                                                autoFocus
                                                value={renameValue}
                                                onChange={e => setRenameValue(e.target.value)}
                                                onBlur={() => renameChatSession(session.id, renameValue || session.name)}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") renameChatSession(session.id, renameValue || session.name);
                                                    if (e.key === "Escape") setRenamingSessionId(null);
                                                }}
                                                onClick={e => e.stopPropagation()}
                                                style={{ background: "transparent", border: "none", outline: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit", width: "80px" }}
                                            />
                                        ) : (
                                            <span>{session.name}</span>
                                        )}
                                        {chatSessions.length > 1 && (
                                            <span
                                                onClick={e => { e.stopPropagation(); deleteChatSession(session.id); }}
                                                style={{ opacity: 0.6, fontSize: "0.75rem", lineHeight: 1, cursor: "pointer", padding: "0 2px" }}
                                                title="Delete this chat"
                                            >✕</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="project-section pixel-border" style={{ marginBottom: "16px", padding: "16px", background: "transparent" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                                    <label style={{ color: "#a5a5a5", fontSize: "1rem", fontWeight: "bold" }}>{t("aiWorkspace.activePersona")}</label>
                                    <select
                                        className="auth-input"
                                        value={selectedProfileId}
                                        onChange={(e) => {
                                            setSelectedProfileId(e.target.value);
                                        }}
                                        style={{ margin: 0, padding: "8px 12px", minWidth: "250px", cursor: "pointer" }}
                                    >
                                        {aiProfiles.length === 0 ? (
                                            <option value="">{t("aiWorkspace.noProfilesCreated")}</option>
                                        ) : (
                                            aiProfiles.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))
                                        )}
                                    </select>
                                    <button
                                        className="pixel-btn pixel-btn-sm"
                                        onClick={createChatSession}
                                        title="Start a new chat session"
                                    >
                                        + New Chat
                                    </button>
                                    {aiProfiles.length === 0 && (
                                        <span style={{ fontSize: "0.8rem", color: "#f0b875" }}>{t("aiWorkspace.goToWorkspace")}</span>
                                    )}
                                </div>
                                {/* Show active system prompt preview */}
                                {(() => {
                                    const activePrompt = aiProfiles.find(p => p.id === selectedProfileId)?.system_prompt?.trim();
                                    return activePrompt && activePrompt !== " " ? (
                                        <p style={{ marginTop: "8px", fontSize: "0.8rem", color: "#a5a5a5", fontStyle: "italic", opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                                            🤖 Persona: "{activePrompt.slice(0, 100)}{activePrompt.length > 100 ? "..." : ""}"
                                        </p>
                                    ) : null;
                                })()}
                            </div>

                            {!userApiKey && (
                                <div className="ai-chat-no-key">
                                    <p>{t("aiWorkspace.noKeyMessage")}</p>
                                    <Link href="/settings" className="pixel-btn pixel-btn-primary pixel-btn-sm">
                                        {t("aiWorkspace.addKeyLink")}
                                    </Link>
                                </div>
                            )}

                            <div className="ai-chat-messages" style={{ height: "450px" }}>
                                {chatMessages.length === 0 && userApiKey && (
                                    <div className="ai-chat-bubble assistant">
                                        {t("aiWorkspace.welcome")} Select a persona from the dropdown above to begin chatting!
                                    </div>
                                )}
                                {chatMessages.map((msg, i) => (
                                    <div key={i}>
                                        <div className={`ai-chat-bubble ${msg.role}`}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline ? (
                                                            <div className="custom-code-block">
                                                                {match && <div className="code-lang-label">{match[1]}</div>}
                                                                <pre className={className}>
                                                                    <code className={className} {...props}>
                                                                        {children}
                                                                    </code>
                                                                </pre>
                                                            </div>
                                                        ) : (
                                                            <code className="inline-code" {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                        {/* Action buttons */}
                                        {msg.actions && msg.actions.length > 0 && (
                                            <div className="ai-action-buttons">
                                                {msg.actions.map((action, j) => (
                                                    <button
                                                        key={j}
                                                        className="pixel-btn pixel-btn-sm ai-action-btn"
                                                        onClick={() => applyAction(action)}
                                                    >
                                                        {action.type === "ADD_TASK" && `✓ Add task: "${action.value.substring(0, 30)}..."`}
                                                        {action.type === "UPDATE_DESC" && "📝 Update description"}
                                                        {action.type === "ADD_NOTE" && "📋 Add to notes"}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="ai-chat-bubble assistant ai-thinking">
                                        {t("aiWorkspace.thinking")}
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleChatSend} className="ai-chat-form">
                                <input
                                    className="auth-input ai-chat-input"
                                    type="text"
                                    placeholder={userApiKey ? t("aiWorkspace.placeholder") : t("aiWorkspace.noKeyPlaceholder")}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    disabled={!userApiKey || chatLoading}
                                />
                                <button
                                    type="submit"
                                    className="pixel-btn pixel-btn-primary pixel-btn-sm"
                                    disabled={!userApiKey || chatLoading}
                                >
                                    {chatLoading ? "..." : t("aiWorkspace.send")}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Settings */}
                    {activeTab === "settings" && (
                        <div className="project-settings">
                            {/* Web Link section */}
                            <div className="project-section">
                                <h3 style={{ marginBottom: "12px" }}>{t("project.webLink")}</h3>
                                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <input
                                        type="url"
                                        className="auth-input"
                                        placeholder={t("project.webLinkPlaceholder")}
                                        value={webLink}
                                        onChange={(e) => setWebLink(e.target.value)}
                                        style={{ flex: 1, margin: 0 }}
                                    />
                                    <button className="pixel-btn pixel-btn-primary" onClick={handleSaveWebLink}>
                                        {t("project.saveDescription")}
                                    </button>
                                </div>
                                {webLinkSaved && <p className="notes-saved" style={{ marginTop: "8px", marginLeft: 0 }}>✓ Saved</p>}
                            </div>

                            {/* Danger zone */}
                            <div className="project-section danger-section" style={{ marginTop: "32px" }}>
                                <h3 className="danger-title">{t("project.dangerZone")}</h3>
                                <p className="danger-desc">{t("project.deleteWarning")}</p>
                                <button className="pixel-btn pixel-btn-danger" onClick={handleDeleteProject}>
                                    {t("project.deleteProject")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main >

            <ConfirmModal
                isOpen={showDeleteModal}
                title={t("project.deleteTitle") || "Destroy Island"}
                message={`${t("project.deleteWarning") || "Are you absolutely sure you want to permanently delete this island and all associated data within it?"} (${project?.title})`}
                onConfirm={confirmDeleteProject}
                onCancel={() => setShowDeleteModal(false)}
            />

            <ConfirmModal
                isOpen={!!profileToDelete}
                title="Delete AI Profile"
                message={`Are you sure you want to permanently delete the AI Profile "${profileToDelete?.name}"? This cannot be undone.`}
                onConfirm={confirmDeleteProfile}
                onCancel={() => setProfileToDelete(null)}
            />
        </>
    );
}
