import { Snackbar } from "@mui/material";
import React, { useState } from "react";
import { CryptoState } from "../CryptoContext";

function Alert() {
  const { alert, setAlert } = CryptoState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ open: false });
  };

  return <Snackbar></Snackbar>;
}

export default Alert;
