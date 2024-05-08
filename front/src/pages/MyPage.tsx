import { useEffect, useState } from "react";

const MyPage = () => {
  const videoUrl =
    "https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/Shorts/%EC%95%84%ED%94%88%EA%B1%B4+%EB%94%B1+%EC%A7%88%EC%83%89%EC%9D%B4%EB%8B%88%EA%B9%8C";
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();

    // 컴포넌트 언마운트 시 생성된 blob URL 해제
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div>
      <h1>Hello</h1>
      <p>World</p>
      {blobUrl ? (
        <video
          controls
          width="600"
        >
          <source
            src={blobUrl}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default MyPage;
