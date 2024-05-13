import { Routes, Route, BrowserRouter } from "react-router-dom";
import GlobalStyle from "./GlobalStyle";
import MainPage from "./pages/MainPage";
import LoginForm from "./pages/LoginForm";
import LearnPage from "./pages/LearnPage";
import LearnPageTmp from "./pages/LearnPageTmp";
import ChallengePage from "./pages/ChallengePage";
import ChallengeResultPage from "./pages/ChallengeResultPage";
import VideoTrimPage from "./pages/VideoTrimPage";
import VideoMarkerPage from "./pages/VIdeoMarkerPage";
// import VideoResizePage from "./pages/VideoResizePage";
import MyPage from "./pages/MyPage";
import ShortsDetailPage from "./pages/ShortsDetailPage";
import FeedPage from "./pages/FeedPage";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUp from "./pages/SignUpPage";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn2" element={<LearnPageTmp />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/challenge/result" element={<ChallengeResultPage />} />
          <Route path="/video-trim" element={<VideoTrimPage />} />
          <Route path="/video-marker" element={<VideoMarkerPage />} />
          {/* <Route path="/video-resize" element={<VideoResizePage />} /> */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/shorts/:shortsNo" element={<ShortsDetailPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
