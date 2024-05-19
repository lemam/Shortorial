require("dotenv").config();

var fs = require("fs");
var { google } = require("googleapis");
var OAuth2 = google.auth.OAuth2;
const axios = require("axios");

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors()); // CORS 허용

var SCOPES = [
  // API 범위
  "https://www.googleapis.com/auth/youtube", // 유튜브 계정 확인
  "https://www.googleapis.com/auth/youtube.readonly", // 유튜브 계정 조회
  "https://www.googleapis.com/auth/youtube.upload", // 유튜브 업로드
];

const homeUrl = process.env.VITE_HOME_URL;

// 토큰 저장 경로
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials/";

// 토큰 저장 경로 + 이름
var TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

// API키 확인
function loadCredentialsAndAuthorize(res, filePath, uploadNo) {
  fs.readFile("client_secret.json", (err, content) => {
    if (err) {
      console.log("Error loading client secret file:", err);
      // return res.status(500).send("Failed to load client secret file.");
    }
    authorize(JSON.parse(content), res, filePath, uploadNo);
  });
}

function authorize(credentials, res, filePath, uploadNo) {
  var { client_secret, client_id, redirect_uris } = credentials.installed;
  var oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      // 토큰 파일이 없으면
      getNewToken(oauth2Client, res); // 새로운 토큰 발급
    } else {
      // 토큰 파일이 읽히면
      oauth2Client.credentials = JSON.parse(token); // OAuth2 클라이언트 인스턴스 생성
      listChannels(oauth2Client, res, filePath, uploadNo); // 유튜브 채널 조회
    }
  });
}

// 토큰 발급
function getNewToken(oauth2Client, res) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  res.json({ authUrl }); // 인증 URL 전달
}

// 토큰 저장
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
}

// 유튜브 채널 조회
function listChannels(auth, res, filePath, uploadNo) {
  var service = google.youtube("v3");
  service.channels.list(
    {
      auth: auth,
      part: "snippet,contentDetails,statistics",
      forUsername: "GoogleDevelopers",
    },
    (err, response) => {
      try {
        if (err) {
          console.log("The API returned an error:", err);
          // return res.status(500).send("API error.");
        }

        if (!response.data) return;

        var channels = response.data.items;
        if (channels.length == 0) {
          console.log("No channel found.");
          // return res.send("No channel found.");
        } else {
          var channel = channels[0];
          console.log(
            `This channel's ID is ${channel.id}.`
            // `This channel's ID is ${channel.id}. Its title is '${channel.snippet.title}', and it has ${channel.statistics.viewCount} views.`
          );

          uploadVideo(auth, filePath, uploadNo);
        }
      } catch (err) {
        console.log("Error processing the YouTube API response:", err);
      }
    }
  );
}

// 유튜브 업로드
function uploadVideo(auth, filePath, uploadNo) {
  const service = google.youtube("v3");

  const startStr = "downloaded-";
  const endStr = ".mp4";
  const startIndex = filePath.indexOf(startStr) + startStr.length;
  const endIndex = filePath.indexOf(endStr);
  const fileName = filePath.substring(startIndex, endIndex);

  service.videos.insert(
    {
      auth: auth,
      part: "id,snippet,status,player",
      requestBody: {
        snippet: {
          title: `${fileName}`, // 영상 제목
          // description: "youtube upload api",
          // tags: ["videos.insert"],
        },
        status: {
          privacyStatus: "private", // 공개 범위
        },
      },
      media: {
        body: fs.createReadStream(filePath), // 파일 경로에서 파일을 읽음
      },
    },
    (err, response) => {
      if (err) {
        console.error("Upload Error:", err);
        return;
      }

      try {
        // 업로드된 비디오 정보
        const videoId = response.data.id;
        console.log(`Uploaded video ID: ${videoId}`);

        axios
          .put(`${homeUrl}/api/shorts/youtubeUrl/${uploadNo}/${videoId}`)
          .then((res) => console.log("url save sucess:"))
          .catch((err) => console.log("url save fail:", err));

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`Video URL: ${videoUrl}`);

        // console.log("Title:", response.data.snippet.title);
        // console.log("Description:", response.data.snippet.description);
        // if (response.data.player) {
        //   console.log("Embed HTML:", response.data.player.embedHtml);
        // }
      } catch (err) {
        console.log("Error processing response:", err);
      } finally {
        // 임시파일 삭제
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete the file:", err);
          } else {
            console.log("File successfully deleted after upload.");
          }
        });
      }
    }
  );
}

// 인증 시작 API
app.get("/authenticate", (req, res) => {
  const filePath = req.query.filePath;
  const uploadNo = req.query.uploadNo;
  loadCredentialsAndAuthorize(res, filePath, uploadNo);
});

// 인증 후 리다이렉트하는 경로
app.get("/oauth2callback", (req, res) => {
  // API키 읽기
  fs.readFile("client_secret.json", (err, content) => {
    if (err) {
      console.log("Failed to load client secret file.");
      // return res.status(500).send("Failed to load client secret file.");
    }

    var credentials = JSON.parse(content);
    var { client_secret, client_id, redirect_uris } = credentials.installed;
    // / OAuth2 클라이언트 인스턴스 생성
    var oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);

    // 리다이렉트 경로에서 code 가져옴
    const code = req.query.code;

    // 토큰 생성
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error("Error trying to retrieve access token", err);
        // return res.status(500).send("Failed to retrieve access token.");
      }

      oauth2Client.credentials = token;
      storeToken(token); // 토큰 저장

      // 원래 url로 리다이렉트
      res.redirect("http://localhost:3000/mypage?auth=true");
    });
  });
});

// 위치 중요! 라우터 다 설정하고 쓸 수 있음
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
