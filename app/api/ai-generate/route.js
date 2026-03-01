import JSON5 from 'json5';
import { NextResponse } from "next/server";

/*
  POST /api/ai-generate
  Body: { provider, prompt, apiKeyRaw }

  Uses AI to generate a full project structure (title, description, tasks, notes).
  Returns the parsed data to the client, which saves it to localStorage.
*/
export async function POST(request) {
    try {
        const { provider, prompt, apiKeyRaw } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
        }

        const apiKey = apiKeyRaw;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing API key. Add one in Settings." }, { status: 400 });
        }

        const systemPrompt = `You are a creative world builder and project manager. The user wants to build something: "${prompt}".
Your job is to generate a comprehensive project structure.

You MUST reply with ONLY a valid JSON object matching this exact structure, with no markdown formatting, no code blocks, and no other text:
{
  "title": "A catchy, short title for the island/project (max 4 words)",
  "description": "A detailed, exciting 2-3 sentence description of what this project is and how it works.",
  "tasks": [
    { "text": "Task step 1", "done": false },
    { "text": "Task step 2", "done": false },
    { "text": "Task step 3", "done": false },
    { "text": "Task step 4", "done": false },
    { "text": "Task step 5", "done": false }
  ],
  "notes": "Here is an initial planning note or rough draft to get you started..."
}`;

        let jsonText = "";

        if (provider === "anthropic") {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json({ error: `Anthropic API error: ${response.status}`, details: err }, { status: response.status });
            }

            const data = await response.json();
            jsonText = data.content?.[0]?.text || "";
        } else if (provider === "deepseek") {
            const response = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ]
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json({ error: `DeepSeek API error: ${response.status}`, details: err }, { status: response.status });
            }

            const data = await response.json();
            jsonText = data.choices?.[0]?.message?.content || "";
        } else if (provider === "gemini") {
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gemini-2.0-flash",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ],
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json({ error: `Gemini API error: ${response.status}`, details: err }, { status: response.status });
            }

            const data = await response.json();
            jsonText = data.choices?.[0]?.message?.content || "";
        } else {
            // OpenAI default
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                return NextResponse.json({ error: `OpenAI API error: ${response.status}`, details: err }, { status: response.status });
            }

            const data = await response.json();
            jsonText = data.choices?.[0]?.message?.content || "";
        }

        // Parse LLM response
        let projectData;
        try {
            const cleanStr = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
            projectData = JSON5.parse(cleanStr);
        } catch (e) {
            console.error("Failed to parse", e, jsonText);
            return NextResponse.json({ error: "Failed to parse AI response as JSON", details: jsonText }, { status: 500 });
        }

        // Add IDs to tasks
        const tasksWithIds = (projectData.tasks || []).map(t => ({ id: Date.now() + Math.random(), text: t.text, done: !!t.done }));

        // Return project data to client (client saves to localStorage)
        return NextResponse.json({
            success: true,
            project: {
                title: projectData.title || "Untitled AI Island",
                description: projectData.description || "",
                tasks: tasksWithIds,
                notes: projectData.notes || "",
            }
        });

    } catch (err) {
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
