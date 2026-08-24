import React, { useState } from "react";
import '../styling/gemini.css'; // Tumhara CSS path



function AiChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userText = input;

  setMessages((prev) => [
    ...prev,
    { text: userText, sender: "user" },
  ]);

  setInput("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:1111/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "AI request failed");
    }

    setMessages((prev) => [
      ...prev,
      { text: data.answer, sender: "bot" },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      { text: `Error: ${error.message}`, sender: "bot" },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="g-chat-main-wrapper">
      <div className="g-chat-header">
        <h2>✨ Your AI Assistant</h2>
      </div>

      
      <div className="g-chat-display-window">
        {messages.length === 0 ? (
          <div className="g-chat-empty-state">
            <p>Ask Anything About Job Portal ?</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`g-chat-message-row ${msg.sender === "user" ? "g-chat-user-align" : "g-chat-bot-align"}`}>
              <div className={`g-chat-text-bubble ${msg.sender === "user" ? "g-chat-user-theme" : "g-chat-bot-theme"}`}>
                <strong>{msg.sender === "user" ? "You" : "Gemini"}:</strong>
                <p className="g-chat-bubble-paragraph">{msg.text}</p>
              </div>
            </div>
          ))
        )}

        
        {loading && (
          <div className="g-chat-message-row g-chat-bot-align">
            <div className="g-chat-text-bubble g-chat-bot-theme g-chat-pulse-animation">
              <p className="g-chat-bubble-paragraph"><i>Assistant is thinking...</i></p>
            </div>
          </div>
        )}
      </div>

      {/* --- Input Form Bar --- */}
      <form onSubmit={handleSendMessage} className="g-chat-input-form-bar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="g-chat-text-input-field"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} className="g-chat-submit-action-btn">
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default AiChat;