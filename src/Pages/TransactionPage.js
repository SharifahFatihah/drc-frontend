import {
  Button,
  createTheme,
  makeStyles,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import React from "react";
import { CryptoState } from "../CryptoContext";
import TransactionTable from "../components/TransactionTable";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: { main: "#fff" },
    type: "dark",
  },
});
function TransactionPage() {
  const { user, receipt } = CryptoState();

  const classes = useStyles();

  const deleteReceipt = async () => {
    const transactionRef = doc(db, "transaction", user?.uid);

    try {
      await setDoc(
        transactionRef,
        {
          receipts: [],
        },
        { merge: "true" }
      );
    } catch (error) {}
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <div
          style={{
            width: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: "50%",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {" "}
            <Typography variant="h2" style={{ fontFamily: "VT323" }}>
              Transaction History
            </Typography>
          </div>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#212121",
              border: "5px solid #FFE227",
              color: "white",
              fontFamily: "VT323",
              fontSize: 20,
            }}
            onClick={deleteReceipt}
          >
            {" "}
            Reset History
          </Button>
        </div>

        <div style={{ width: "90%", minHeight: "500px", paddingTop: 20 }}>
          <TransactionTable receipt={receipt} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default TransactionPage;
