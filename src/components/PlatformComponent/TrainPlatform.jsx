import { useState } from "react";

import DashboardComponent from "../Dashboard/DashboardComponent";
import InfoComponent from "./InfoComponent";
const priorityMap = { P1: 1, P2: 2, P3: 3 };
const TrainPlatform = () => {
  const [platformInput, setPlatformInput] = useState(2);
  const [trainData, setTrainData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const timeToDate = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map((item) => Number(item));
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const fileData = text.split("\n").filter((line) => line.trim());

      let trains = fileData.map((line) => {
        const [trainNumber, scheduledArrival, scheduledDeparture, priority] =
          line.split(",").map((item) => item.trim());
        return { trainNumber, scheduledArrival, scheduledDeparture, priority };
      });

      trains.sort((a, b) => {
        if (priorityMap[a.priority] !== priorityMap[b.priority]) {
          return priorityMap[a.priority] - priorityMap[b.priority];
        }
        return timeToDate(a.scheduledArrival) - timeToDate(b.scheduledArrival);
      });
      console.log(trains, "trains");

      setTrainData(trains);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const handlePlatformSubmit = () => {};

  const handlePlatformNumber = (e) => {
    setPlatformInput(e.target.value);
  };

  return (
    <div>
      <InfoComponent
        handleFileUpload={handleFileUpload}
        handlePlatformNumber={handlePlatformNumber}
        handlePlatformSubmit={handlePlatformSubmit}
        platformInput={platformInput}
        currentTime={currentTime}
      />
      <DashboardComponent trainData={trainData} />
    </div>
  );
};

export default TrainPlatform;
