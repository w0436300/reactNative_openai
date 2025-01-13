import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const API_KEY = process.env.OPEN_AI_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID;
const JSON_FILE = process.env.JSON_FILE;
const PDF_FILE = process.env.PDF_FILE;

const get_artist = (args) => "Bill";
const get_rarity = (args) => "Common";

let openai = null;
let thread = null;

// Initialize Chat Function
export async function initializeChat() {
    openai = new OpenAI({ apiKey: API_KEY });
    thread = await openai.beta.threads.create();
    console.log("Thread initialized:", thread.id);
}

// Send Chat Message Function
export async function sendChatMessage(userQuestion) {
    try {
        if (userQuestion.includes("like") || userQuestion.includes("favour")) {
            console.log("Answering with JSON file context...");
            await openai.beta.threads.messages.create(thread.id, {
                role: "user",
                content: userQuestion,
                file_ids: [JSON_FILE],
            });
        } else if (userQuestion.includes("stat") || userQuestion.includes("hp")) {
            console.log("Answering with PDF file context...");
            await openai.beta.threads.messages.create(thread.id, {
                role: "user",
                content: userQuestion,
                file_ids: [PDF_FILE],
            });
        } else {
            console.log("Answering without any specific file...");
            await openai.beta.threads.messages.create(thread.id, {
                role: "user",
                content: userQuestion,
            });
        }

        let run = await openai.beta.threads.runs.create(thread.id, { assistant_id: ASSISTANT_ID });
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        while (runStatus.status !== "completed" && runStatus.status !== "requires_action") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        if (runStatus.status === "requires_action") {
            const toolCall = runStatus.required_action.submit_tool_outputs.tool_calls[0];
            const functName = toolCall.function.name;
            const functArgs = JSON.parse(toolCall.function.arguments);

            let output;
            if (functName === "get_artist") {
                output = get_artist(functArgs);
            } else if (functName === "get_rarity") {
                output = get_rarity(functArgs);
            }

            run = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
                tool_outputs: [
                    {
                        tool_call_id: toolCall.id,
                        output,
                    },
                ],
            });

            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            while (runStatus.status === "in_progress" || runStatus.status === "queued") {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            }
        }

        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessageForRun = messages.data
            .filter((message) => message.run_id === run.id && message.role === "assistant")
            .pop();

        return lastMessageForRun ? lastMessageForRun.content[0].text.value : null;
    } catch (error) {
        console.error("Error in sendChatMessage:", error);
        throw error;
    }
}
