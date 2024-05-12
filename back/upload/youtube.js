var fs = require("fs");
var { google } = require("googleapis");
var OAuth2 = google.auth.OAuth2;
const axios = require("axios");

const express = require("express"); // node 서버 프레임워크 express
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors()); // CORS를 허용하는 어플

var SCOPES = [
  // API 범위
  "https://www.googleapis.com/auth/youtube", // 유튜브 계정 확인
  "https://www.googleapis.com/auth/youtube.readonly", // 유튜브 계정 조회
  "https://www.googleapis.com/auth/youtube.upload", // 유튜브 업로드
];

// 토큰 저장 경로
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials/";

// 토큰 저장 경로 + 이름
var TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

// API키 확인
function loadCredentialsAndAuthorize(res, fileName) {
  fs.readFile("client_secret.json", (err, content) => {
    if (err) {
      console.log("Error loading client secret file:", err);
      // return res.status(500).send("Failed to load client secret file.");
    }
    authorize(JSON.parse(content), res, fileName);
  });
}

function authorize(credentials, res, fileName) {
  var { client_secret, client_id, redirect_uris } = credentials.installed;
  var oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      // 토큰 파일이 없으면
      getNewToken(oauth2Client, res, fileName); // 새로운 토큰 발급
    } else {
      // 토큰 파일이 읽히면
      oauth2Client.credentials = JSON.parse(token); // OAuth2 클라이언트 인스턴스 생성
      listChannels(oauth2Client, res, fileName); // 유튜브 채널 조회
    }
  });
}

// 토큰 발급
function getNewToken(oauth2Client, res, fileName) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state: fileName, // fileName을 쿼리스트링으로 전달
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
function listChannels(auth, res, fileName) {
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

          getFilePath(auth, fileName);
        }
      } catch (err) {
        console.log("Error processing the YouTube API response:", err);
      }
    }
  );
}

// 업로드할 파일 경로 가져오기
function getFilePath(auth, fileName) {
  axios
    .post(
      `http://localhost:8080/s3/bring/${fileName}`,
      {},
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsImlhdCI6MTcxNTUzMDE3OCwiZXhwIjoxNzE1NTMxOTc4fQ.o7HHIpTM_9euX1vsurFYcksFUB96SswC0hDNzJvS8jU",
        },
      }
    )
    .then((res) => {
      const filePath = res.data;
      uploadVideo(auth, filePath, fileName);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 유튜브 업로드
function uploadVideo(auth, filePath, fileName) {
  const service = google.youtube("v3");

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
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`Uploaded video ID: ${videoId}`);
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
  const fileName = req.query.fileName;
  loadCredentialsAndAuthorize(res, fileName);
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

      const fileName = req.query.state;
      listChannels(oauth2Client, fileName, res); // 유튜브 채널 조희
    });
  });
});

// 위치 중요! 라우터 다 설정하고 쓸 수 있음
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
