// // 트림 기능 역할
// // 직접 시간을 넣어서 수정된 영상을 보여줌
// // 파일 다운로드 다윤이가 한 기능 가져오면 될 듯

// import React, { useEffect, useState } from "react";
// // import { useDropzone } from 'react-dropzone';
// // import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// // import useChallengeStore from "../store/useChallengeStore";
// import { shorts } from "../apis/shorts";
// import { axios } from "../utils/axios";

// // const ffmpeg = createFFmpeg({ log: true });

// const VideoTrimPage = () => {
//   // const [outputVideo, setOutputVideo] = useState("");
//   // const [startTime, setStartTime] = useState(0);
//   // const [endTime, setEndTime] = useState(10);
//   // const [processing, setProcessing] = useState(false);
//   // const { downloadURL } = useChallengeStore();

//   // const handleTrim = async () => {
//   //   setProcessing(true);
//   //   if (!ffmpeg.isLoaded()) {
//   //     await ffmpeg.load();
//   //   }

//   //   const inputFilename = 'input.mp4';
//   //   const outputFilename = 'output.mp4';

//   //   ffmpeg.FS('writeFile', inputFilename, await fetchFile(downloadURL));
//   //   await ffmpeg.run('-i', inputFilename, '-ss', `${startTime}`, '-to', `${endTime}`, '-c', 'copy', outputFilename);

//   //   const output = ffmpeg.FS('readFile', outputFilename);
//   //   const outputUrl = URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));
//   //   setOutputVideo(outputUrl);
//   //   setProcessing(false);
//   // };

//   const [shortsList, setShortsList] = useState<shorts[]>([]);

//   function getYoutubeThumbnail(url: string): string {
//     const videoId = url.split("v=")[1];
//     const ampersandPosition = videoId.indexOf("&");
//     if (ampersandPosition !== -1) {
//       return `https://img.youtube.com/vi/${videoId.substring(
//         0,
//         ampersandPosition
//       )}/0.jpg`;
//     }
//     return `https://img.youtube.com/vi/${videoId}/0.jpg`;
//   }
//   interface VideoThumbnailProps {
//     videoUrl: string;
//   }
//   const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoUrl }) => {
//     let thumbnailUrl = "";

//     thumbnailUrl = getYoutubeThumbnail(videoUrl);

//     return <img src={thumbnailUrl} alt="Video Thumbnail" />;
//   };

//   useEffect(() => {
//     axios
//       .get<shorts[]>("/api/shorts")
//       .then((response) => {
//         setShortsList(response.data);
//         console.log(response.data);
//         console.log(shortsList);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   return (
//     // <div>
//     //   {downloadURL && (
//     //     <>
//     //       <video controls width="250" src={downloadURL} style={{ marginTop: '20px' }}></video>
//     //       <div>
//     //         <label>
//     //           Start time (seconds):
//     //           <input type="number" value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} />
//     //         </label>
//     //         <label>
//     //           End time (seconds):
//     //           <input type="number" value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} />
//     //         </label>
//     //         <button onClick={handleTrim} disabled={processing}>Trim Video</button>
//     //       </div>
//     //       {outputVideo && (
//     //         <div>
//     //           <h3>Trimmed Video</h3>
//     //           <video controls width="250" src={outputVideo}></video>
//     //         </div>
//     //       )}
//     //     </>
//     //   )}
//     // </div>
//     <div>
//       <h1>쇼츠 목록</h1>
//       <div>
//         {shortsList.map((shorts) => (
//           <div key={shorts.shortsNo}>
//             {VideoThumbnail(shorts.shortsUrl)}
//             <h2>쇼츠 제목 : {shorts.shortsTitle}</h2>
//             <p>쇼츠 디렉터 : {shorts.shortsDirector}</p>
//             <p>쇼츠 시간 : {shorts.shortsTime}</p>
//             <p>쇼츠 참여 인원 : {shorts.shortsChallengers}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoTrimPage;
