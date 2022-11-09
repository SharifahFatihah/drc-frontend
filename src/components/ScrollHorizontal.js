import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";
import { display } from "@mui/system";

const useStyle = makeStyles(() => ({
  scrollh: {
    height: "50%",
    width: "70%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollElement: {
    boxShadow: "0px 0px 105px 45px 0px 0px 105px 45px ",
  },
}));

function ScrollHorizontal() {
  const classes = useStyle();
  const navigate = useNavigate();

  const { currency, symbol } = CryptoState();

  const [trending, setTrending] = useState([]);

  const getTrendingCoins = (e) => {
    Service.getTrendingCoins(e)
      .then((response) => {
        setTrending(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTrendingCoins(currency);
  }, [currency]);

  if (!trending) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  const responsive = { 0: { items: 2 }, 512: { items: 4 } };

  const items = trending.map((coin) => {
    return (
      <div
        className={classes.scrollElement}
        onClick={() => navigate(`/coins/${coin.id}`)}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: 30,
          margin: 15,
          borderRadius: "50px",
          background: "rgba(79, 58, 84, 0.52)",
        }}
      >
        <img src={coin?.image} alt={coin.name} height="100" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 20,
          }}
        >
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            {coin?.symbol.toUpperCase()}
          </Typography>
          <Typography>
            {symbol}
            {coin?.current_price > 1
              ? Service.addCommas(coin?.current_price)
              : coin?.current_price}
          </Typography>
        </div>
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

export default ScrollHorizontal;
