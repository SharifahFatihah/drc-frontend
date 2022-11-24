import React, { useState, useEffect, useRef } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Typography,
  Button,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { chartDays } from "../service/Service";
import Chart from "react-apexcharts";
import LineChartIcon from "../asset/linecharticon.png";
import CandlestickIcon from "../asset/candlestickicon.png";

const useStyle = makeStyles((theme) => ({
  container: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      padding: "0",
    },
  },
  selectButton: {
    width: "15%",
    border: "1px solid #FFE227",
    borderRadius: 5,
    padding: 10,
    cursor: "pointer",
    marginLeft: 10,
    alignItems: "center",

    "&:hover": {
      backgroundColor: "#FFE227",
      color: "black",
    },
  },
  chartContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "50% ",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      justifyContent: "center",
    },
  },
  basicContainer: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      justifyContent: "center",
      marginBottom: 20,
    },
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

function CoinChart({ coin }) {
  const classes = useStyle();

  const { currency, symbol } = CryptoState();

  const [histData, setHistData] = useState([]);
  const [histCandle, setHistCandle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLine, setIsLine] = useState(true);

  const handleResize = () => {
    if (window.innerWidth < 630) {
      setIsMobile(true);
    } else if (window.innerWidth < 1000) {
      setIsTablet(true);
    } else {
      setIsMobile(false);
      setIsTablet(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const getHistoricalChart = (e, f, g) => {
    setLoading(true);

    Service.getHistoricalChart(e, f, g)
      .then((response) => {
        setHistData(response.data.prices);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHistoricalCandle = (e, f, g) => {
    setLoading(true);

    Service.getHistoricalCandle(e, f, g)
      .then((response) => {
        setHistCandle(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  useEffect(() => {
    setLoading(true);
    getHistoricalChart(coin?.id, days, currency);
    getHistoricalCandle(coin?.id, days, currency?.toLowerCase());
  }, [currency, days, coin?.id]);

  console.log("histCandle", histCandle);

  const priceData = {
    data: histCandle.map((e) => {
      return {
        x: new Date(e[0]),
        y: [e[1], e[2], e[3], e[4]],
      };
    }),
  };

  console.log("priceData", priceData);

  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / histData.length;

  const animation = {
    x: {
      easing: "linear",
      duration: delayBetweenPoints,
      from: NaN,
      delay(ctx) {
        if (ctx.type !== "data" || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <div className={classes.chartContainer}>
          <div className={classes.basicContainer}>
            <Typography variant="h4">
              {symbol}
              {coin?.market_data.current_price[currency.toLowerCase()] > 1
                ? coin?.market_data.current_price[currency.toLowerCase()]
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : coin?.market_data.current_price[currency.toLowerCase()]}{" "}
              {currency}
            </Typography>
            <div
              className={
                coin?.market_data?.price_change_percentage_24h > 0
                  ? classes.green
                  : classes.red
              }
            >
              {Service.isProfit(coin?.market_data?.price_change_percentage_24h)
                ? "+"
                : ""}
              {parseFloat(
                coin?.market_data?.price_change_percentage_24h
              ).toFixed(2)}
              %
            </div>
          </div>

          <div className={classes.buttonContainer}>
            <Button
              style={{ height: "100%" }}
              onClick={() => {
                isLine ? setIsLine(false) : setIsLine(true);
              }}
            >
              {" "}
              {isLine ? (
                <img src={CandlestickIcon} height={30} />
              ) : (
                <img src={LineChartIcon} height={20} />
              )}
            </Button>
            {chartDays.map((e) => (
              <div
                key={e.value}
                onClick={() => setDays(e.value)}
                className={classes.selectButton}
                style={{
                  backgroundColor: e.value === days ? "#FFE227" : "",
                  color: e.value === days ? "black" : "",
                }}
              >
                {e.label}
              </div>
            ))}
          </div>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {isLine ? (
              <Line
                data={{
                  labels: histData.map((chartData) => {
                    let date = new Date(chartData[0]);
                    let time = `${date.getHours()}:${date.getMinutes()} `;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: histData.map((chartData) => chartData[1]),
                      label: `Price of ${coin?.name} in the last ${days} days in ${currency}`,
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
                  animation,
                  scales: {
                    x: {
                      display: true,
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
            ) : (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Chart
                  options={{
                    chart: {
                      type: "candlestick",
                    },
                    title: {
                      text: "Price of Coin",
                      align: "left",
                    },
                    xaxis: {
                      type: "datetime",
                    },
                    yaxis: {
                      tooltip: {
                        enabled: true,
                      },
                    },
                    tooltip: {
                      followCursor: true,
                      theme: true,
                      style: {
                        fontSize: "1.5rem",
                        fontFamily: "VT323",
                      },
                    },
                  }}
                  series={[priceData]}
                  type="candlestick"
                  width={isMobile ? "125%" : isTablet ? "200%" : "300%"}
                  height={isMobile ? "125%" : isTablet ? "200%" : "300%"}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default CoinChart;
