import {
  Button,
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
  createTheme,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";

import CheatModal from "../components/CheatModal";
import { CryptoState } from "../CryptoContext";
import Kaching from "../asset/kaching.mp3";
import { Line } from "react-chartjs-2";
import { NewspaperRounded } from "@mui/icons-material";
import Service from "../service/Service";
import { db } from "../firebase";
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
    padding: 10,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
      padding: 5,
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

  const { setAlert, balance, user, receipt } = CryptoState();
  const classes = useStyles();

  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [priceArr, setPriceArr] = useState([]);
  const [coin, setCoin] = useState();
  const [isBuy, setIsBuy] = useState(true);
  const [buyUsd, setBuyUsd] = useState("");
  const [buyQuantity, setBuyQuantity] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [brokerFee, setBrokerFee] = useState("");
  const [totalPayment, setTotalPayment] = useState("");

  const playSound = () => {
    var kaching = new Audio(Kaching);
    kaching.play();

    kaching.onended = () => {
      kaching.remove();
      kaching.setAttribute("src", "");
    };
  };

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
        time: time,
      });
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    let date = new Date(time);
    let timeparsed = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    if (priceArr.length < 61) {
      setPriceArr([...priceArr, { price: price.price, time: timeparsed }]);
    } else {
      priceArr.shift();
      setPriceArr([...priceArr, { price: price.price, time: timeparsed }]);
    }
  }, [time]);

  //buying
  const buyCoin = async (q, p, tp) => {
    if (tp > balance.usd) {
      setAlert({
        open: true,
        message: `insufficient balance`,
        type: "error",
      });
    } else if (
      p <= 0 ||
      q <= 0 ||
      isNaN(tp) ||
      isNaN(p) ||
      isNaN(balance.usd) ||
      isNaN(balance.btc)
    ) {
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

        buyReceipt(new Date(time), q, p, tp);
        playSound();
      } catch (error) {}
    }
  };

  //sell coin
  const sellCoin = async (q, p, tp, bf) => {
    if (bf > balance.usd) {
      setAlert({
        open: true,
        message: `insufficient balance`,
        type: "error",
      });
    } else if (
      p <= 0 ||
      q <= 0 ||
      isNaN(tp) ||
      isNaN(p) ||
      isNaN(balance.usd) ||
      isNaN(balance.btc)
    ) {
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
          message: `Sell succesful, current balance $${newUsd}USD`,
          type: "success",
        });
        sellReceipt(new Date(time), q, p, tp);
        playSound();
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

  const resetBalance = async () => {
    const walletRef = await doc(db, "wallet", user.uid);

    try {
      await setDoc(walletRef, {
        balances: { usd: 10000, btc: 0 },
      });

      setAlert({
        open: true,
        message: `You have reset your balance`,
        type: "success",
      });
    } catch (error) {}
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <div
            style={{
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
                      {priceArr?.map((e, i) => {
                        return (
                          <TableRow key={i}>
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
              ${priceArr[priceArr.length - 1]?.price} USD
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
                return chartData.time;
              }),
              datasets: [
                {
                  data: priceArr.map((chartData) => chartData.price),
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
                    alt="coinicon"
                  />
                </div>
                <Typography>BTC/USD</Typography>
              </div>
              <div></div>
            </div>
            <div
              className={classes.inSidebar}
              style={{ alignItems: "flex-start" }}
            >
              <CheatModal />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {balance.usd ? (
                  <>
                    <Typography>${balance?.usd?.toFixed(2)}</Typography>
                    <Typography> {balance?.btc?.toFixed(4)}BTC</Typography>
                  </>
                ) : (
                  <Typography>Please reset your balance</Typography>
                )}
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
                label="Position Size"
                value={buyQuantity}
                onChange={(e) =>
                  isBuy
                    ? (setBuyUsd(
                        e.target.value * priceArr[priceArr.length - 1].price
                      ),
                      setBuyQuantity(e.target.value),
                      e.target.value *
                        priceArr[priceArr.length - 1].price *
                        0.001 >
                      8
                        ? (setBrokerFee(
                            e.target.value *
                              priceArr[priceArr.length - 1].price *
                              0.001
                          ),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1].price +
                              e.target.value *
                                priceArr[priceArr.length - 1].price *
                                0.001
                          ))
                        : (setBrokerFee(8),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1].price +
                              8
                          )))
                    : (setBuyUsd(
                        e.target.value * priceArr[priceArr.length - 1].price
                      ),
                      setBuyQuantity(e.target.value),
                      e.target.value *
                        priceArr[priceArr.length - 1].price *
                        0.001 >
                      8
                        ? (setBrokerFee(
                            e.target.value *
                              priceArr[priceArr.length - 1].price *
                              0.001
                          ),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1].price -
                              e.target.value *
                                priceArr[priceArr.length - 1].price *
                                0.001
                          ))
                        : (setBrokerFee(8),
                          setTotalPayment(
                            e.target.value *
                              priceArr[priceArr.length - 1].price -
                              8
                          )))
                }
                fullWidth
              />
            </div>
            <div className={classes.inSidebar}></div>
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
            {balance.usd ? (
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
                    ? buyCoin(parseFloat(buyQuantity), buyUsd, totalPayment)
                    : sellCoin(
                        parseFloat(buyQuantity),
                        buyUsd,
                        totalPayment,
                        brokerFee
                      )
                }
              >
                Submit
              </Button>
            ) : (
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
                onClick={resetBalance}
              >
                Reset Balance
              </Button>
            )}
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
          <div
            className={classes.sidebar}
            style={{
              height: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" style={{ fontFamily: "VT323" }}>
              Please login to start trading
            </Typography>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default TradePage;
