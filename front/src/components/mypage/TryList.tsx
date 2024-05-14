import { useEffect, useState } from "react";
import TryComponent from "./TryComponent";
import { shorts } from "../../apis/shorts";
import { getTryShorts } from "../../apis/mypage";

export default function TryList() {
  const [shortsList, setShortsList] = useState<shorts[]>([]);

  const getShorts = async () => {
    try {
      const data = await getTryShorts();
      setShortsList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getShorts();
  }, []);

  return (
    <div>
      {Array.from({ length: Math.ceil(shortsList.length / 4) }, (_, index) => index * 4).map(
        (startIndex) => (
          <div key={startIndex}>
            <div style={{ display: "flex" }}>
              {shortsList.slice(startIndex, startIndex + 4).map((uploadShorts) => (
                <TryComponent shorts={uploadShorts} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
