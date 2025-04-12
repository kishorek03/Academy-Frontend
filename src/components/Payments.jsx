import React from "react";

const Payments = () => {
  const loadRazorpay = (amountInRupees, label) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "rzp_test_77vK8RP2JmefJ1",
        amount: amountInRupees * 100,
        currency: "INR",
        name: "Table Tennis Academy",
        description: label,
        handler: function (response) {
          alert("Payment Successful! ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "Player Name",
          email: "player@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#00796b", // Teal theme
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };

  return (
    <div style={styles.page}>
      <style>{`
        .hover-button:hover {
          background-color: #004d40;
          transform: scale(1.05);
        }
      `}</style>
      <div style={styles.card}>
        <h1 style={styles.title}>🏓 TT Academy Payments</h1>
        <p style={styles.subtitle}>Pick your tournament or fee below</p>
        <div style={styles.buttonGroup}>
          <button
            className="hover-button"
            style={styles.button}
            onClick={() => loadRazorpay(2000, "Membership Fee – ₹2000")}
          >
            🧢 Membership Fee – ₹2000
          </button>
          <button
            className="hover-button"
            style={styles.button}
            onClick={() => loadRazorpay(250, "Saturday Smash – ₹250")}
          >
            🏓 Saturday Smash – ₹250
          </button>
          <button
            className="hover-button"
            style={styles.button}
            onClick={() => loadRazorpay(250, "Sunday Rally – ₹250")}
          >
            🏓 Sunday Rally – ₹250
          </button>
        </div>
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
    padding: "1rem",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    padding: "3rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "100%",
    maxWidth: "700px",
    transition: "transform 0.3s ease",
  },
  title: {
    fontSize: "2.7rem",
    color: "#004d40",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  button: {
    padding: "0.9rem 1.5rem",
    fontSize: "1.1rem",
    borderRadius: "12px",
    border: "none",
    background: "#00796b",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Payments;
