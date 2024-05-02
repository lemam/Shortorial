// 트림 기능 역할
// 직접 시간을 넣어서 수정된 영상을 보여줌
// 파일 다운로드 다윤이가 한 기능 가져오면 될 듯

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const VideoTrimPage = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const [outputVideo, setOutputVideo] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [processing, setProcessing] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleTrim = async () => {
    setProcessing(true);
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const inputFilename = 'input.mp4';
    const outputFilename = 'output.mp4';

    ffmpeg.FS('writeFile', inputFilename, await fetchFile(videoSrc));
    await ffmpeg.run('-i', inputFilename, '-ss', `${startTime}`, '-to', `${endTime}`, '-c', 'copy', outputFilename);

    const output = ffmpeg.FS('readFile', outputFilename);
    const outputUrl = URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));
    setOutputVideo(outputUrl);
    setProcessing(false);
  };

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop video file here, or click to select file</p>
      </div>
      {videoSrc && (
        <>
          <video controls width="250" src={videoSrc} style={{ marginTop: '20px' }}></video>
          <div>
            <label>
              Start time (seconds):
              <input type="number" value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} />
            </label>
            <label>
              End time (seconds):
              <input type="number" value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} />
            </label>
            <button onClick={handleTrim} disabled={processing}>Trim Video</button>
          </div>
          {outputVideo && (
            <div>
              <h3>Trimmed Video</h3>
              <video controls width="250" src={outputVideo}></video>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoTrimPage;
