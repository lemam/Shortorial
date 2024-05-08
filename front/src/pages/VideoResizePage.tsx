// // Video 드래그를 통해 사이즈를 조정하는 페이지
// // 파일 업로드가 안되고 있음, VideoTrimPage 섞어서 쓰면 가능할 듯

// import React, { useRef, useEffect, useState } from "react";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// const ffmpeg = createFFmpeg({ log: true });

// const VideoResizePage = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [videoSrc, setVideoSrc] = useState("");
//   const [outputVideo, setOutputVideo] = useState("");
//   const [dragging, setDragging] = useState(false);
//   const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
//   const [processing, setProcessing] = useState(false);

//   useEffect(() => {
//     if (videoRef.current && canvasRef.current && videoSrc) {
//       const ctx = canvasRef.current.getContext("2d");
//       videoRef.current.addEventListener("loadeddata", () => {
//         const width = videoRef.current.videoWidth;
//         const height = videoRef.current.videoHeight;
//         canvasRef.current.width = width;
//         canvasRef.current.height = height;
//         ctx.drawImage(videoRef.current, 0, 0, width, height);
//         setVideoSize({ width, height });
//       });
//     }
//   }, [videoSrc]);

//   const handleMouseDown = () => {
//     setDragging(true);
//   };

//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   const handleMouseMove = (event) => {
//     if (dragging) {
//       const newWidth =
//         event.clientX - canvasRef.current.getBoundingClientRect().left;
//       const newHeight =
//         event.clientY - canvasRef.current.getBoundingClientRect().top;
//       setVideoSize({ width: newWidth, height: newHeight });
//       const ctx = canvasRef.current.getContext("2d");
//       ctx.drawImage(videoRef.current, 0, 0, newWidth, newHeight);
//     }
//   };

//   const handleVideoUpload = async (event) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       const url = URL.createObjectURL(file);
//       setVideoSrc(url);
//       setOutputVideo("");
//     }
//   };

//   const resizeVideo = async () => {
//     setProcessing(true);
//     if (!ffmpeg.isLoaded()) {
//       await ffmpeg.load();
//     }

//     const inputFilename = "input.mp4";
//     const outputFilename = "output.mp4";

//     ffmpeg.FS("writeFile", inputFilename, await fetchFile(videoSrc));
//     await ffmpeg.run(
//       "-i",
//       inputFilename,
//       "-vf",
//       `scale=${videoSize.width}:${videoSize.height}`,
//       outputFilename
//     );

//     const output = ffmpeg.FS("readFile", outputFilename);
//     const outputUrl = URL.createObjectURL(
//       new Blob([output.buffer], { type: "video/mp4" })
//     );
//     setOutputVideo(outputUrl);
//     setProcessing(false);
//   };

//   return (
//     <div>
//       <input type="file" accept="video/*" onChange={handleVideoUpload} />
//       <canvas
//         ref={canvasRef}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//         onMouseMove={handleMouseMove}
//       ></canvas>
//       {outputVideo && (
//         <div>
//           <h3>Resized Video</h3>
//           <video controls width="500" src={outputVideo}></video>
//         </div>
//       )}
//       <button onClick={resizeVideo} disabled={processing}>
//         Resize Video
//       </button>
//     </div>
//   );
// };

// export default VideoResizePage;
