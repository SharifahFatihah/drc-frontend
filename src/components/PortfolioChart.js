import { makeStyles, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";
import CoinChart from "./CoinChart";
import infoicon from "../asset/infoicon.png";

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
  }, [watchlist, days]);

  useEffect(() => {
    setCoinHistData2([
      ...new Map(coinHistData.map((m) => [m.coin.id, m])).values(),
    ]);
  }, [coinHistData, watchlist]);

  useEffect(() => {
    watchlist.map((e) =>
      coinHistData2.map((z) => {
        e.id === z.coin.id && (z.coin.holding = e.holding);
      })
    );
  }, [coinHistData2, watchlist]);

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
    const totalWeight = coinsd?.reduce(
      (sum, coin) => sum + coin?.coin?.holding * coin?.coin?.current_price,
      0
    );
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
      return {
        sum: ((e?.coin?.holding * e.coin?.current_price) / totalWeight) * sumx,
        sd_return:
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          variance,
      };
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
      return {
        sum: ((e?.coin?.holding * e.coin?.current_price) / totalWeight) * sumx,
        sd_price:
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          variance,
      };
    };

    return { ...e, stats_return: sdReturn(), stats_price: sdPrice() };
  });

  const portfolioPriceChart = () => {
    const dateData = coinsd2[0]?.hist_data.map((e) => e[0]);

    const arrPrice = coinsd2?.map((e) =>
      e?.hist_data.map((v) => v[1] * e.coin.holding)
    );

    const avgPrice = (...arrays) => {
      const n = arrays.reduce((max, xs) => Math.min(max, xs.length), 1000);
      const result = Array.from({ length: n });
      return result.map((_, i) =>
        arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
      );
    };

    return { time: dateData, avg_return: avgPrice(...arrPrice) };
  };

  const portfolioReturnChart = () => {
    const totalWeight = coinsd?.reduce(
      (sum, coin) => sum + coin?.coin?.holding * coin?.coin?.current_price,
      0
    );
    const dateData = coinsd2[0]?.hist_return_data[0];

    const arrReturn = coinsd2.map((e) =>
      e?.hist_return_data[1].map(
        (v) => (v * e?.coin?.holding * e?.coin?.current_price) / totalWeight
      )
    );

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

    const price_sum_var =
      pricestat &&
      pricestat
        .map((stat) => stat.sd_price)
        ?.reduce((acc, val) => acc + val, 0);

    const return_sum_var =
      returnstat &&
      returnstat
        .map((stat) => stat.sd_return)
        ?.reduce((acc, val) => acc + val, 0);

    const price_sum_cov =
      pricestat &&
      pricestat
        .map((v, i, a) =>
          a
            .filter((_, _i) => _i !== i)
            .reduce((p, c) => p + (v.sum * c.sum) / n_denomenator, 0)
        )
        .reduce((p, v) => p + v, 0);

    const return_sum_cov =
      returnstat &&
      returnstat
        .map((v, i, a) =>
          a
            .filter((_, _i) => _i !== i)
            .reduce((p, c) => p + (v.sum * c.sum) / n_denomenator, 0)
        )
        .reduce((p, v) => p + v, 0);

    return {
      price_sd: Math.sqrt(price_sum_cov + price_sum_var),
      return_sd: Math.sqrt(return_sum_cov + return_sum_var) * 100,
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

    if (
      watchlist.includes(watchlist.find((watch) => watch.id === e?.coin?.id))
    ) {
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
    } else {
      return {
        data: [],
        label: ``,
        borderColor: "rgba(0,0,0,0.0)",
        borderWidth: 2,
        pointBorderColor: "rgba(0,0,0,0)",
        pointBackgroundColor: "rgba(0,0,0,0)",
        pointHoverBorderColor: "#5AC53B",
        pointHitRadius: 6,
        yAxisID: "y",
      };
    }
  });

  const doughnutCoin = () => {
    const sumArr = coinsd2?.map(
      (e) => e?.coin?.holding * e?.coin?.current_price
    );
    const sum = sumArr?.reduce((acc, val) => acc + val, 0);
    const holdingArr = coinsd2?.map((e) => {
      return {
        name: e.coin.name,
        weight: e.coin.holding * e.coin.current_price,
        total_weight: sum,
      };
    });

    return holdingArr;
  };

  console.log("coinsd2", coinsd2);

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

  const random_rgba = () => {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ",1";
  };

  const colours = portfolioReturnChart()?.avg_return?.map((value) =>
    value < 0 ? "red" : "green"
  );

  const colourDoughnut = doughnutCoin().map((e) => random_rgba());

  const histPriceTooltip = `The price of coin in the past ${days} day(s)`;
  const relPriceTooltip = `The price of each coin in your portfolio relative to its highest value for the past ${days} day(s).`;
  const histReturnTooltip = `The 'Sum of Returns' x 'Weightage of each coin' in your portfolio for the past ${days} day(s).`;
  const weightageTooltip = `The weightage of each coin in your portfolio for the past ${days} day(s).`;

  return (
    <div className={classes.container}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      ></div>

      <Typography variant="h2" style={{ fontFamily: "VT323" }}>
        Historical Price{" "}
        <Tooltip title={histPriceTooltip}>
          <img src={infoicon} height="13" style={{ marginBottom: "25px" }} />
        </Tooltip>
      </Typography>
      {portfolioPriceChart().avg_return.length === 0 ? null : (
        <Line
          data={{
            labels: portfolioPriceChart()?.time?.map((e) => {
              let date = new Date(e);
              let time = `${date.getHours()}:${date.getMinutes()} `;
              return days === 1 ? time : date.toLocaleDateString();
            }),
            datasets: [
              {
                data: portfolioPriceChart()?.avg_return.map((e) => e),
                label: `Portfolio Price`,
                borderColor: "yellow",
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
            animation,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: { y: { display: true } },
          }}
        />
      )}
      <Typography variant="h2" style={{ fontFamily: "VT323" }}>
        Relative Price of Portfolio Coins {""}
        <Tooltip title={relPriceTooltip}>
          <img src={infoicon} height="13" style={{ marginBottom: "25px" }} />
        </Tooltip>
      </Typography>
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
        Historical Returns{" "}
        <Tooltip title={histReturnTooltip}>
          <img src={infoicon} height="13" style={{ marginBottom: "25px" }} />
        </Tooltip>
      </Typography>
      {portfolioReturnChart() && (
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
      )}
      <Typography variant="h2" style={{ fontFamily: "VT323" }}>
        Coin Weightage{" "}
        <Tooltip title={weightageTooltip}>
          <img src={infoicon} height="13" style={{ marginBottom: "25px" }} />
        </Tooltip>
      </Typography>
      {doughnutCoin() && (
        <Doughnut
          data={{
            labels: doughnutCoin()?.map((e) => e.name),
            datasets: [
              {
                data: doughnutCoin()
                  ? doughnutCoin()?.map(
                      (e) => (e.weight / e.total_weight) * 100
                    )
                  : [],
                borderWidth: 0,
                backgroundColor: colourDoughnut,
                radius: "60%",
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default PortfolioChart;
