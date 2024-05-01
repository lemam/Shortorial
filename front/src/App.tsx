import { Routes, Route, BrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LearnPage from "./pages/LearnPage";
import GlobalStyle from "./GlobalStyle";
import ChallengePage from "./pages/ChallengePage";
import ChallengeResultPage from "./pages/ChallengeResultPage";
import VideoEditPage from "./pages/VideoEditPage";
import "bootstrap/dist/css/bootstrap.min.css";
import LearnPage1 from "./pages/LearnPage/LearnPage1";
import LearnPage2 from "./pages/LearnPage/LearnPage2";
import LearnPage3 from "./pages/LearnPage/LearnPage3";
import LearnPage4 from "./pages/LearnPage/LearnPage4";
import LearnPage5 from "./pages/LearnPage/LearnPage5";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn1" element={<LearnPage1 />} />
          <Route path="/learn2" element={<LearnPage2 />} />
          <Route path="/learn3" element={<LearnPage3 />} />
          <Route path="/learn4" element={<LearnPage4 />} />
          <Route path="/learn5" element={<LearnPage5 />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/challenge/result" element={<ChallengeResultPage />} />
          <Route path="/video-edit" element={<VideoEditPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
