import { createTheme, makeStyles, ThemeProvider } from "@material-ui/core";
import React from "react";
import { CryptoState } from "../CryptoContext";

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

  console.log("transactionpage", receipt);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>TransactionPage</div>
    </ThemeProvider>
  );
}

export default TransactionPage;
