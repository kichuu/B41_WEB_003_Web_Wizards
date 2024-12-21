const HUGGING_FACE_API_TOKEN = "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";

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

async function generateText(prompt) {
    const apiUrl = "https://api-inference.huggingface.co/models/gpt2";

    const headers = {
        Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
        "Content-Type": "application/json",
    };

    const body = JSON.stringify({
        inputs: prompt,
        options: {
            max_length: 150,
            temperature: 0.7,
        },
    });

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: body,
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            return "Error: Unable to get a response.";
        }

        const data = await response.json();
        console.log("API Success Response:", data);
        return data.generated_text || "I couldn't generate a response.";
    } catch (error) {
        console.error("Error in generateText function:", error);
        return "Error: Something went wrong with the API call.";
    }
}

function addMessage(content, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type === "user" ? "user-message" : "ai-message");
    messageDiv.textContent = content;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prompt = userInput.value.trim();
    if (!prompt) return;

    addMessage(prompt, "user");
    userInput.value = "";

    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("message", "ai-message");
    loadingMessage.textContent = "Loading...";
    chatBox.appendChild(loadingMessage);

    const response = await generateText(prompt);

    loadingMessage.remove();
    addMessage(response, "ai");
});
