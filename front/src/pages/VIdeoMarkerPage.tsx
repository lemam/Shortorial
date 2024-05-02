// 비디오를 클릭하면 시작 지점과 끝 지점을 잡을 수 있는 기능
// 트림 기능 없음
import React, { useState, useRef } from 'react';

const VideoMarker = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const [markers, setMarkers] = useState<{ start: number | null, end: number | null }>({ start: null, end: null });
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setMarkers({ start: null, end: null }); // Reset markers
    }
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;

    if (markers.start === null || (markers.start !== null && markers.end !== null)) {
      setMarkers({ start: time, end: null });
    } else {
      setMarkers({ ...markers, end: time });
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {videoSrc && (
        <div>
          <video ref={videoRef} src={videoSrc} controls onClick={handleVideoClick} width="500"></video>
          <p>
            <strong>Start Time:</strong> {markers.start?.toFixed(2)} seconds
          </p>
          <p>
            <strong>End Time:</strong> {markers.end?.toFixed(2)} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoMarker;
