import {
  Button,
  createTheme,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { NewspaperRounded } from "@mui/icons-material";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CryptoState } from "../CryptoContext";
import { db } from "../firebase";
import Service from "../service/Service";
import Kaching from "../asset/kaching.mp3";
import { useNavigate } from "react-router-dom";

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
  red: {
    backgroundColor: "#FF4B25",
    marginLeft: 10,
    color: "black",
    padding: 5,
    borderRadius: 5,
  },
  green: {
    backgroundColor: "#00FF19",
    marginLeft: 10,
    color: "black",
    padding: 5,
    borderRadius: 5,
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: { main: "#fff" },
    type: "dark",
  },
});

function TradePage() {
  const navigate = useNavigate();

  var audio = new Audio(Kaching);

  const { setAlert, balance, user, receipt } = CryptoState();
  const classes = useStyles();

  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [timeParsed, setTimeParsed] = useState("");
  const [priceArr, setPriceArr] = useState([]);
  const [coin, setCoin] = useState();
  const [isBuy, setIsBuy] = useState(true);
  const [buyUsd, setBuyUsd] = useState("");
  const [buyQuantity, setBuyQuantity] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [brokerFee, setBrokerFee] = useState("");
  const [totalPayment, setTotalPayment] = useState("");

  const handleResize = () => {
    if (window.innerWidth < 1280) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

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
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (e) => {
      setPrice({
        price: parseFloat(JSON.parse(e.data).p).toFixed(2),
        time: 0,
      });
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, [time]);

  useEffect(() => {
    let date = new Date(time);
    let timeparsed = `${date.getHours()}:${date.getMinutes()}: ${date.getSeconds()}`;

    setTimeParsed(timeparsed);
    if (priceArr.length < 31) {
      setPriceArr([...priceArr, { price: price.price, time: timeparsed }]);
    } else {
      priceArr.shift();
      setPriceArr([...priceArr, { price: price.price, time: timeparsed }]);
    }

    console.log("priceArr", priceArr);
  }, [time]);

  //buying
  const buyCoin = async (q, p, tp) => {
    if (tp > balance.usd) {
      setAlert({
        open: true,
        message: `insufficient balance`,
        type: "error",
      });
    } else if (p <= 0 || q <= 0 || isNaN(tp) || isNaN(p)) {
      setAlert({
        open: true,
        message: `invalid price`,
        type: "error",
      });
    } else {
      const newUsd = balance.usd - tp;
      const newBtc = balance.btc + q;
      const walletRef = await doc(db, "wallet", user.uid);

      try {
        await setDoc(
          walletRef,
          {
            balances: { usd: newUsd, btc: newBtc },
          },
          { merge: "true" }
        );

        setAlert({
          open: true,
          message: `Buy succesful, current balance $${newUsd}USD`,
          type: "success",
        });
        audio.play();
        buyReceipt(new Date(time), q, p, tp);
      } catch (error) {}
    }
  };

  //sell coin
  const sellCoin = async (q, p, tp) => {
    if (tp > balance.usd) {
      setAlert({
        open: true,
        message: `insufficient balance`,
        type: "error",
      });
    } else if (p <= 0 || q <= 0 || isNaN(tp) || isNaN(p)) {
      setAlert({
        open: true,
        message: `invalid`,
        type: "error",
      });
    } else if (q > balance.btc) {
      setAlert({
        open: true,
        message: `insufficient coin`,
        type: "error",
      });
    } else {
      const newUsd = balance.usd + tp;
      const newBtc = balance.btc - q;
      const walletRef = await doc(db, "wallet", user.uid);
      audio.play();

      try {
        await setDoc(
          walletRef,
          {
            balances: { usd: newUsd, btc: newBtc },
          },
          { merge: "true" }
        );

        setAlert({
          open: true,
          message: `Buy succesful, current balance $${newUsd}USD`,
          type: "success",
        });
        audio.play();
        sellReceipt(new Date(time), q, p, tp);
      } catch (error) {}
    }
  };

  const buyReceipt = async (time, quantity, price, cost) => {
    const transactionRef = doc(db, "transaction", user?.uid);

    try {
      await setDoc(
        transactionRef,
        {
          receipts: receipt
            ? [
                ...receipt,
                {
                  time: time,
                  coin: "btc",
                  type: "buy",
                  quantity: quantity,
                  profit: -1 * price,
                  total_gain: -1 * cost,
                },
              ]
            : [
                {
                  time: time,
                  coin: "btc",
                  type: "buy",
                  quantity: quantity,
                  profit: -1 * price,
                  total_gain: -1 * cost,
                },
              ],
        },
        { merge: "true" }
      );
    } catch (error) {}
  };

  const sellReceipt = async (time, quantity, profit, cost) => {
    const transactionRef = doc(db, "transaction", user?.uid);

    try {
      await setDoc(
        transactionRef,
        {
          receipts: receipt
            ? [
                ...receipt,
                {
                  time: time,
                  coin: "btc",
                  type: "sell",
                  quantity: quantity,
                  profit: profit,
                  total_gain: cost,
                },
              ]
            : [
                {
                  time: time,
                  coin: "btc",
                  type: "sell",
                  quantity: quantity,
                  profit: profit,
                  total_gain: cost,
                },
              ],
        },
        { merge: "true" }
      );
    } catch (error) {}
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <div
            style={{
              marginTop: 20,
              width: "90%",
              backgroundColor: "rgba(79, 58, 84, 0.52)",
            }}
          >
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
              }}
              style={{
                borderRadius: "15px",
              }}
            >
              <TableContainer
                component={Paper}
                style={{ backgroundColor: "#212121", color: "black" }}
              >
                <div
                  style={{
                    overflow: "auto",
                    maxHeight: isMobile ? "250px" : "550px",
                  }}
                >
                  <Table sx={{ minWidth: 650 }} stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="right"
                          style={{ color: "black", backgroundColor: "#FFE227" }}
                        >
                          Time
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ color: "black", backgroundColor: "#FFE227" }}
                        >
                          Price USD{" "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {priceArr?.map((e) => {
                        return (
                          <TableRow>
                            <TableCell align="right" style={{ color: "white" }}>
                              <div>{e.time}</div>
                            </TableCell>
                            <TableCell align="right">
                              <div>{e.price}</div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TableContainer>
            </Paper>
          </div>
        </div>

        <div className={classes.mainbar}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              variant="h2"
              style={{
                fontFamily: "VT323",
                marginRight: 20,
                color:
                  priceArr[priceArr.length - 1]?.price >
                  priceArr[priceArr.length - 2]?.price
                    ? "#00FF19"
                    : "red",
              }}
            >
              ${(priceArr[priceArr.length - 1]?.price / 100).toFixed(4)} USD
            </Typography>
            <Typography
              className={
                Math.log(priceArr[priceArr.length - 1]?.price) -
                  Math.log(priceArr[priceArr.length - 2]?.price) >
                0
                  ? classes.green
                  : classes.red
              }
            >
              {Math.log(priceArr[priceArr.length - 1]?.price) -
                Math.log(priceArr[priceArr.length - 2]?.price) >
              0
                ? "+"
                : ""}
              {(
                (Math.log(priceArr[priceArr.length - 1]?.price) -
                  Math.log(priceArr[priceArr.length - 2]?.price)) *
                100
              ).toPrecision(4)}
              %
            </Typography>
          </div>
          <Line
            data={{
              labels: priceArr.map((chartData) => {
                let date = new Date(chartData.time);
                let time = `${date.getHours()}:${date.getMinutes()}: ${date.getSeconds()}`;
                return chartData.time;
              }),
              datasets: [
                {
                  data: priceArr.map((chartData) => chartData.price / 100),
                  label: `price`,
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
        {user ? (
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {" "}
                <Typography>${balance?.usd?.toFixed(2)}</Typography>
                <Typography> {balance?.btc?.toFixed(4)}BTC</Typography>
              </div>
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
                    backgroundColor: isBuy ? "yellow" : "transparent",
                    color: isBuy ? "black" : "white",
                    width: "80%",
                  }}
                  onClick={() => {
                    setIsBuy(true);
                    setBuyUsd("");
                    setBuyQuantity("");
                    setBrokerFee("");
                    setTotalPayment("");
                  }}
                >
                  Buy
                </Button>
                <Button
                  style={{
                    backgroundColor: !isBuy ? "yellow" : "transparent",
                    color: !isBuy ? "black" : "white",
                    width: "80%",
                  }}
                  onClick={() => {
                    setIsBuy(false);
                    setBuyUsd("");
                    setBuyQuantity("");
                    setBrokerFee("");
                    setTotalPayment("");
                  }}
                >
                  Sell
                </Button>
              </div>
            </div>

            <div className={classes.inSidebar}>
              <TextField
                type="number"
                step="0.01"
                variant="outlined"
                defaultValue=""
                label="Position Size"
                value={buyQuantity}
                onChange={(e) =>
                  isBuy
                    ? (setBuyUsd(
                        e.target.value * priceArr[priceArr.length - 1]?.price
                      ),
                      setBuyQuantity(parseFloat(e.target.value)),
                      e.target.value *
                        priceArr[priceArr.length - 1]?.price *
                        0.001 >
                      8
                        ? (setBrokerFee(
                            e.target.value *
                              priceArr[priceArr.length - 1]?.price *
                              0.001
                          ),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1]?.price +
                              e.target.value *
                                priceArr[priceArr.length - 1]?.price *
                                0.001
                          ))
                        : (setBrokerFee(8),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1]?.price +
                              8
                          )))
                    : (setBuyUsd(
                        e.target.value * priceArr[priceArr.length - 1]?.price
                      ),
                      setBuyQuantity(parseFloat(e.target.value)),
                      e.target.value *
                        priceArr[priceArr.length - 1]?.price *
                        0.001 >
                      8
                        ? (setBrokerFee(
                            e.target.value *
                              priceArr[priceArr.length - 1]?.price *
                              0.001
                          ),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1]?.price -
                              e.target.value *
                                priceArr[priceArr.length - 1]?.price *
                                0.001
                          ))
                        : (setBrokerFee(8),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1]?.price -
                              8
                          )))
                }
                fullWidth
              />
            </div>
            <div className={classes.inSidebar}>
              <Typography>{isBuy ? "Buy Summary" : "Sell Summary"}</Typography>
            </div>
            <div className={classes.inSidebar}>
              <Typography>{isBuy ? "Price" : "Profit"}</Typography>
              <Typography>{buyUsd} </Typography>
            </div>
            <div className={classes.inSidebar}>
              <Typography>Broker Fee</Typography>
              <Typography>{brokerFee} </Typography>
            </div>
            <div className={classes.inSidebar}>
              <Typography>{isBuy ? "Total Cost" : "Total Gain"}</Typography>
              <Typography>{totalPayment} </Typography>
            </div>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#FFE227",
                border: "5px solid white",
                color: "black",
                fontFamily: "VT323",
                fontSize: 16,
                width: "80%",
              }}
              onClick={() =>
                isBuy
                  ? buyCoin(buyQuantity, buyUsd, totalPayment)
                  : sellCoin(buyQuantity, buyUsd, totalPayment)
              }
            >
              Submit
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#212121",
                border: "5px solid #FFE227",
                color: "white",
                fontFamily: "VT323",
                fontSize: 16,
                width: "80%",
                marginTop: 10,
              }}
              onClick={() => {
                navigate("/transaction");
              }}
            >
              History
            </Button>
          </div>
        ) : (
          <div className={classes.sidebar} style={{ height: "100%" }}>
            Please login to start trading
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default TradePage;
