import { makeStyles, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
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

function PortfolioChart({ days }) {
  const classes = useStyle();

  const { user, setAlert, watchlist, coins, currency, symbol } = CryptoState();

  const [coinHistData, setCoinHistData] = useState([]);
  const [coinHistData2, setCoinHistData2] = useState([]);

  useEffect(() => {
    Promise.all(
      coins.map(async (coin) => {
        if (watchlist.includes(watchlist.find((e) => e.id === coin.id)))
          return Service.getHistoricalChart(coin.id, days, currency).then(
            async (z) => {
              setCoinHistData((coinHistData) => [
                ...coinHistData,
                { coin, hist_data: z.data.prices },
              ]);
            }
          );
      })
    );
  }, [days]);

  useEffect(() => {
    setCoinHistData2([
      ...new Map(coinHistData.map((m) => [m.coin.id, m])).values(),
    ]);
  }, [coinHistData]);

  useEffect(() => {
    watchlist.map((e) =>
      coinHistData2.map((z) => {
        e.id === z.coin.id && (z.coin.holding = e.holding);
      })
    );
  }, [coinHistData2, watchlist]);

  console.log("coinhistdata2", coinHistData2);

  const coinsd = coinHistData2?.map((e) => {
    const priceData = e.hist_data?.map((chartData) => chartData[1]);

    const dateData = e.hist_data?.map((chartData) => chartData[0]);

    const priceReturn = priceData
      .map((v, i, a) => Math.log(v / (i ? a[i - 1] : 0)))
      .slice(1);

    return {
      ...e,
      hist_return_data: { 0: dateData.slice(1), 1: priceReturn },
      price_return: priceReturn,
      price_data: priceData,
    };
  });

  const coinsd2 = coinsd?.map((e) => {
    const sdReturn = (arr = e.price_return) => {
      const sum = arr.reduce((acc, val) => acc + val);
      const { length: num } = arr;
      const median = sum / num;
      const sumx = arr.reduce((acc, val) => acc + val - median);
      let variance = 0;
      arr.forEach((num) => {
        variance += (num - median) * (num - median);
      });
      variance /= num;
      return { sum: sumx, sd_return: Math.sqrt(variance) };
    };

    const sdPrice = (arr = e.price_data) => {
      const sum = arr.reduce((acc, val) => acc + val);
      const { length: num } = arr;
      const median = sum / num;
      const sumx = arr.reduce((acc, val) => acc + val - median);
      let variance = 0;
      arr.forEach((num) => {
        variance += (num - median) * (num - median);
      });
      variance /= num;
      return { sum: sumx, sd_price: variance };
    };

    return { ...e, stats_return: sdReturn(), stats_price: sdPrice() };
  });

  const portfolioReturnChart = () => {
    const dateData = coinsd2[0]?.hist_return_data[0];

    const arrReturn = coinsd2.map((e) => e?.hist_return_data[1]);

    const avgReturn = (...arrays) => {
      const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
      const result = Array.from({ length: n });
      return result.map((_, i) =>
        arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
      );
    };

    return { time: dateData, avg_return: avgReturn(...arrReturn) };
  };

  const portfolioVolatility = () => {
    const pricestat = coinsd2?.map((e) => e.stats_price);
    const returnstat = coinsd2?.map((e) => e.stats_return);

    const n_denomenator = coinsd2[0]?.price_data?.length;

    const pricesd =
      pricestat &&
      pricestat
        .map((v, i, a) =>
          a
            .filter((_, _i) => _i !== i)
            .reduce((p, c) => p + (v.sum * c.sum) / n_denomenator, 0)
        )
        .reduce((p, v) => p + v, 0);

    const returnsd =
      returnstat &&
      returnstat
        .map((v, i, a) =>
          a
            .filter((_, _i) => _i !== i)
            .reduce((p, c) => p + (v.sum * c.sum) / n_denomenator, 0)
        )
        .reduce((p, v) => p + v, 0);

    return {
      price_sd: Math.sqrt(pricesd),
      return_sd: Math.sqrt(Math.abs(returnsd)),
    };
  };

  console.log("goldmine", portfolioVolatility());

  const coinChart = coinHistData2.map((e) => {
    const data1 = e.hist_data?.map((chartData) => chartData[1]);

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
      label: ` ${e.coin.id}`,
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

  const colours = portfolioReturnChart()?.avg_return?.map((value) =>
    value < 0 ? "red" : "green"
  );

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
          labels: coinHistData2[0]?.hist_data?.map((chartData) => {
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
      <Typography variant="h2" style={{ fontFamily: "VT323" }}>
        Historical Returns
      </Typography>
      <Bar
        data={{
          labels: portfolioReturnChart()?.time?.map((e) => {
            let date = new Date(e);
            let time = `${date.getHours()}:${date.getMinutes()} `;
            return days === 1 ? time : date.toLocaleDateString();
          }),
          datasets: [
            {
              data: portfolioReturnChart()?.avg_return.map((e) => e * 100),
              label: `test`,
              borderColor: colours,
              borderWidth: 2,
              pointBorderColor: "rgba(0,0,0,0)",
              pointBackgroundColor: "rgba(0,0,0,0)",
              pointHoverBorderColor: "#5AC53B",
              pointHitRadius: 6,
              yAxisID: "y",
            },
          ],
        }}
        options={{
          animation: { duration: 3000, easing: "easeInOutCubic" },
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: { y: { display: true } },
        }}
      />
    </div>
  );
}

export default PortfolioChart;
