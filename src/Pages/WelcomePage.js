import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import Kaching from "../asset/kaching.mp3";

const useStyle = makeStyles(() => ({
  banner: {
    backgroundPosition: "center center",
    backgroundImage:
      "url(https://www.themasterpicks.com/wp-content/uploads/2020/04/22b22287602523.5dbd29081561d.gif)",
    display: "flex",
    justifyContent: "center",
  },
  bannerContent: {
    background: "rgba(79, 58, 84, 0.65)",
    margin: "0",
    height: 1000,
    paddingTop: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function WelcomePage() {
  const classes = useStyle();
  const navigate = useNavigate();
  var audio = new Audio(Kaching);

  return (
    <div className={classes.banner}>
      <Container maxWidth="xl" className={classes.bannerContent}>
        <Typography
          variant="h2"
          style={{
            marginBottom: 5,
            paddingRight: 20,
            paddingLeft: 20,
            fontFamily: "VT323",
            color: "white",
          }}
        >
          Hello Player 1!
        </Typography>
        <Typography
          variant="h4"
          style={{
            marginBottom: 5,
            paddingRight: 20,
            paddingLeft: 20,
            fontFamily: "VT323",
            color: "white",
          }}
        >
          You ready for an adventure?!
        </Typography>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#FFE227",
            color: "black",
            fontFamily: "VT323",
            fontSize: 20,
          }}
          onClick={() => {
            navigate("/homepage");
            audio.play();
          }}
        >
          Let's Start!
        </Button>
      </Container>
    </div>
  );
}

export default WelcomePage;
