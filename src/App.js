import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./Pages/Homepage";
import CoinPage from "./Pages/CoinPage";
import { makeStyles } from "@material-ui/core";
import "./App.css";

const useStyles = makeStyles(() => ({
  app: {
    backgroundColor: "#1b0a24",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.app}>
        <Routes>
          <Route element={<MainPageLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/coins/:id" element={<CoinPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function MainPageLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
