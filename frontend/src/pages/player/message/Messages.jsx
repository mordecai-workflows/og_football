import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Spinner from "../../../components/spinner/Spinner";
import styles from "./message.module.css";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function MessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [conversationsPage, setConversationsPage] = useState(1); // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Conversations per page
  const [showNewConvForm, setShowNewConvForm] = useState(false);
  const [newParticipants, setNewParticipants] = useState("");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  const fetchConversations = async () => {
    setLoadingConvs(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/message/conversations?page=${conversationsPage}&limit=${pageSize}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to load conversations");
      const data = await res.json();

      setConversations(data.data);

      if (data.data && data.data.length > 0) {
        setSelectedConvId(data.data[0].id);
      } else {
        setSelectedConvId(null);
      }

      setTotalPages(data.meta.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingConvs(false);
    }
  };

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    const participantsArray = newParticipants
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (participantsArray.length === 0) {
      toast.error("Please enter at least one participant.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/message/conversations`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: participantsArray }),
      });

      const newConv = await res.json();

      if (!res.ok)
        throw new Error(newConv.error || "Failed to create conversation");

      // Refresh conversations list and select new conversation
      await fetchConversations();
      setSelectedConvId(newConv.id);
      setShowNewConvForm(false);
      setNewParticipants("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Load conversations on mount and page change
  useEffect(() => {
    fetchConversations();
  }, [conversationsPage]);

  // Load messages for the selected conversation
  useEffect(() => {
    if (!selectedConvId) return;

    const fetchMessages = async () => {
      setLoadingMsgs(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_URL}/message/conversations/${selectedConvId}/messages`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();

        setMessages(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingMsgs(false);
      }
    };

    fetchMessages();
  }, [selectedConvId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(
        `${API_URL}/message/conversations/${selectedConvId}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newMessage.trim(),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to send message");
      const sentMessage = await res.json();
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar active="messaging" />

      <div className={styles.main}>
        <button
          className={styles.newConvBtn}
          onClick={() => setShowNewConvForm((v) => !v)}
          aria-expanded={showNewConvForm}
          aria-controls="new-conv-form"
        >
          {showNewConvForm ? "Cancel" : "New Conversation"}
        </button>

        {showNewConvForm && (
          <form
            id="new-conv-form"
            className={styles.newConvForm}
            onSubmit={handleCreateConversation}
          >
            <label htmlFor="participantsInput">
              Participants (comma separated user IDs or emails):
            </label>
            <input
              id="participantsInput"
              type="text"
              value={newParticipants}
              onChange={(e) => setNewParticipants(e.target.value)}
              placeholder="e.g. user1,user2,user3"
              required
            />
            <button type="submit">Create</button>
          </form>
        )}

        {loadingConvs ? (
          <div className={styles.loading}>
            <Spinner />
            <br />
            <p>Loading conversations...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>Error loading messages: {error}</div>
        ) : (
          <>
            {/* Conversations list and chat area */}
            <h2 className={styles.conversationsTitle}>Conversations</h2>

            <nav className={styles.conversationsNav} aria-label="Conversations">
              <ul className={styles.conversationList} role="listbox">
                {conversations.map((conv) => (
                  <li
                    key={conv.id}
                    className={
                      conv.id === selectedConvId ? styles.active : undefined
                    }
                    onClick={() => setSelectedConvId(conv.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedConvId(conv.id);
                      }
                    }}
                    aria-selected={conv.id === selectedConvId}
                    role="option"
                  >
                    {conv.name || conv.participants.slice([1]).join(", ")}
                  </li>
                ))}
              </ul>
            </nav>

            <main className={styles.chatArea} aria-live="polite">
              {loadingMsgs ? (
                <>
                  <Spinner />
                  <p>Loading messages...</p>
                </>
              ) : selectedConvId ? (
                <>
                  <div className={styles.messages}>
                    {messages.length === 0 ? (
                      <p>No messages yet. Start the conversation!</p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`${styles.message} ${
                            msg.isOwn ? styles.ownMessage : ""
                          }`}
                        >
                          <div className={styles.messageText}>{msg.text}</div>
                          <div className={styles.messageTime}>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className={styles.inputArea}>
                    <textarea
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      aria-label="Type your message"
                    />
                    <button
                      onClick={handleSendMessage}
                      aria-label="Send message"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <p>Select a conversation to start chatting.</p>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}
