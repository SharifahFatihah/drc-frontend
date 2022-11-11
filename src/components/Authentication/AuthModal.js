import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import Login from "./Login";
import Signup from "./Signup";
import { AppBar, makeStyles } from "@material-ui/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";

const useStyle = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    color: "white",
    boxShadow: 24,
    borderRadius: 10,
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
  },
}));

export default function AuthModal() {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState(0);

  const { setAlert, open, setOpen } = CryptoState();

  const classes = useStyle();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Welcome ${res.user.email}`,
          type: "success",
        });

        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
      });
  };
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{
          backgroundColor: "#FFE227",
          color: "black",
          fontFamily: "VT323",
          fontSize: 16,
        }}
      >
        Login
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.paper}>
          <AppBar
            position="static"
            style={{
              backgroundColor: "transparent",
              color: "white",
            }}
          >
            <Tabs variant="fullWidth" value={value} onChange={handleChange}>
              <Tab
                style={value === 0 ? { color: "" } : { color: "white" }}
                label="Login"
              />
              <Tab
                style={value === 1 ? { color: "" } : { color: "white" }}
                label="Sign Up"
              />
            </Tabs>
            <div style={{ padding: 20 }}>
              {value === 0 && <Login handleClose={handleClose} />}
              {value === 1 && <Signup handleClose={handleClose} />}
            </div>

            <Box className={classes.google}>
              <span>OR</span>
              <Button
                variant="contained"
                onClick={signInWithGoogle}
                style={{ backgroundColor: "Blue" }}
              >
                Sign In With Google
              </Button>
            </Box>
          </AppBar>
        </div>
      </Modal>
    </div>
  );
}
