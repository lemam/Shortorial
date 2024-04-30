import { Routes, Route, BrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LearnPage from "./pages/LearnPageTmp";
import GlobalStyle from "./GlobalStyle";
import ChallengePage from "./pages/ChallengePage";
import ChallengeResultPage from "./pages/ChallengeResultPage";
import VideoEditPage from "./pages/VideoEditPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/challenge/result" element={<ChallengeResultPage />} />
          <Route path="/video-edit" element={<VideoEditPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
