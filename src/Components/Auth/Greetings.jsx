import { useState } from "react";
import logoimg from "../../assets/pclogotxt.png"; // Adjust path if needed
import "../../Styles/Greetings.css";
import Login from "./Login/Login";
import Register from "./Register/register";

function Greetings() {
  const [activeView, setActiveView] = useState("welcome");

  const handleCreateAccount = () => setActiveView("register");
  const handleLogin = () => setActiveView("login");
  const handleBack = () => setActiveView("welcome");

  return (
    <div className="card">
      <div className="logo-container">
        <img src={logoimg} alt="PopChat Logo" />
      </div>

      {activeView === "welcome" && (
        <>
          <div className="content">
            <h1>Welcome to PopChat!</h1>
            <p>The newest messaging platform for your friends & peers!</p>
            <p>
              Collaborate, communicate and <strong>Connect in a Pop!</strong>
            </p>
          </div>
          <div className="cta">
            <button className="create-account" onClick={handleCreateAccount}>
              Create an account
            </button>
            <button className="login" onClick={handleLogin}>
              Log in
            </button>
          </div>
        </>
      )}

      {activeView === "login" && <Login onBack={handleBack} />}
      {activeView === "register" && <Register onBack={handleBack} />}
    </div>
  );
}

export default Greetings;