import { Container, makeStyles, Typography } from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";
import React from "react";
import { Rule } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    [theme.breakpoints.down(1495)]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

function CoinStats({ coin }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" style={{ fontFamily: "VT323" }}>
          Community Score{" "}
        </Typography>
        <Typography variant="h4" style={{ fontFamily: "VT323" }}>
          {coin?.community_score.toFixed(2)}%
        </Typography>
        <Doughnut
          data={{
            labels: ["Community Score"],
            datasets: [
              {
                data: [
                  `${coin?.community_score}`,
                  `${100 - coin?.community_score}`,
                ],
                backgroundColor: ["#FFE227", "rgba(90,29,117, 0.5)"],
                borderWidth: 0,
                radius: "60%",
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            responsive: true,
          }}
        />
      </Container>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" style={{ fontFamily: "VT323" }}>
          Developer Score{" "}
        </Typography>
        <Typography variant="h4" style={{ fontFamily: "VT323" }}>
          {coin?.developer_score.toFixed(2)}%
        </Typography>
        <Doughnut
          data={{
            labels: ["Developer Score"],
            datasets: [
              {
                data: [
                  `${coin?.developer_score}`,
                  `${100 - coin?.developer_score}`,
                ],
                backgroundColor: ["#FFE227", "rgba(90,29,117, 0.5)"],
                borderWidth: 0,
                radius: "60%",
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            responsive: true,
          }}
        />
      </Container>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" style={{ fontFamily: "VT323" }}>
          Liquidity Score{" "}
        </Typography>
        <Typography variant="h4" style={{ fontFamily: "VT323" }}>
          {coin?.liquidity_score.toFixed(2)}%
        </Typography>
        <Doughnut
          data={{
            labels: ["Liquidity Score"],
            datasets: [
              {
                data: [
                  `${coin?.liquidity_score}`,
                  `${100 - coin?.liquidity_score}`,
                ],
                backgroundColor: ["#FFE227", "rgba(90,29,117, 0.5)"],
                borderWidth: 0,
                radius: "60%",
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            responsive: true,
          }}
        />
      </Container>
    </div>
  );
}

export default CoinStats;
