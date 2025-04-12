import React, { useEffect, useState } from "react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    "Admin needs to give Announcements",
    "New tournament fixtures will be available soon.",
    "Registration for upcoming events is open now!",
  ]);

  // Placeholder: Replace with your actual backend endpoint later
  useEffect(() => {
    fetch("http://localhost:8080/announcements") // Replace with your endpoint
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch announcements");
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data);
        }
      })
      .catch((err) => {
        console.log("Using default announcements:", err.message);
      });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📢 Announcements</h1>
        <ul style={styles.list}>
          {announcements.map((note, idx) => (
            <li key={idx} style={styles.item}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "90%",
    maxWidth: "500px",
  },
  title: {
    fontSize: "2rem",
    color: "#2a5298",
    marginBottom: "1rem",
  },
  list: {
    textAlign: "left",
    paddingLeft: "1rem",
  },
  item: {
    marginBottom: "0.75rem",
    fontSize: "1.1rem",
    color: "#444",
  },
};

export default Announcements;
