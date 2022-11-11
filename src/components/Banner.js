import React from "react";
import { makeStyles, Container, Typography, Button } from "@material-ui/core";

const useStyle = makeStyles(() => ({
  banner: {
    backgroundPosition: "center center",
    backgroundImage:
      "url(https://www.themasterpicks.com/wp-content/uploads/2020/04/22b22287602523.5dbd29081561d.gif)",
    display: "flex",
    justifyContent: "center",
  },
  bannerContent: {
    background: "rgba(79, 58, 84, 0.52)",
    margin: "0",
    height: 800,
    paddingTop: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
}));

function Banner() {
  const classes = useStyle();

  return (
    <div className={classes.banner}>
      <Container maxWidth="xl" className={classes.bannerContent}>
        <div className={classes.tagline}>
          <Typography
            variant="h1"
            style={{
              marginBottom: 5,
              paddingRight: 20,
              paddingLeft: 20,
              fontFamily: "VT323",
              color: "white",
            }}
          >
            KA-CHING!
          </Typography>
          <Typography
            variant="h6"
            style={{
              marginBottom: 15,
              paddingRight: 20,
              paddingLeft: 20,
              fontFamily: "VT323",
              color: "white",
            }}
          >
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </Typography>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#FFE227",
              color: "black",
              fontFamily: "VT323",
              fontSize: 20,
            }}
          >
            Get Started!
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Banner;
