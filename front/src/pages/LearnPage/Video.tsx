interface VideoType {
  src: string;
}

const Video = ({ src }: VideoType) => {
  return <video src={src}></video>;
};

export default Video;
