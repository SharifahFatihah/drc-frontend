import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  mainbar: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "20%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    whiteSpace: "wrap",
  },
  inSidebar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
}));

function TradePage() {
  const { setAlert, balance } = CryptoState();
  const classes = useStyles();

  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [timeParsed, setTimeParsed] = useState("");
  const [priceArr, setPriceArr] = useState([]);
  const [coin, setCoin] = useState();

  const getSingleCoin = (e) => {
    Service.getSingleCoin(e)
      .then((response) => {
        setCoin(response.data);
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: `API request exceed 50 limit, please wait 1 minute`,
          type: "error",
        });
      });
  };

  useEffect(() => {
    getSingleCoin("bitcoin");
  }, []);

  useEffect(() => {
    let ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (e) => {
      setPrice({
        price: parseFloat(JSON.parse(e.data).p).toFixed(2),
        time: JSON.parse(e.data).t,
      });
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (priceArr.length < 31) {
      setPriceArr([...priceArr, price]);
    } else {
      priceArr.shift();
      setPriceArr([...priceArr, price]);
    }

    let date = new Date(time);
    let timeparsed = `${date.getHours()}:${date.getMinutes()}: ${date.getSeconds()}`;

    setTimeParsed(timeparsed);

    console.log("priceArr", priceArr);
    console.log("price", price?.price / 100);
    console.log(
      "logDiff",
      Math.log(priceArr[29]?.price / 100) - Math.log(priceArr[28]?.price / 100)
    );
  }, [time]);

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>{timeParsed}</div>

      <div className={classes.mainbar}>
        {(priceArr[priceArr.length - 1]?.price / 100).toFixed(4)}
        <Line
          data={{
            labels: priceArr.map((chartData) => {
              let date = new Date(chartData.time);
              let time = `${date.getHours()}:${date.getMinutes()}: ${date.getSeconds()}`;
              return time;
            }),
            datasets: [
              {
                data: priceArr.map((chartData) => chartData.price / 100),
                label: `test`,
                borderColor: "#FFE227",
                borderWidth: 2,

                pointBorderColor: "rgba(0,0,0,0)",
                pointBackgroundColor: "rgba(0,0,0,0)",
                pointHoverBorderColor: "#5AC53B",
                pointHitRadius: 6,
                fill: true,
                backgroundColor: "rgba(243, 251, 0, 0.02)",
              },
            ],
          }}
          options={{
            responsive: true,
            animation: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                display: false,
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Price",
                },
              },
            },
          }}
        />
      </div>
      <div className={classes.sidebar}>
        <div className={classes.inSidebar}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "40%",
            }}
          >
            <div>
              <img
                src={coin?.image?.small}
                height={30}
                style={{ marginRight: 10 }}
              />
            </div>
            <Typography>BTC/USD</Typography>
          </div>
          <div>2</div>
        </div>
        <div className={classes.inSidebar}>
          <Typography>Balance</Typography>
          <Typography>${balance.usd}</Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "80%",
          }}
        >
          <div
            className={classes.inSidebar}
            style={{
              display: "flex",
              width: "100%",
              backgroundColor: "rgba(79, 58, 84, 0.52)",
              borderRadius: 5,
              justifyContent: "space-evenly",
            }}
          >
            <Button
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              Buy
            </Button>
            <Button
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              Sell
            </Button>
          </div>
        </div>
        <div className={classes.inSidebar}>
          <TextField style={{ backgroundColor: "white", width: "100%" }} />
        </div>
        <div className={classes.inSidebar}>
          <TextField style={{ backgroundColor: "white", width: "100%" }} />
        </div>
      </div>
    </div>
  );
}

export default TradePage;
