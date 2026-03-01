/**
 * localStore.js — localStorage-based data layer for AIslands (Open Source Edition)
 *
 * Replaces Supabase for a fully local, zero-config experience.
 * All data lives in the browser's localStorage.
 */

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}

function readJSON(key, fallback = []) {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJSON(key, data) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
}

function readString(key, fallback = "") {
    if (typeof window === "undefined") return fallback;
    return localStorage.getItem(key) || fallback;
}

function writeString(key, value) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
}

// ─── Projects ──────────────────────────────────────────────────────────────────

const PROJECTS_KEY = "ailands-projects";

export function getProjects() {
    return readJSON(PROJECTS_KEY, []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
}

export function getProject(id) {
    const projects = readJSON(PROJECTS_KEY, []);
    return projects.find((p) => p.id === id) || null;
}

export function createProject({ title, description = "", status = "active", tasks = [], notes = "", web_link = "" }) {
    const id = generateId("proj");
    const now = new Date().toISOString();
    const project = {
        id,
        title,
        description,
        status,
        web_link,
        created_at: now,
        updated_at: now,
    };
    const projects = readJSON(PROJECTS_KEY, []);
    projects.push(project);
    writeJSON(PROJECTS_KEY, projects);

    // Initialize tasks and notes if provided
    if (tasks.length > 0) saveTasks(id, tasks);
    if (notes) saveNotes(id, notes);

    return project;
}

export function updateProject(id, updates) {
    const projects = readJSON(PROJECTS_KEY, []);
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    projects[idx] = { ...projects[idx], ...updates, updated_at: new Date().toISOString() };
    writeJSON(PROJECTS_KEY, projects);
    return projects[idx];
}

export function deleteProject(id) {
    const projects = readJSON(PROJECTS_KEY, []).filter((p) => p.id !== id);
    writeJSON(PROJECTS_KEY, projects);

    // Cascade: remove related data
    if (typeof window !== "undefined") {
        localStorage.removeItem(`ailands-project-${id}-tasks`);
        localStorage.removeItem(`ailands-project-${id}-notes`);
        localStorage.removeItem(`ailands-project-${id}-ai-profiles`);
        localStorage.removeItem(`ailands-project-${id}-chat-sessions`);
    }
}

// ─── Tasks ─────────────────────────────────────────────────────────────────────

export function getTasks(projectId) {
    return readJSON(`ailands-project-${projectId}-tasks`, []);
}

export function saveTasks(projectId, tasks) {
    writeJSON(`ailands-project-${projectId}-tasks`, tasks);
}

// ─── Notes ─────────────────────────────────────────────────────────────────────

export function getNotes(projectId) {
    return readString(`ailands-project-${projectId}-notes`, "");
}

export function saveNotes(projectId, text) {
    writeString(`ailands-project-${projectId}-notes`, text);
}

// ─── AI Profiles ───────────────────────────────────────────────────────────────

function aiProfilesKey(projectId) {
    return `ailands-project-${projectId}-ai-profiles`;
}

export function getAiProfiles(projectId) {
    return readJSON(aiProfilesKey(projectId), []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
}

export function createAiProfile(projectId, { name, description = "", system_prompt, model = "gpt-4o-mini" }) {
    const id = generateId("prof");
    const profile = {
        id,
        name,
        description,
        system_prompt,
        model,
        created_at: new Date().toISOString(),
    };
    const profiles = readJSON(aiProfilesKey(projectId), []);
    profiles.push(profile);
    writeJSON(aiProfilesKey(projectId), profiles);
    return profile;
}

export function updateAiProfile(projectId, profileId, updates) {
    const profiles = readJSON(aiProfilesKey(projectId), []);
    const idx = profiles.findIndex((p) => p.id === profileId);
    if (idx === -1) return null;
    profiles[idx] = { ...profiles[idx], ...updates };
    writeJSON(aiProfilesKey(projectId), profiles);
    return profiles[idx];
}

export function deleteAiProfile(projectId, profileId) {
    const profiles = readJSON(aiProfilesKey(projectId), []).filter((p) => p.id !== profileId);
    writeJSON(aiProfilesKey(projectId), profiles);
}

// ─── Chat Sessions ─────────────────────────────────────────────────────────────

function chatSessionsKey(projectId) {
    return `ailands-project-${projectId}-chat-sessions`;
}

export function getChatSessions(projectId) {
    return readJSON(chatSessionsKey(projectId), []).sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
}

export function createChatSession(projectId, name = "Chat 1") {
    const id = generateId("sess");
    const now = new Date().toISOString();
    const session = { id, name, messages: [], created_at: now, updated_at: now };
    const sessions = readJSON(chatSessionsKey(projectId), []);
    sessions.push(session);
    writeJSON(chatSessionsKey(projectId), sessions);
    return session;
}

export function updateChatSession(projectId, sessionId, updates) {
    const sessions = readJSON(chatSessionsKey(projectId), []);
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) return null;
    sessions[idx] = { ...sessions[idx], ...updates, updated_at: new Date().toISOString() };
    writeJSON(chatSessionsKey(projectId), sessions);
    return sessions[idx];
}

export function deleteChatSession(projectId, sessionId) {
    const sessions = readJSON(chatSessionsKey(projectId), []).filter((s) => s.id !== sessionId);
    writeJSON(chatSessionsKey(projectId), sessions);
}

// ─── API Keys ──────────────────────────────────────────────────────────────────

const KEYS_KEY = "ailands-local-keys";

export function getApiKeys() {
    return readJSON(KEYS_KEY, []);
}

export function getFirstApiKey() {
    const keys = getApiKeys();
    return keys.length > 0 ? keys[0] : null;
}

export function addApiKey({ provider, label = "", api_key }) {
    const id = generateId("key");
    const key = { id, provider, label, api_key, created_at: new Date().toISOString() };
    const keys = readJSON(KEYS_KEY, []);
    keys.push(key);
    writeJSON(KEYS_KEY, keys);
    return key;
}

export function deleteApiKey(keyId) {
    const keys = readJSON(KEYS_KEY, []).filter((k) => k.id !== keyId);
    writeJSON(KEYS_KEY, keys);
}
