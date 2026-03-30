import { useState, useEffect } from "react";
 
const API_URL = "http://backend.dev.svc.cluster.local:5000/api/items" || "http://localhost:5000/api/items";
 
export default function App() {

  const [message, setMessage] = useState("");

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
 
  // GET - Fetch all items

  const fetchItems = async () => {

    setFetching(true);

    setError("");

    try {

      const res = await fetch(API_URL);

      const data = await res.json();

      if (data.success) {

        setItems(data.items);

      } else {

        setError("Failed to fetch items.");

      }

    } catch (err) {

      setError("Cannot connect to server. Make sure the backend is running.");

    } finally {

      setFetching(false);

    }

  };
 
  // POST - Submit a new item

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!message.trim()) return;
 
    setLoading(true);

    setError("");

    setSuccessMsg("");
 
    try {

      const res = await fetch(API_URL, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ message }),

      });

      const data = await res.json();
 
      if (data.success) {

        setMessage("");

        setSuccessMsg(`Item #${data.item.id} added successfully!`);

        fetchItems(); // Refresh list after post

        setTimeout(() => setSuccessMsg(""), 3000);

      } else {

        setError(data.error || "Failed to submit.");

      }

    } catch (err) {

      setError("Cannot connect to server. Make sure the backend is running.");

    } finally {

      setLoading(false);

    }

  };
 
  useEffect(() => {

    fetchItems();

  }, []);
 
  const formatTime = (iso) => {

    const d = new Date(iso);

    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  };
 
  return (
<div style={styles.bg}>
<div style={styles.container}>

        {/* Header */}
<div style={styles.header}>
<div style={styles.dot} />
<h1 style={styles.title}>Message Board</h1>
<p style={styles.subtitle}>POST &amp; GET — No Database</p>
</div>
 
        {/* POST Form */}
<div style={styles.card}>
<div style={styles.cardLabel}>POST /api/items</div>
<form onSubmit={handleSubmit} style={styles.form}>
<input

              type="text"

              placeholder="Type your message here..."

              value={message}

              onChange={(e) => setMessage(e.target.value)}

              style={styles.input}

              disabled={loading}

              maxLength={200}

            />
<button

              type="submit"

              style={{

                ...styles.btn,

                ...(loading ? styles.btnDisabled : {}),

              }}

              disabled={loading || !message.trim()}
>

              {loading ? "Sending..." : "Send"}
</button>
</form>
<div style={styles.charCount}>{message.length}/200</div>
 
          {successMsg && <div style={styles.success}>✅ {successMsg}</div>}

          {error && <div style={styles.error}>⚠️ {error}</div>}
</div>
 
        {/* GET Data Display */}
<div style={styles.card}>
<div style={styles.cardLabelRow}>
<span style={{ ...styles.cardLabel, color: "#34d399" }}>GET /api/items</span>
<button

              onClick={fetchItems}

              style={styles.refreshBtn}

              disabled={fetching}
>

              {fetching ? "⟳" : "↻ Refresh"}
</button>
</div>
 
          {fetching && items.length === 0 ? (
<p style={styles.empty}>Loading...</p>

          ) : items.length === 0 ? (
<p style={styles.empty}>No messages yet. Submit one above!</p>

          ) : (
<ul style={styles.list}>

              {items.map((item) => (
<li key={item.id} style={styles.listItem}>
<div style={styles.itemHeader}>
<span style={styles.itemId}>#{item.id}</span>
<span style={styles.itemTime}>{formatTime(item.timestamp)}</span>
</div>
<p style={styles.itemMsg}>{item.message}</p>
</li>

              ))}
</ul>

          )}
</div>
 
        <p style={styles.note}>

          Data is stored in-memory on the Node.js server — clears on restart.
</p>
</div>
</div>

  );

}
 
