import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyle = makeStyles(() => ({
  scrollh: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
}));

function ScrollHorizontal() {
  const classes = useStyle();

  return <div className={classes.scrollh}> ScrollHorizontal</div>;
}

export default ScrollHorizontal;
