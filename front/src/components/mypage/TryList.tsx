import { useEffect, useState } from "react";

import { TryShorts, getTryShorts } from "../../apis/shorts";
import ChallengeResultPage from "./ChallengeComponent";

export default function TryList() {
  const [shortsList, setShortsList] = useState<TryShorts[]>([]);

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
      {/* {Array.from({ length: Math.ceil(shortsList.length / 4) }, (_, index) => index * 4).map(
        (startIndex) => (
          <div key={startIndex}>
            <div style={{ display: "flex" }}>
              {shortsList.slice(startIndex, startIndex + 4).map((uploadShorts) => (
                <ChallengeResultPage uploadShorts={uploadShorts} />
              ))}
            </div>
          </div>
        )
      )} */}
    </div>
  );
}
