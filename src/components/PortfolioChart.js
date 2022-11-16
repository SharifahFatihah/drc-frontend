import { makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";
import CoinChart from "./CoinChart";

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
}));

function PortfolioChart() {
  const classes = useStyle();

  const { user, setAlert, watchlist, coins, currency, symbol } = CryptoState();

  const [coinHistData, setCoinHistData] = useState([]);
  const [coinHistData2, setCoinHistData2] = useState([]);
  const [days, setDays] = useState(1);

  useEffect(() => {
    Promise.all(
      coins.map(async (coin) => {
        if (watchlist.includes(coin.id))
          return Service.getHistoricalChart(coin.id, days, currency).then(
            async (z) => {
              setCoinHistData((coinHistData) => [
                ...coinHistData,
                { id: coin.id, data: z.data.prices },
              ]);
            }
          );
      })
    );
  }, []);

  useEffect(() => {
    setCoinHistData2([...new Map(coinHistData.map((m) => [m.id, m])).values()]);
  }, [coinHistData]);

  const coinChart = coinHistData2.map((e) => {
    const data1 = e.data?.map((chartData) => chartData[1]);

    const ratio = Math.max(...data1) / 100;

    const data2 = data1.map((v) => v / ratio);

    const random_rgba = () => {
      var o = Math.round,
        r = Math.random,
        s = 255;
      return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ",1";
    };

    return {
      data: data2,
      label: ` ${e.id}`,
      borderColor: random_rgba(),
      borderWidth: 2,
      pointBorderColor: "rgba(0,0,0,0)",
      pointBackgroundColor: "rgba(0,0,0,0)",
      pointHoverBorderColor: "#5AC53B",
      pointHitRadius: 6,
      yAxisID: "y",
    };
  });

  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / 250;

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
    <div className={classes.container}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <Typography variant="h2" style={{ fontFamily: "VT323" }}>
          Relative Price of Portfolio Coins
        </Typography>
      </div>

      <Line
        data={{
          labels: coinHistData2[0]?.data?.map((chartData) => {
            let date = new Date(chartData[0]);
            let time = `${date.getHours()}:${date.getMinutes()} `;
            return days === 1 ? time : date.toLocaleDateString();
          }),
          datasets: coinChart,
        }}
        options={{
          animation,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: { y: { display: true } },
        }}
      />
    </div>
  );
}

export default PortfolioChart;
