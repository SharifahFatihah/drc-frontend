import axios from "axios";

const getNews = () => {
 const options = {
   method: "GET",
   url: "https://bing-news-search1.p.rapidapi.com/news/search",
   params: {
     q: "crypto",
     count: "100",
     freshness: "Day",
     textFormat: "Raw",
     safeSearch: "Off",
   },
   headers: {
     "X-BingApis-SDK": "true",
     "X-RapidAPI-Key": "867dbb6637msh6800cd75985b15cp10f58cjsn43e4b889016a",
     "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
   },
 };

  return axios.request(options);
};

export default getNews;
