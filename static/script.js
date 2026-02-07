const chat = document.getElementById("chat");
const historyDiv = document.getElementById("history");
const input = document.getElementById("userInput");

let chats = JSON.parse(localStorage.getItem("farmerChats")) || [];
let currentChatIndex = null;

/* ================= ENTER KEY ================= */
function handleEnter(e) {
    if (e.key === "Enter") sendMessage();
}

/* ================= SEND MESSAGE ================= */
function sendMessage() {
    const userMsg = input.value.trim();
    if (userMsg === "") return;

    appendMessage(userMsg, "user");
    input.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
    })
    .then(res => res.json())
    .then(data => {
        appendMessage(data.reply, "bot");
        saveCurrentChat();
    });
}

/* ================= APPEND MESSAGE ================= */
function appendMessage(text, type) {
    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.innerHTML = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

/* ================= NEW CHAT ================= */
function newChat() {
    if (chat.innerHTML.trim() !== "") {
        chats.push(chat.innerHTML);
        localStorage.setItem("farmerChats", JSON.stringify(chats));
    }

    chat.innerHTML = `
        <div class="message bot">
            👋 Welcome to Farmer Advisory Chatbot.<br>
            Ask about crops, kharif, rabi, soil, irrigation.
        </div>
    `;
    currentChatIndex = null;
    loadHistory();
}

/* ================= SAVE CURRENT CHAT ================= */
function saveCurrentChat() {
    if (currentChatIndex === null) {
        chats.push(chat.innerHTML);
        currentChatIndex = chats.length - 1;
    } else {
        chats[currentChatIndex] = chat.innerHTML;
    }
    localStorage.setItem("farmerChats", JSON.stringify(chats));
    loadHistory();
}

/* ================= LOAD HISTORY ================= */
function loadHistory() {
    historyDiv.innerHTML = "";

    chats.forEach((c, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <span onclick="openChat(${i})">Chat ${i + 1}</span>
            <button onclick="deleteChat(${i})">🗑️</button>
        `;
        historyDiv.appendChild(div);
    });
}

/* ================= OPEN CHAT ================= */
function openChat(index) {
    chat.innerHTML = chats[index];
    currentChatIndex = index;
}

/* ================= DELETE CHAT ================= */
function deleteChat(index) {
    chats.splice(index, 1);
    localStorage.setItem("farmerChats", JSON.stringify(chats));

    if (currentChatIndex === index) {
        chat.innerHTML = "";
        currentChatIndex = null;
    }

    loadHistory();
}

/* ================= VOICE INPUT ================= */
function startVoice() {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Use Chrome for voice input");
        return;
    }

    const rec = new webkitSpeechRecognition();
    rec.lang = "en-IN";
    rec.start();

    rec.onresult = e => {
        input.value = e.results[0][0].transcript;
    };
}

/* ================= INIT ================= */
loadHistory();
