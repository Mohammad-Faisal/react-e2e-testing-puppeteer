// Create a login form with a username and password field and a submit button. This is a functional component

import React, { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username: " + username + " Password: " + password);
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <div>
      <h1 id="page-title">{isLoggedIn ? "Logged In" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit" id="btn-submit">
          Login
        </button>
      </form>
    </div>
  );
};
