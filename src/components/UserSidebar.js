import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { CryptoState } from "../CryptoContext";
import { Avatar } from "@mui/material";
import { makeStyles, Typography } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

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

  const { user, setAlert, watchlist, coins, balance } = CryptoState();

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
      open: true,
      message: "See you again!",
      type: "success",
    });
  };

  const resetBalance = async () => {
    const walletRef = await doc(db, "wallet", user.uid);

    try {
      await setDoc(walletRef, {
        balances: { usd: 10000, btc: 0 },
      });

      setAlert({
        open: true,
        message: `You have reset your balance`,
        type: "success",
      });
    } catch (error) {}
  };

  const resetFirstBalance = async () => {
    const walletRef = await doc(db, "wallet", user.uid);

    if (balance && !balance.usd && !balance.btc) {
      try {
        await setDoc(
          walletRef,
          {
            balances: balance
              ? { usd: balance.usd, btc: balance.btc }
              : { usd: 10000, btc: 0 },
          },
          { merge: "true" }
        );
      } catch (error) {}
    } else {
    }
  };

  React.useEffect(() => {
    resetFirstBalance();
  });

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key="right">
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
                    fontSize: 20,
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
                  Wallet
                </div>
                <div
                  style={{
                    width: "240px",
                  }}
                >
                  <hr></hr>
                </div>
                <Typography
                  variant="h4"
                  style={{ color: "white", fontFamily: "VT323" }}
                >
                  {balance?.usd?.toFixed(2)} USD
                </Typography>
                <Typography
                  variant="h4"
                  style={{ color: "white", fontFamily: "VT323" }}
                >
                  {balance?.btc} BTC
                </Typography>
                <Button
                  style={{
                    background: "yellow",
                    marginRight: 80,
                    marginLeft: 80,
                    display: "flex",
                    alignItems: "center",
                    border: "5px solid white",
                    color: "black",
                    fontWeight: "bolder",
                  }}
                  onClick={resetBalance}
                >
                  {" "}
                  Reset
                </Button>
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
                <div
                  className={classes.watchlist}
                  style={{ overflowY: "auto", maxHeight: "250px" }}
                >
                  {coins.map((coin) => {
                    if (
                      watchlist?.includes(
                        watchlist.find((e) => e.id === coin.id)
                      )
                    )
                      return (
                        <div
                          style={{ display: "flex", alignItems: "center" }}
                          key={coin?.id}
                        >
                          <div style={{ marginRight: 20 }}>
                            <img src={coin.image} height="25" />
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
                  marginRight: 80,
                  marginLeft: 80,
                  display: "flex",
                  alignItems: "center",
                  border: "5px solid white",
                  color: "black",
                  fontWeight: "bolder",
                }}
              >
                Logout
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
