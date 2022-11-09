import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { CryptoState } from "../CryptoContext";
import { Avatar } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  watchlist: {
    flex: 1,
    width: "100%",
    padding: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overFlowY: "scroll",
  },
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, watchlist, coins } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logout = () => {
    signOut(auth);
    setAlert({
      open: "true",
      message: "See you again!",
      type: "success",
    });
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              cursor: "pointer",
              backgroundColor: "purple",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                {" "}
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  style={{
                    height: 200,
                    width: 200,
                    cursor: "pointer",
                    backgroundColor: "purple",
                  }}
                />{" "}
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {" "}
                  {user.displayName || user.email}
                </span>
                <div className={classes.watchlist}>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return <span>{coin.name}</span>;
                  })}
                </div>
              </div>
              <Button variant="contained" onClick={logout}>
                Logout
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
