import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./Pages/Homepage";
import CoinPage from "./Pages/CoinPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainPageLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Route>
      </Routes>
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
