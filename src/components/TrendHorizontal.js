import {
  CircularProgress,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";
import SimpleChart from "./SimpleChart";

const useStyle = makeStyles(() => ({
  scrollh: {
    height: "50%",
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollElement: {
    boxShadow: "0px 0px 105px 45px 0px 0px 105px 45px ",
  },
}));
function TrendHorizontal() {
  const classes = useStyle();
  const navigate = useNavigate();

  const { currency, symbol } = CryptoState();

  const [trending, setTrending] = useState([]);

  const getTrendingCoins2 = () => {
    Service.getTrendingCoins2()
      .then((response) => {
        setTrending(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTrendingCoins2();
  }, []);

  if (trending.length === 0) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  const responsive = {
    0: { items: 1 },
    730: { items: 2 },
    1150: { items: 3 },
    1845: { items: 4 },
  };

  console.log(trending?.coins);

  const items = trending?.coins.map((coin) => {
    return (
      <div
        className={classes.scrollElement}
        onClick={() => navigate(`/coins/${coin?.item?.id}`)}
        style={{
          // display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: 30,
          margin: 15,
          borderRadius: "15px",
          background: "rgba(79, 58, 84, 0.52)",
        }}
      >
        <div style={{ display: "flex", alignItems: "" }}>
          <img src={coin?.item?.large} alt={coin?.item?.name} height="70" />
          <div
            style={{
              marginLeft: 10,
            }}
          >
            <Typography variant="h4" style={{ fontWeight: "bold" }}>
              {coin?.item?.symbol.toUpperCase()}
            </Typography>
            <Typography variant="h6" style={{ fontFamily: "VT323" }}>
              {coin?.item?.name}
            </Typography>
            </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              {console.log(coin)}

              <div
                style={{
                  fontWeight: "bolder",
                }}
              >
                {coin?.item?.price_btc?.toString().slice(0, 8)}
                {" BTC "}
              </div>
            </div>

            <Typography variant="h6" style={{ fontFamily: "VT323" }}>
              {<SimpleChart coin={coin?.item} />}{" "}
            </Typography>
          
        
      </div>
    );
  });
  return (
    <div className={classes.scrollh}>
      <AliceCarousel
        mouseTracking
        infinite={true}
        autoPlay={true}
        autoPlayInterval={2000}
        animationDuration={2000}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
      />
    </div>
  );
}

export default TrendHorizontal;