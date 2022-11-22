import { Box, Button, TextField } from "@material-ui/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";
import LogoIcon from "../../asset/logoicon.png";
import LogoWord from "../../asset/logoword.png";

function Login({ handleClose }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setAlert } = CryptoState();

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Please fill in the required information",
        type: "error",
      });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setAlert({
        open: true,
        message: `Welcome back ${result.user.email}`,
        type: "success",
      });
      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginLeft: "200px",
        marginRight: "200px",
        marginTop: "50px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={LogoIcon} width="40" />
        <img src={LogoWord} width="200" />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1>Welcome Back</h1>
      </div>
      <div
        style={{
          display: "flex",

          justifyContent: "center",
        }}
      >
        <span>Continue with google or enter your details</span>
      </div>
      <label>Email address</label>
      <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <label>Password</label>
      <TextField
        variant="outlined"
        type="password"
        label="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        style={{ backgroundColor: "purple", color: "white" }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  );
}

export default Login;
