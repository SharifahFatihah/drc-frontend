import getNews from "../service/newsservice";
import { makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import mario from "../asset/marioreading.png"

const useStyles = makeStyles((theme) => ({
  newsbox: {
    backgroundColor: "grey",
    border: "1px solid white",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    padding: 20,
    width: "25%",
    margin: 15,
    borderRadius: "15px",

    // maxHeight: "225px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "flex-start",
    },
  },
  Header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding:100,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
      flexDirection: "column",
    },
  },
}));

function NewsPage() {
  const classes = useStyles();
  const [articles, setArticles] = useState([]);
  const [show, setshow] = useState(6);
  const showMoreNews = () => {
    setshow((preValue) => preValue + 3);
  };

  useEffect(() => {
    getNews().then((e) => setArticles(e.data.value));
  }, []);

  console.log(articles);

  return (
    <>
      <div className={classes.Header}>
        <img src={mario} height={500} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{fontSize:130}}> crypto News</h1>
          <h2> Why should buy the gold disc original and not the purple disc DVDR</h2>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {articles
          .slice(0, show)
          .sort(function (a, b) {
            return new Date(b.datePublished) - new Date(a.datePublished);
          })
          .map((article) => {
            return (
              <div
                className={classes.newsbox}
                onClick={() => {
                  window.open(article?.url);
                }}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <div style={{ display: "flex", margin: 10 }}>
                    <div style={{ marginRight: 20 }}>
                      <img
                        src={
                          article?.image?.thumbnail?.contentUrl
                            ? article?.image?.thumbnail?.contentUrl
                            : "https://thumbs.dreamstime.com/b/forbidden-sign-no-pass-bypassing-icon-pixel-art-style-black-passing-bypass-unique-color-high-definition-perfect-web-149381794.jpg"
                        }
                        height={100}
                      />
                    </div>

                    <Typography
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      {article?.name}
                    </Typography>
                  </div>

                  <Typography
                    style={{ color: "white", marginBottom: "revert" }}
                  >
                    {article.description.length > 100
                      ? `${article.description.substring(0, 100)}...`
                      : article.description}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={
                          article.provider[0]?.image?.thumbnail?.contentUrl
                            ? article.provider[0]?.image?.thumbnail?.contentUrl
                            : "https://thumbs.dreamstime.com/b/forbidden-sign-no-pass-bypassing-icon-pixel-art-style-black-passing-bypass-unique-color-high-definition-perfect-web-149381794.jpg"
                        }
                        height={30}
                        style={{ marginRight: 5, borderRadius: "50%" }}
                      />
                      <p>{article?.provider[0]?.name}</p>
                    </div>
                    <p style={{ color: "black" }}>
                      {`${moment(article?.datePublished)
                        .startOf("ss")
                        .fromNow()}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <button
          onClick={showMoreNews}
          style={{
            cursor: "pointer",
          }}
        >
          Load More
        </button>
      </div>
    </>
  );
}

export default NewsPage;
