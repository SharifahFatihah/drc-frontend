import { Container, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";
import React from "react";
import { Pin, Rule } from "@mui/icons-material";
import { hover } from "@testing-library/user-event/dist/hover";
import { color } from "@mui/system";
import infoicon from "../asset/infoicon.png";

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
        {" "}
        <div
          style={{
            width: "88%",
            display: "flex",
            justifyContent: "flex-end",
            opacity: "0.8",
          }}
        >
          <Tooltip title="The activeness of coin in different platforms such as the amount of Reddit active accounts, Telegram users and Twitter followers.">
            <img src={infoicon} height="13" />
          </Tooltip>
        </div>
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
        <div
          style={{
            width: "88%",
            display: "flex",
            justifyContent: "flex-end",
            opacity: "0.8",
          }}
        >
          <Tooltip title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex erat, egestas eget purus at, rutrum sagittis dui. In in tortor nunc.">
            <img src={infoicon} height="13" />
          </Tooltip>
        </div>
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
        <div
          style={{
            width: "88%",
            display: "flex",
            justifyContent: "flex-end",
            opacity: "0.8",
          }}
        >
          <Tooltip title="The ability of the coin to be converted into cash without impacting the price and vice versa.">
            <img src={infoicon} height="13" />
          </Tooltip>
        </div>
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
