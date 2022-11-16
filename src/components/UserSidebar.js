import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { CryptoState } from "../CryptoContext";
import { Avatar, dividerClasses } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ImportContactsSharp } from "@material-ui/icons";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "black",
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
    alignItems: "flex-start",
    gap: 12,
    overFlowY: "scroll",
    fontFamily: "VT323",
    fontSize: 25,
    color: "white",
    fontWeight: "bolder",
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
                    backgroundColor: "yellow",
                  }}
                />{" "}
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {" "}
                  {user.displayName || user.email}
                </span>
                <div
                  style={{
                    color: "white",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                    fontSize: 20,
                  }}
                >
                  Assets
                </div>
                <div
                  style={{
                    width: "240px",
                  }}
                >
                  <hr></hr>
                </div>
                <div className={classes.watchlist}>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div style={{ display: "flex", alignItems: "center" }}>
                         <div style={{marginRight:20}}><img src={coin.image} height="25" />
                          </div> 
                          {coin.name}
                        </div>
                      );
                  })}
                </div>
              </div>
              <Button
                onClick={logout}
                style={{
                  background: "yellow",
                  marginRight:80,
                  marginLeft:80,
                  display:"flex",
                  alignItems:"center",
                  // outlineStyle:"outside",
                  // outlineColor: "black",
                  // outlineWidth: "thick",
                  
                }}
              >
                <a style={{ color: "black", fontWeight: "bolder" }}>Logout</a>
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
