import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
  CircularProgress,
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
}));

function CoinChart({ coin }) {
  const classes = useStyle();

  const { currency } = CryptoState();

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
                    label: `Price of last ${days} days in ${currency}`,
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
            <div>
              {chartDays.map((e) => (
                <button onClick={() => setDays(e.value)}>{e.label}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default CoinChart;
