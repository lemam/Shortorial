import { Card } from "react-bootstrap";
import { CardSubTitleSkeleton, CardTitleSkeleton, CardVideoSkeleton } from "./style";

const ShortsCardSkeleton = () => {
  return (
    <Card>
      <CardVideoSkeleton />
      <CardTitleSkeleton />
      <CardSubTitleSkeleton />
    </Card>
  );
};

export default ShortsCardSkeleton;
