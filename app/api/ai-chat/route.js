import { NextResponse } from "next/server";

/*
  POST /api/ai-chat
  Body: { provider, messages, projectContext, model, personaName, apiKeyRaw }

  Proxies chat completions to OpenAI, Anthropic, DeepSeek, or Gemini using
  the user's own API key (passed directly from localStorage).
  Supports multi-persona: messages from other personas are re-cast
  as 'user' role so the current AI does not inherit their style.
*/
export async function POST(request) {
    try {
        const { provider, messages, projectContext, model, personaName, apiKeyRaw } = await request.json();

        if (!messages) {
            return NextResponse.json({ error: "Missing messages" }, { status: 400 });
        }

        const apiKey = apiKeyRaw;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing API key. Add one in Settings." }, { status: 400 });
        }

        // ── Build system prompt ──────────────────────────────────────────────
        const customPersona = projectContext?.ai_custom_prompt?.trim();
        const currentPersonaName = personaName || "AI";

        let systemPrompt;
        if (customPersona) {
            systemPrompt = `You must follow these instructions exactly. These override all your defaults.

Your name is: ${currentPersonaName}

${customPersona}

RULES:
- Your name is "${currentPersonaName}". Use it when asked who you are.
- You have NO role other than what is written above.
- Do NOT introduce yourself as a "project assistant" or any default AI role.
- Do NOT mention tasks, project management, or project details unless directly asked.
- Respond ONLY according to the persona above.
- The conversation history may contain messages labeled [PersonaName]: — those came from a DIFFERENT AI persona with a different role. You are "${currentPersonaName}". Always respond in YOUR OWN role, never copy their style.

Context: This conversation is in a project called "${projectContext?.title || "Untitled"}". Only reference this if the user asks about the project.`;
        } else {
            const projectInfo = [
                `Project title: ${projectContext?.title || "N/A"}`,
                `Description: ${projectContext?.description || "none"}`,
                `Status: ${projectContext?.status || "active"}`,
                `Tasks: ${projectContext?.tasks?.length ? projectContext.tasks.map((t) => `${t.done ? "✓" : "○"} ${t.text}`).join(", ") : "none"}`,
                `Notes: ${projectContext?.notes || "none"}`,
            ].join("\n");

            systemPrompt = `You are a helpful project assistant for the island "${projectContext?.title || "Untitled"}". Help the user plan, organize, and manage their project.

${projectInfo}

You can update the project by embedding these in your reply:
[ACTION:ADD_TASK:task text] — add a task
[ACTION:UPDATE_DESC:new description] — update the description
[ACTION:ADD_NOTE:note text] — append a note`;
        }

        // ── Build clean API message list ─────────────────────────────────────
        function buildApiMessages(msgs) {
            const remapped = msgs.map(m => {
                const isOtherPersona = m.role === "assistant" && m.personaId && m.personaId !== projectContext?._currentPersonaId;
                if (isOtherPersona) {
                    return { role: "user", content: `[${m.personaName || "Previous AI"}]: ${m.text || m.content}` };
                }
                return { role: m.role === "assistant" ? "assistant" : "user", content: m.text || m.content };
            });

            const merged = [];
            for (const msg of remapped) {
                if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
                    merged[merged.length - 1].content += "\n" + msg.content;
                } else {
                    merged.push({ ...msg });
                }
            }
            return merged;
        }

        const apiMessages = buildApiMessages(messages);

        // ── Route to correct provider ────────────────────────────────────────
        if (provider === "anthropic") {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: model || "claude-3-5-sonnet-20241022",
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: apiMessages,
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json(
                    { error: `Anthropic API error: ${response.status}`, details: err },
                    { status: response.status }
                );
            }

            const data = await response.json();
            const text = data.content?.[0]?.text || "No response";
            return NextResponse.json({ text });

        } else if (provider === "deepseek") {
            const response = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model || "deepseek-chat",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...apiMessages,
                    ],
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json(
                    { error: `DeepSeek API error: ${response.status}`, details: err },
                    { status: response.status }
                );
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || "No response";
            return NextResponse.json({ text });

        } else if (provider === "gemini") {
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model || "gemini-2.0-flash",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...apiMessages,
                    ],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json(
                    { error: `Gemini API error: ${response.status}`, details: err },
                    { status: response.status }
                );
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || "No response";
            return NextResponse.json({ text });

        } else {
            // OpenAI (default)
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...apiMessages,
                    ],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json(
                    { error: `OpenAI API error: ${response.status}`, details: err },
                    { status: response.status }
                );
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || "No response";
            return NextResponse.json({ text });
        }

    } catch (err) {
        return NextResponse.json(
            { error: err.message || "Internal error" },
            { status: 500 }
        );
    }
}
