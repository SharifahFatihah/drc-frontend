import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import { Gradient } from "@material-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import Kaching from "../asset/kaching.mp3";
import LogoWord from "../asset/logoword.png";
import Mario from "../asset/mario.gif";
import Coin from "../asset/mariocoin.gif";

const useStyle = makeStyles(() => ({
  banner: {
    backgroundPosition: "center center",
    // backgroundImage:
    //   "url(https://www.themasterpicks.com/wp-content/uploads/2020/04/22b22287602523.5dbd29081561d.gif)",
    height: 1000,
    background: "rgb(107,13,116)",
    background:
      "linear-gradient(166deg, rgba(107,13,116,1) 37%, rgba(255,226,39,1) 100%)",
    display: "flex",
    justifyContent: "center",
  },
  bannerContent: {
    margin: "0",
    // height: 1000,
    paddingTop: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  hello: {
    background: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 90,
    width: "50%",
  },
  cryptogif: {},
  mariogif: {
    background: "#FFFFFF",
    display: "flex",
    height: 500,
    alignItems: "center",
    // padding: 30,
    // paddingLeft: 90,
    // paddingRight: 90,
    // margin: 15,
    // width: "50%",
  },
  currencypic: {},
}));

function WelcomePage() {
  const classes = useStyle();
  const navigate = useNavigate();

  const playSound = () => {
    var kaching = new Audio(Kaching);
    kaching.play();

    kaching.onended = () => {
      kaching.setAttribute("src", "");
      navigate("/homepage");
    };
  };

  return (
    <div className={classes.banner}>
      <Container maxWidth="xl" className={classes.bannerContent}>
        <div className={classes.hello}>
          <img
            src={LogoWord}
            alt="kaching"
            style={{
              marginBottom: 5,
              paddingLeft: 20,
            }}
          />
          <Typography
            variant="h2"
            style={{
              marginBottom: 5,
              paddingRight: 20,
              paddingLeft: 20,
              fontFamily: "VT323",
              color: "#212121",
            }}
          >
            Hello Investor!
          </Typography>
          <Typography
            variant="h4"
            style={{
              marginBottom: 50,
              paddingRight: 20,
              paddingLeft: 20,
              fontFamily: "VT323",
              color: "#212121",
            }}
          >
            Are you ready for an adventure?
          </Typography>
          <img src={Coin} alt="coins" />
          <Button
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "#FFE227",
              color: "black",
              border: "5px solid white",
              fontFamily: "VT323",
              fontSize: 20,
              marginLeft: 80,
            }}
            onClick={() => {
              playSound();
            }}
          >
            Let's Start!
          </Button>
          <img src={Mario} alt="mario collect coins" height={200} />
        </div>
      </Container>
    </div>
  );
}

export default WelcomePage;
