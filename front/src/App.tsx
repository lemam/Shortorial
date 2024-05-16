import { Routes, Route, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PrivateRoute from "./modules/auth/PrivateRoute";
import GlobalStyle from "./GlobalStyle";
import MainPage from "./pages/MainPage";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import SignUp from "./pages/SignUpPage";
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

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<PrivateRoute component={<MainPage />} />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/learn/:shortsNo" element={<PrivateRoute component={<LearnPage />} />} />
          <Route path="/learn2" element={<LearnPageTmp />} />
          <Route path="/challenge" element={<PrivateRoute component={<ChallengePage />} />} />
          <Route
            path="/challenge/result"
            element={<PrivateRoute component={<ChallengeResultPage />} />}
          />
          <Route path="/video-trim" element={<VideoTrimPage />} />
          <Route path="/video-marker" element={<VideoMarkerPage />} />
          {/* <Route path="/video-resize" element={<VideoResizePage />} /> */}
          <Route path="/mypage" element={<MyPage />} />
          <Route
            path="/shorts/:shortsNo"
            element={<PrivateRoute component={<ShortsDetailPage />} />}
          />
          <Route path="/feed" element={<FeedPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
