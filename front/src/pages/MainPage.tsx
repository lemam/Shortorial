import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <>
      <div>메인 페이지</div>
      <Link to={"/learn"}>쇼츠를 눌러주세용</Link>
    </>
  );
}