const styles = {

  bg: {

    minHeight: "100vh",

    background: "#0f0f11",

    display: "flex",

    alignItems: "flex-start",

    justifyContent: "center",

    padding: "40px 16px",

    fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",

  },

  container: {

    width: "100%",

    maxWidth: "560px",

    display: "flex",

    flexDirection: "column",

    gap: "20px",

  },

  header: {

    textAlign: "center",

    paddingBottom: "8px",

  },

  dot: {

    width: "10px",

    height: "10px",

    borderRadius: "50%",

    background: "#6366f1",

    margin: "0 auto 16px",

    boxShadow: "0 0 20px #6366f1",

  },

  title: {

    color: "#f1f1f3",

    fontSize: "28px",

    fontWeight: "700",

    margin: "0 0 6px",

    letterSpacing: "-0.5px",

  },

  subtitle: {

    color: "#555",

    fontSize: "13px",

    margin: 0,

    letterSpacing: "1px",

    textTransform: "uppercase",

  },

  card: {

    background: "#18181b",

    border: "1px solid #27272a",

    borderRadius: "12px",

    padding: "20px 24px",

  },

  cardLabel: {

    fontSize: "11px",

    color: "#a78bfa",

    letterSpacing: "1.5px",

    textTransform: "uppercase",

    marginBottom: "14px",

    display: "block",

  },

  cardLabelRow: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "14px",

  },

  form: {

    display: "flex",

    gap: "10px",

  },

  input: {

    flex: 1,

    background: "#0f0f11",

    border: "1px solid #3f3f46",

    borderRadius: "8px",

    padding: "10px 14px",

    color: "#f1f1f3",

    fontSize: "14px",

    fontFamily: "inherit",

    outline: "none",

    transition: "border 0.2s",

  },

  btn: {

    background: "#6366f1",

    color: "#fff",

    border: "none",

    borderRadius: "8px",

    padding: "10px 20px",

    fontSize: "14px",

    fontFamily: "inherit",

    fontWeight: "600",

    cursor: "pointer",

    whiteSpace: "nowrap",

    transition: "background 0.2s",

  },

  btnDisabled: {

    background: "#3f3f46",

    cursor: "not-allowed",

  },

  charCount: {

    fontSize: "11px",

    color: "#52525b",

    textAlign: "right",

    marginTop: "6px",

  },

  success: {

    marginTop: "10px",

    color: "#34d399",

    fontSize: "13px",

    background: "#0d2d1e",

    border: "1px solid #166534",

    borderRadius: "6px",

    padding: "8px 12px",

  },

  error: {

    marginTop: "10px",

    color: "#f87171",

    fontSize: "13px",

    background: "#2d0d0d",

    border: "1px solid #991b1b",

    borderRadius: "6px",

    padding: "8px 12px",

  },

  refreshBtn: {

    background: "transparent",

    border: "1px solid #3f3f46",

    borderRadius: "6px",

    color: "#a1a1aa",

    fontSize: "12px",

    padding: "4px 10px",

    cursor: "pointer",

    fontFamily: "inherit",

  },

  list: {

    listStyle: "none",

    margin: 0,

    padding: 0,

    display: "flex",

    flexDirection: "column",

    gap: "10px",

    maxHeight: "320px",

    overflowY: "auto",

  },

  listItem: {

    background: "#0f0f11",

    border: "1px solid #27272a",

    borderRadius: "8px",

    padding: "10px 14px",

  },

  itemHeader: {

    display: "flex",

    justifyContent: "space-between",

    marginBottom: "4px",

  },

  itemId: {

    fontSize: "11px",

    color: "#a78bfa",

    fontWeight: "600",

  },

  itemTime: {

    fontSize: "11px",

    color: "#52525b",

  },

  itemMsg: {

    margin: 0,

    color: "#d4d4d8",

    fontSize: "14px",

    lineHeight: "1.5",

    wordBreak: "break-word",

  },

  empty: {

    color: "#52525b",

    fontSize: "14px",

    textAlign: "center",

    padding: "20px 0",

    margin: 0,

  },

  note: {

    textAlign: "center",

    color: "#3f3f46",

    fontSize: "11px",

    margin: 0,

  },

};
 