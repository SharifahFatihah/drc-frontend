import React from "react";
import { makeStyles, Container, Typography, Button } from "@material-ui/core";
import pixel from "../asset/pixelated_1.png";

const useStyle = makeStyles((theme) => ({
  banner: {
    backgroundPosition: "center center",
    background: "rgb(52,0,57)",
    // backgroundImage: `linear-gradient(180deg, rgba(52,0,57,0.87) 0%, rgba(107,13,116,0.8) 70%, rgba(255,226,39,1) 100%), url(https://www.themasterpicks.com/wp-content/uploads/2020/04/22b22287602523.5dbd29081561d.gif), url(${pixel}) `,
    background:
      "linear-gradient(180deg, rgba(52,0,57,0.87) 0%, rgba(107,13,116,0.8) 70%, rgba(255,226,39,1) 100%), url(https://www.themasterpicks.com/wp-content/uploads/2020/04/22b22287602523.5dbd29081561d.gif)",
    backgroundSize: "contain",
    display: "flex",
    justifyContent: "center",
  },
  bannerContent: {
    margin: "0",
    height: 800,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  pixelDiv: {
    display: "flex",
    backgroundImage: `url(${pixel})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
    backgroundSize: "fill",
    marginBottom: "-1%",
    width: "100%",
  },
  tagline: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginLeft: 200,
    [theme.breakpoints.down("md")]: {
      marginLeft: "0",
      marginRight: "0",
    },
  },
  description: {
    marginBottom: 30,
    paddingRight: 20,
    paddingLeft: 20,
  },
  descriptionText: {
    color: "white",
    fontFamily: "VT323",
    fontSize: "50px",
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
    },
  },
}));

function Banner() {
  const classes = useStyle();

  return (
    <div className={classes.banner}>
      <div className={classes.pixelDiv}>
        <Container maxWidth="xl" className={classes.bannerContent}>
          <div className={classes.tagline}>
            <Typography
              variant="h1"
              style={{
                marginBottom: 15,
                paddingRight: 20,
                paddingLeft: 20,
                fontFamily: "VT323",
                color: "white",
              }}
            >
              KA-CHING!
            </Typography>
            <div className={classes.description}>
              <Typography className={classes.descriptionText}>
                Track your profits and losses.
              </Typography>
              <Typography className={classes.descriptionText}>
                View your portfolio valuation.
              </Typography>
              <Typography className={classes.descriptionText}>
                Do it all with our easy-to-use platform.
              </Typography>
            </div>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#FFE227",
                color: "black",
                border: "5px solid white",
                fontFamily: "VT323",
                fontSize: 20,
                marginLeft: 20,
              }}
            >
              Get Started!
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Banner;
