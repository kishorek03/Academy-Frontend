import React, { useState } from "react";
import axios from "axios";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "100px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #ddd",
  },
  select: {
    padding: "10px",
    marginBottom: "10px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "10px 16px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    color: "white",
  },
  generateBtn: {
    backgroundColor: "#007BFF",
  },
  postBtn: {
    backgroundColor: "#28A745",
  },
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  fixtureBox: {
    backgroundColor: "#e3ffe3",
    color: "#064d06",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    textAlign: "center",
    fontWeight: "500",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
};

const FixtureMaker = () => {
  const [type, setType] = useState("singles");
  const [players, setPlayers] = useState("");
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);

  const roundRobin = (list) => {
    const fixtures = [];
    const players = [...list];

    if (players.length % 2 !== 0) players.push("BYE"); // handle odd

    const totalRounds = players.length - 1;
    const half = players.length / 2;

    for (let round = 0; round < totalRounds; round++) {
      for (let i = 0; i < half; i++) {
        const home = players[i];
        const away = players[players.length - 1 - i];
        if (home !== "BYE" && away !== "BYE") {
          fixtures.push(`${home} vs ${away}`);
        }
      }
      // rotate array
      players.splice(1, 0, players.pop());
    }

    return fixtures;
  };

  const roundRobinDoubles = (teams) => {
    const fixtures = [];

    if (teams.length % 2 !== 0) teams.push(["BYE", "BYE"]);

    const totalRounds = teams.length - 1;
    const half = teams.length / 2;

    for (let round = 0; round < totalRounds; round++) {
      for (let i = 0; i < half; i++) {
        const team1 = teams[i];
        const team2 = teams[teams.length - 1 - i];

        const allPlayers = [...team1, ...team2];
        const uniquePlayers = new Set(allPlayers);

        if (!uniquePlayers.has("BYE") && uniquePlayers.size === 4) {
          fixtures.push(`${team1[0]} & ${team1[1]} vs ${team2[0]} & ${team2[1]}`);
        }
      }
      teams.splice(1, 0, teams.pop());
    }

    return fixtures;
  };

  const handleGenerateFixtures = () => {
    const names = players
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name);

    if (type === "singles") {
      const generated = roundRobin(names);
      setFixtures(generated);
    } else {
      const teams = [];
      for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
          teams.push([names[i], names[j]]);
        }
      }
      const generated = roundRobinDoubles(teams);
      setFixtures(generated);
    }
  };

  const handlePostFixtures = async () => {
    try {
      setLoading(true);
      await axios.post("/postAnnouncement", {
        title: `MY TT Academy ${type.toUpperCase()} Fixtures`,
        content: fixtures.join("\n"),
      });
      alert("Fixtures posted successfully!");
      setFixtures([]);
      setPlayers("");
    } catch (error) {
      console.error("Error posting fixtures:", error);
      alert("Failed to post fixtures.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <select
          style={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="singles">Singles</option>
          <option value="doubles">Doubles</option>
        </select>

        <textarea
          style={styles.textarea}
          value={players}
          onChange={(e) => setPlayers(e.target.value)}
          placeholder="Enter player names, one per line"
        />

        <div style={styles.buttonGroup}>
          <button
            onClick={handleGenerateFixtures}
            style={{ ...styles.button, ...styles.generateBtn }}
          >
            Generate Fixtures
          </button>
          <button
            onClick={handlePostFixtures}
            disabled={loading || fixtures.length === 0}
            style={{
              ...styles.button,
              ...styles.postBtn,
              ...(loading || fixtures.length === 0 ? styles.disabled : {}),
            }}
          >
            {loading ? "Posting..." : "Post Fixtures"}
          </button>
        </div>
      </div>

      {fixtures.length > 0 && (
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }}>
            Generated Fixtures
          </h2>
          {fixtures.map((fixture, index) => (
            <div key={index} style={styles.fixtureBox}>
              {fixture}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FixtureMaker;
