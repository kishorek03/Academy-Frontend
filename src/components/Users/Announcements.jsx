import React, { useEffect, useState } from "react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token not found in localStorage");
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:8080/profile/announcements", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch announcements");
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data.reverse());
        }
      })
      .catch((err) => {
        console.log("Using fallback announcements:", err.message);
        setAnnouncements([
          { title: "🏓 Stay tuned!", message: "Admin will post updates soon." },
          { title: "Fixture Update", message: "New tournament fixtures are on the way." },
        ]);
      });
  }, []);

  return (
    <div style={styles.container}>
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <h1 style={styles.title}>🏓 Table Tennis Announcements</h1>
      <div style={styles.grid}>
        {announcements.map((note, index) => (
          <div key={index} style={styles.card}>
            <h2 style={styles.cardTitle}>
              {note.title || `📢 Announcement ${index + 1}`}
            </h2>
            <p
              style={styles.cardMessage}
              dangerouslySetInnerHTML={{
                __html: note.content || note.message || note,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "4rem 2rem",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "100vh",
    overflowY: "auto",
  },
  title: {
    textAlign: "center",
    fontSize: "3rem",
    color: "black",
    marginBottom: "2rem",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "white",
    border: "2px solid #047857",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "1.5rem",
    color: "#065f46",
    marginBottom: "0.5rem",
  },
  cardMessage: {
    fontSize: "1rem",
    color: "#333",
    lineHeight: "1.5",
  },
};

export default Announcements;
