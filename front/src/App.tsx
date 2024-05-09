import { Routes, Route, BrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LearnPage from "./pages/LearnPage";
import GlobalStyle from "./GlobalStyle";
import ChallengePage from "./pages/ChallengePage";
import ChallengeResultPage from "./pages/ChallengeResultPage";
import VideoTrimPage from "./pages/VideoTrimPage";
import VideoMarkerPage from "./pages/VIdeoMarkerPage";
// import VideoResizePage from "./pages/VideoResizePage";
import "bootstrap/dist/css/bootstrap.min.css";
import LearnPageTmp from "./pages/LearnPageTmp";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<MainPage />}
          />
          <Route
            path="/learn"
            element={<LearnPage />}
          />
          <Route
            path="/learn2"
            element={<LearnPageTmp />}
          />
          <Route
            path="/challenge"
            element={<ChallengePage />}
          />
          <Route
            path="/challenge/result"
            element={<ChallengeResultPage />}
          />
          <Route path="/video-trim" element={<VideoTrimPage />} />
          <Route
            path="/video-marker"
            element={<VideoMarkerPage />}
          />
          {/* <Route path="/video-resize" element={<VideoResizePage />} /> */}
          <Route
            path="/mypage"
            element={<MyPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
