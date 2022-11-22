import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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

  const [coinAlert, setCoinAlert] = useState([]);

  const [loading, setLoading] = useState(false);

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

    console.log("render", watchlist);
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
  console.log("usercoin3", userCoin3);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  const avgPriceChange =
    userCoin2.length > 0 &&
    userCoin2?.reduce((sum, coin) => {
      return (sum + coin?.market_data[period]) / userCoin2.length;
    }, 0);

  const topPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      return prev?.market_data[period] > current?.market_data[period]
        ? prev
        : current;
    });
  const worstPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      return prev?.market_data[period] < current?.market_data[period]
        ? prev
        : current;
    });

  useEffect(() => {
    userCoin2.map(
      (e) =>
        e.market_data.price_change_percentage_24h < -5 &&
        setCoinAlert((coinAlert) => [
          ...coinAlert,
          {
            id: e.id,
            priceChange: e.market_data.price_change_percentage_24h,
          },
        ])
    );
    console.log("watchlist1", watchlist);
  }, [userCoin2]);

  console.log("usercoin2", userCoin2);

  const removeFromWatchlist = async (usercoin) => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch.id !== usercoin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${usercoin.name} remove from your watchlist`,
        type: "success",
      });
    } catch (error) {}
  };

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

  // console.log("alerts", coinAlert);
  // console.log("worst", worstPerformCoin);
  // console.log("top", topPerformCoin);
  // console.log("avg", avgPriceChange);
  // console.log("usercoin", userCoin2);

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
            <PortfolioChart days={days} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
