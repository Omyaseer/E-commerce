import { useEffect, useState } from "react";

function Timer() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const day = now.getDate();
  const hou = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();

  return (
    <>
      <div className="d-flex gap-2 mx-md-3 mx-lg-4 px-2 mx-5 pt-1">
        <div className="d-flex flex-column text-center ">
          <span className="text-secondary small">Days</span>
          <h2 className="d">{String(day).padStart(2, "0")}</h2>
        </div>

        <span className="text-danger fs-4 pt-4">:</span>

        <div className="d-flex flex-column text-center">
          <span className="text-secondary small">Hours</span>
          <h2 className="h">{String(hou).padStart(2, "0")}</h2>
        </div>

        <span className="text-danger fs-4 pt-4">:</span>

        <div className="d-flex flex-column text-center">
          <span className="text-secondary small">Minutes</span>
          <h2 className="m">{String(min).padStart(2, "0")}</h2>
        </div>

        <span className="text-danger fs-4 pt-4">:</span>

        <div className="d-flex flex-column text-center">
          <span className="text-secondary small">Seconds</span>
          <h2 className="s">{String(sec).padStart(2, "0")}</h2>
        </div>
      </div>
    </>
  );
}

export default Timer;
