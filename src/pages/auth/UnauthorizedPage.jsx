import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>403 - Unauthorized</h2>
        <p>You do not have permission to access this page.</p>
        <Link to="/" style={styles.button}>
          Go to Login
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ff512f, #dd2476)",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "8px",
    textAlign: "center",
  },
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    background: "#dd2476",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },
};