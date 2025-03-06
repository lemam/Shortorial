import { PlayArrow, Repeat, Flip, Videocam } from "@mui/icons-material";

export const motionButtons = [
  {
    icon: <PlayArrow />,
    action: "play",
  },
  {
    icon: <Repeat />,
    action: "repeat",
  },
  {
    icon: <Flip />,
    action: "mirror",
  },
  {
    icon: `${1}x`,
    action: "speed",
  },
  {
    icon: <Videocam />,
    action: "challenge",
  },
];
