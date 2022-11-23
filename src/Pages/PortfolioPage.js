import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import currentAssetIcon from "../asset/currentasseticon.png";
import Service from "../service/Service";
import { useNavigate } from "react-router-dom";
import PortfolioChart from "../components/PortfolioChart";
import { chartDays } from "../service/Service";
import HoldingModal from "../components/HoldingModal";
import DeleteIcon from "../asset/deleteicon.png";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Portfolioinfo from "../components/Portfolioinfo";
import { Doughnut } from "react-chartjs-2";
import infoicon from "../asset/infoicon.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  mainbar: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    whiteSpace: "wrap",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "85% ",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      justifyContent: "center",
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
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingLeft: 40,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      padding: 0,
    },
  },
}));

function PortfolioPage() {
  const { user, setAlert, watchlist, coins, currency, symbol } = CryptoState();

  const [userCoin, setUserCoin] = useState([]);
  const [userCoin2, setUserCoin2] = useState([]);
  const [userCoin3, setUserCoin3] = useState();
  const [period, setPeriod] = useState("price_change_percentage_24h");
  const [days, setDays] = useState(1);
  const [userState, setUserState] = useState(user);
  const [isMobile, setIsMobile] = useState(false);
  const [avgPriceChange, setAvgPriceChange] = useState(0);
  const [currentPortfolioPrice, setCurrentPortfolioPrice] = useState(0);
  const [timeFrame, setTimeFrame] = useState("24H");
  const [donutCoin, setDonutCoin] = useState([]);
  const [volatilityDesc, setVolatilityDesc] = useState("semi-hourly");

  const [coinAlert, setCoinAlert] = useState([]);

  const navigate = useNavigate();

  const classes = useStyles();

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

  useEffect(() => {
    Promise.all(
      coins.map(async (coin) => {
        if (watchlist?.includes(watchlist?.find((e) => e.id === coin.id)))
          return Service.getSingleCoin(coin.id);
      })
    ).then((z) => {
      setUserCoin(z.filter((y) => !!y));
    });
  }, [watchlist]);

  useEffect(() => {
    userCoin.map((e) => setUserCoin2((userCoin2) => [...userCoin2, e.data]));
  }, [userCoin]);

  useEffect(() => {
    watchlist.map((e) =>
      userCoin2.map((z) => {
        e.id === z.id && (z.holding = e.holding);
      })
    );
    setUserCoin3([...new Map(userCoin2.map((m) => [m.id, m])).values()]);
  }, [userCoin2]);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  useEffect(() => {
    const totalWeight = userCoin3?.reduce((sum, coin) => {
      if (watchlist?.includes(watchlist?.find((e) => e.id === coin?.id))) {
        return (
          sum +
          coin.holding *
            coin?.market_data?.current_price[currency?.toLowerCase()]
        );
      } else {
        return sum + 0;
      }
    }, 0);
    setAvgPriceChange(
      userCoin3?.length > 0 &&
        userCoin3?.reduce((sum, coin) => {
          if (watchlist?.includes(watchlist?.find((e) => e.id === coin?.id))) {
            return (
              sum +
              (coin?.market_data[period] *
                coin?.holding *
                coin?.market_data?.current_price[currency?.toLowerCase()]) /
                totalWeight
            );
          } else {
            return sum + 0;
          }
        }, 0)
    );
  }, [watchlist, userCoin2, userCoin3, period]);

  useEffect(() => {
    setCurrentPortfolioPrice(
      userCoin3?.length > 0 &&
        userCoin3?.reduce((sum, coin) => {
          if (watchlist?.includes(watchlist?.find((e) => e.id === coin?.id))) {
            return (
              sum +
              coin?.market_data?.current_price[currency?.toLowerCase()] *
                coin?.holding
            );
          } else {
            return sum + 0;
          }
        }, 0)
    );
  }, [watchlist, userCoin2, userCoin3, currency]);

  const topPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      if (
        watchlist?.includes(
          watchlist?.find((e) => e.id === prev?.id || e.id === current?.id)
        )
      ) {
        return prev?.market_data[period] > current?.market_data[period]
          ? prev
          : current;
      }
    });

  const worstPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      if (
        watchlist?.includes(
          watchlist?.find((e) => e.id === prev?.id || e.id === current?.id)
        )
      ) {
        return prev?.market_data[period] < current?.market_data[period]
          ? prev
          : current;
      }
    });

  useEffect(() => {
    userCoin2?.map((e) => {
      if (!coinAlert?.find(({ id }) => id === e.id)) {
        e.market_data.price_change_percentage_24h < -5 &&
          setCoinAlert((coinAlert) => [...coinAlert, e]);
      }
    });
  }, [userCoin2]);

  useEffect(() => {
    const sumArr = userCoin3?.map(
      (e) => e?.holding * e?.market_data?.current_price[currency?.toLowerCase()]
    );
    const sum = sumArr?.reduce((acc, val) => acc + val, 0);
    const holdingArr = userCoin3?.map((e) => {
      return {
        id: e.id,
        name: e.name,
        weight:
          e?.holding * e?.market_data?.current_price[currency?.toLowerCase()],
        total_weight: sum,
      };
    });

    setDonutCoin(holdingArr);
  }, [userCoin, userCoin2, userCoin3, watchlist]);

  console.log("donut", donutCoin);

  const setHoldingWatchlist = async (coin) => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.map((watch) =>
            watch.id === coin?.id
              ? { id: coin.id, holding: 0 }
              : { id: watch.id, holding: watch.holding }
          ),
        },
        { merge: "true" }
      );
    } catch (error) {}

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch.id !== coin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin.name} remove from your watchlist`,
        type: "success",
      });
    } catch (error) {}
  };

  const random_rgba = () => {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ",1";
  };
  const colourDoughnut = donutCoin?.map((e) => random_rgba());
  const weightageTooltip = `The weightage of each coin in your portfolio for the past ${days} day(s).`;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={currentAssetIcon} height="30" style={{ marginRight: 20 }} />
          <div>
            <Typography variant="h3" style={{ fontFamily: "VT323" }}>
              Current Asset
            </Typography>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <Typography variant="h5" style={{ fontFamily: "VT323" }}>
              Portfolio Price: {symbol}
              {user
                ? currentPortfolioPrice
                  ? currentPortfolioPrice?.toFixed(2)
                  : "0"
                : "0"}
            </Typography>
          </div>
        </div>

        {userState && (
          <div style={{ marginTop: 20, width: "90%" }}>
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
              }}
              style={{ backgroundColor: "rgba(100,100,100,0.0)" }}
            >
              <TableContainer
                component={Paper}
                style={{ backgroundColor: "transparent", color: "black" }}
              >
                <div
                  style={{
                    overflow: "auto",
                    maxHeight: isMobile ? "250px" : "550px",
                  }}
                >
                  <Table sx={{ minWidth: 650 }}>
                    <TableBody>
                      {userCoin3?.map((row) => {
                        if (
                          watchlist.includes(
                            watchlist.find((watch) => watch.id === row.id)
                          )
                        ) {
                          return (
                            <TableRow
                              key={row.name}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              {" "}
                              <TableCell
                                component="th"
                                scope="row"
                                style={{ color: "white" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div style={{ marginRight: 10 }}>
                                    <img src={row?.image?.thumb} height="20" />
                                  </div>
                                  <div>{row.name}</div>
                                </div>
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ color: "white" }}
                              >
                                <div>
                                  <div>
                                    {symbol}
                                    {row.holding *
                                      row.market_data.current_price[
                                        currency.toLowerCase()
                                      ] >=
                                    1
                                      ? (
                                          row.holding *
                                          row.market_data.current_price[
                                            currency.toLowerCase()
                                          ]
                                        ).toFixed(2)
                                      : (
                                          row.holding *
                                          row.market_data.current_price[
                                            currency.toLowerCase()
                                          ]
                                        ).toPrecision(4)}
                                  </div>
                                  <div>
                                    {row.holding >= 1
                                      ? row.holding.toFixed(2)
                                      : row?.holding.toPrecision(4)}{" "}
                                    {row.symbol?.toUpperCase()}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell align="right">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <HoldingModal coin={row} />
                                  <img
                                    src={DeleteIcon}
                                    height={20}
                                    onClick={() => {
                                      setHoldingWatchlist(row);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TableContainer>
            </Paper>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            margin: 20,
          }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "yellow",
              color: "black",
              fontFamily: "VT323",
              fontSize: "25px",
            }}
            onClick={() => {
              navigate("/coinList");
            }}
          >
            Add New Coin
          </Button>
        </div>
        <Typography variant="h2" style={{ fontFamily: "VT323" }}>
          Coin Weightage{" "}
          <Tooltip title={weightageTooltip}>
            <img src={infoicon} height="13" style={{ marginBottom: "25px" }} />
          </Tooltip>
        </Typography>
        {donutCoin && (
          <Doughnut
            data={{
              labels: donutCoin?.map((e) => {
                if (
                  watchlist.includes(
                    watchlist.find((watch) => watch.id === e?.id)
                  )
                ) {
                  return e.name;
                } else {
                  return "deleted";
                }
              }),
              datasets: [
                {
                  data: donutCoin
                    ? donutCoin?.map((e) => (e.weight / e.total_weight) * 100)
                    : [],
                  borderWidth: 0,
                  backgroundColor: colourDoughnut,
                  radius: "60%",
                },
              ],
            }}
            option={{
              animation: { animateRotate: false },
            }}
          />
        )}
      </div>
      <div className={classes.mainbar}>
        {!userState || userCoin2.length == 0 ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "800px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            Youre Portfolio is empty
          </div>
        ) : (
          <div style={{ width: "100%", paddingTop: 40 }}>
            <div className={classes.titleContainer}>
              <Typography variant="h3" style={{ fontFamily: "VT323" }}>
                Portfolio
              </Typography>
              <div className={classes.buttonContainer}>
                {chartDays.map((e) => {
                  if (e?.value !== 60) {
                    return (
                      <div
                        key={e.value}
                        onClick={() => {
                          setDays(e.value);
                          setPeriod(e.api_period);
                          setTimeFrame(e.label);
                          setVolatilityDesc(e.vol);
                        }}
                        className={classes.selectButton}
                        style={{
                          backgroundColor: e.value === days ? "#FFE227" : "",
                          color: e.value === days ? "black" : "",
                        }}
                      >
                        {e.label}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <Portfolioinfo
              avgPriceChange={avgPriceChange}
              topPerformCoin={topPerformCoin}
              Worst={worstPerformCoin}
              alert={coinAlert}
              period={period}
              timeFrame={timeFrame}
            />
            <PortfolioChart days={days} volatilityDesc={volatilityDesc} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
