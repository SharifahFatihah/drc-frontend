import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { chartDays } from "../service/Service";

const useStyle = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      padding: "20",
    },
  },
  selectButton: {
    width: "15%",
    border: "1px solid pink",
    borderRadius: 5,
    padding: 10,
    cursor: "pointer",
    marginLeft: 10,
    alignItems: "center",

    "&:hover": {
      backgroundColor: "pink",
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
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      justifyContent: "center",
      marginBottom: 20,
    },
  },
}));

function CoinChart({ coin }) {
  const classes = useStyle();

  const { currency, symbol } = CryptoState();

  const [histData, setHistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(1);

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

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  useEffect(() => {
    setLoading(true);
    getHistoricalChart(coin?.id, days, currency);
  }, [currency, days, coin?.id]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <div className={classes.chartContainer}>
          <div className={classes.basicContainer}>
            <Typography variant="h2" className={classes.description}>
              {symbol}
              {coin?.market_data.current_price[currency.toLowerCase()] > 1
                ? coin?.market_data.current_price[currency.toLowerCase()]
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : coin?.market_data.current_price[currency.toLowerCase()]}
            </Typography>
          </div>

          <div className={classes.buttonContainer}>
            {chartDays.map((e) => (
              <div
                key={e.value}
                onClick={() => setDays(e.value)}
                className={classes.selectButton}
                style={{
                  backgroundColor: e.value === days ? "pink" : "",
                  color: e.value === days ? "black" : "",
                }}
              >
                {e.label}
              </div>
            ))}
          </div>
        </div>
        {loading ? (
          <CircularProgress color="pink" />
        ) : (
          <>
            <Line //can be further config (styles)
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
                    borderColor: "#C53BA4",
                    borderWidth: 2,
                    pointBorderColor: "rgba(0,0,0,0)",
                    pointBackgroundColor: "rgba(0,0,0,0)",
                    pointHoverBorderColor: "#5AC53B",
                    pointBorderWidth: 4,
                    pointHitRadius: 6,
                  },
                ],
              }}
            />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default CoinChart;
