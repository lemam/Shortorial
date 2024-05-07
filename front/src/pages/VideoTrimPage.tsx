// 트림 기능 역할
// 직접 시간을 넣어서 수정된 영상을 보여줌
// 파일 다운로드 다윤이가 한 기능 가져오면 될 듯

import React, { useEffect, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// import useChallengeStore from "../store/useChallengeStore";
import { shorts } from '../apis/shorts';
import { axios } from '../utils/axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../components/modal/ModalComponent';

// const ffmpeg = createFFmpeg({ log: true });

const VideoTrimPage = () => {
  // const [outputVideo, setOutputVideo] = useState("");
  // const [startTime, setStartTime] = useState(0);
  // const [endTime, setEndTime] = useState(10);
  // const [processing, setProcessing] = useState(false);
  // const { downloadURL } = useChallengeStore();

  // const handleTrim = async () => {
  //   setProcessing(true);
  //   if (!ffmpeg.isLoaded()) {
  //     await ffmpeg.load();
  //   }

  //   const inputFilename = 'input.mp4';
  //   const outputFilename = 'output.mp4';

  //   ffmpeg.FS('writeFile', inputFilename, await fetchFile(downloadURL));
  //   await ffmpeg.run('-i', inputFilename, '-ss', `${startTime}`, '-to', `${endTime}`, '-c', 'copy', outputFilename);

  //   const output = ffmpeg.FS('readFile', outputFilename);
  //   const outputUrl = URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));
  //   setOutputVideo(outputUrl);
  //   setProcessing(false);
  // };

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const goToLearnMode = () => {
    navigate("/learn");
  };

  const goToChallengeMode = () => {
    navigate("/challenge");
  };

  const [shortsList, setShortsList] = useState<shorts[]>([]);

  useEffect(() => {
    axios.get<shorts[]>("/api/shorts")
      .then(response => {
        setShortsList(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [])

  return (
    // <div>
    //   {downloadURL && (
    //     <>
    //       <video controls width="250" src={downloadURL} style={{ marginTop: '20px' }}></video>
    //       <div>
    //         <label>
    //           Start time (seconds):
    //           <input type="number" value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} />
    //         </label>
    //         <label>
    //           End time (seconds):
    //           <input type="number" value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} />
    //         </label>
    //         <button onClick={handleTrim} disabled={processing}>Trim Video</button>
    //       </div>
    //       {outputVideo && (
    //         <div>
    //           <h3>Trimmed Video</h3>
    //           <video controls width="250" src={outputVideo}></video>
    //         </div>
    //       )}
    //     </>
    //   )}
    // </div>
    <div>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(162px, 1fr))",
          gap: "16px 16px",
        }}
      >
        <div>
        {shortsList.map(shorts => (
          <div key={shorts.shortsNo}>
            <VideoBox onClick={handleShowModal}>
              <video src={shorts.shortsLink}></video>
            </VideoBox>
            <ModalComponent
              title={shorts.shortsTitle}
              body={
                <VideoBox>
                  <video src={shorts.shortsLink} autoPlay loop></video>
                </VideoBox>
              }
              showModal={showModal}
              handleCloseModal={handleCloseModal}
              goToLearnMode={goToLearnMode}
              goToChallengeMode={goToChallengeMode}
              />
              <p>쇼츠 제목 : {shorts.shortsTitle}</p>
              <p>쇼츠 디렉터 : {shorts.shortsDirector}</p>
              <p>쇼츠 시간 : {shorts.shortsTime}</p>
              <p>쇼츠 참여 인원 : {shorts.shortsChallengers}</p>
          </div>
        ))}
          
        </div>
      </div>
    </div>
  );
};

export default VideoTrimPage;

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 286px;
  border-radius: 8px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;