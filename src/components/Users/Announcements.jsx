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
          setAnnouncements(data.reverse()); // newest first
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
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div style={styles.header}></div>
      <div style={styles.scrollWrapper}>
        <div style={styles.cardContainer}>
          {announcements.map((note, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.cardTitle}>
                {note.title || `📢 Announcement ${index + 1}`}
              </h3>
              <div
                style={styles.cardMessage}
                dangerouslySetInnerHTML={{
                  __html: note.content || note.message || note,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "50vh",
    padding: "5rem 10rem",
    fontFamily: "Segoe UI, sans-serif",
    color: "#fff",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  scrollWrapper: {
    maxHeight: "600px",
    overflowY: "auto",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1.5rem",
  },
  card: {
    background: "linear-gradient(to right,rgb(18, 145, 111), #99f2c8)",
    border: "1px solid #ffffff33",
    borderRadius: "12px",
    padding: "1rem",
    width: "300px",
    backdropFilter: "blur(5px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
    transition: "transform 0.2s ease-in-out",
  },
  cardTitle: {
    fontSize: "2rem",
    color: "black",
    marginBottom: "0.5rem",
  },
  cardMessage: {
    fontSize: "1rem",
    color: "#f5f5f5",
  },
};
export default Announcements;
