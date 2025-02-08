import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import DashboardComponent from "../Dashboard/DashboardComponent";
import InfoComponent from "./InfoComponent";
import { PriorityQueue, STATUS_OBJ } from "../../helper";
import "./commonStyles.css";
import UploadImg from "../../assets/upload.png";
import PlatformDisplayComponent from "./PlatformDisplayComponent";
const TrainPlatform = () => {
  const [platformInput, setPlatformInput] = useState(2);
  const [trainData, setTrainData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState(null);
  const timeToDate = useCallback((timeStr) => {
    const [hours, minutes] = timeStr.split(":").map((item) => Number(item));
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, []);

  const dateToTimeString = useCallback((date) => {
    return date.toTimeString().substring(0, 5);
  }, []);

  // Update current time every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  // Update train statuses whenever current time changes
  useEffect(() => {
    if (trainData.length > 0) {
      updateTrainStatuses();
    }
  }, [currentTime]);

  const getTrainStatus = useCallback(
    (train, currentTime) => {
      // Validate input
      if (!train || !currentTime) {
        console.error("Invalid train or current time:", { train, currentTime });
        return STATUS_OBJ.SCHEDULED;
      }

      try {
        const arrivalTime = timeToDate(train.actualArrival);
        const departureTime = timeToDate(train.actualDeparture);

        let status;
        if (currentTime < arrivalTime) {
          status = STATUS_OBJ.SCHEDULED;
        } else if (currentTime >= arrivalTime && currentTime < departureTime) {
          status = STATUS_OBJ.AT_PLATFORM;
        } else {
          status = STATUS_OBJ.DEPARTED;
        }

        return status;
      } catch (err) {
        console.error("Error determining train status:", err);
        return STATUS_OBJ.SCHEDULED;
      }
    },
    [timeToDate]
  );

  const updateTrainStatuses = useCallback(() => {
    try {
      const updatedTrains = trainData.map((train) => {
        // Validate each train object
        if (!train || typeof train !== "object") {
          console.error("Invalid train object:", train);
          return train;
        }
        return {
          ...train,
          status: getTrainStatus(train, currentTime),
        };
      });
      setTrainData(updatedTrains);
    } catch (err) {
      console.error("Error updating train statuses:", err);
      setError("Failed to update train statuses");
    }
  }, [trainData, getTrainStatus, currentTime]);

  const getNextAvailableTime = useCallback(
    (platform, trainStart, allocatedTrains) => {
      const trainsOnPlatform = allocatedTrains
        .filter((t) => t.platformNumber === platform)
        .sort(
          (a, b) =>
            timeToDate(a.actualDeparture) - timeToDate(b.actualDeparture)
        );

      if (trainsOnPlatform.length === 0) return trainStart;

      const lastTrain = trainsOnPlatform[trainsOnPlatform.length - 1];
      const lastDeparture = timeToDate(lastTrain.actualDeparture);

      return lastDeparture > trainStart ? lastDeparture : trainStart;
    },
    [timeToDate]
  );

  const allocatePlatformAndTime = useCallback(
    (train, allocatedTrains, numPlatforms) => {
      const scheduledArrival = timeToDate(train.scheduledArrival);
      const scheduledDuration =
        timeToDate(train.scheduledDeparture) -
        timeToDate(train.scheduledArrival);

      let bestPlatform = 1;
      let earliestPossibleStart = new Date(8640000000000000);

      for (let platform = 1; platform <= numPlatforms; platform++) {
        const nextAvailable = getNextAvailableTime(
          platform,
          scheduledArrival,
          allocatedTrains
        );
        if (nextAvailable < earliestPossibleStart) {
          earliestPossibleStart = nextAvailable;
          bestPlatform = platform;
        }
      }

      const actualArrival = earliestPossibleStart;
      const actualDeparture = new Date(
        actualArrival.getTime() + scheduledDuration
      );
      console.log(
        getTrainStatus(
          {
            actualArrival: dateToTimeString(actualArrival),
            actualDeparture: dateToTimeString(actualDeparture),
          },
          currentTime
        )
      );
      return {
        ...train,
        platformNumber: bestPlatform,
        actualArrival: dateToTimeString(actualArrival),
        actualDeparture: dateToTimeString(actualDeparture),
        delay: Math.round((actualArrival - scheduledArrival) / (1000 * 60)),
        status: getTrainStatus(
          {
            actualArrival: dateToTimeString(actualArrival),
            actualDeparture: dateToTimeString(actualDeparture),
          },
          currentTime
        ),
      };
    },
    [
      getTrainStatus,
      dateToTimeString,
      getNextAvailableTime,
      timeToDate,
      currentTime,
    ]
  );

  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const fileData = text
          .split("\n")
          .filter((line, index) => index > 0 && line.trim());

        const trainQueue = new PriorityQueue();

        // Add trains to priority queue
        fileData.forEach((line) => {
          const [trainNumber, scheduledArrival, scheduledDeparture, priority] =
            line.split(",").map((item) => item.trim());
          trainQueue.enqueue({
            trainNumber,
            scheduledArrival,
            scheduledDeparture,
            priority,
          });
        });

        // Allocate platforms based on priority queue
        const allocatedTrains = [];
        while (!trainQueue.isEmpty()) {
          const train = trainQueue.dequeue();
          const allocatedTrain = allocatePlatformAndTime(
            train,
            allocatedTrains,
            platformInput
          );
          allocatedTrains.push(allocatedTrain);
        }
        console.log(allocatedTrains, "alloasldasldlos");
        setTrainData(allocatedTrains);
      } catch (error) {
        console.error("Error processing file:", error);
      }
    },
    [allocatePlatformAndTime, platformInput]
  );

  const handlePlatformSubmit = useCallback(() => {
    if (platformInput >= 2 && platformInput <= 20) {
      if (trainData.length > 0) {
        // Create new priority queue with existing trains
        const priorityQueue = new PriorityQueue();
        trainData.forEach((train) => priorityQueue.enqueue(train));

        // Reallocate platforms
        const newAllocatedTrains = [];
        while (!priorityQueue.isEmpty()) {
          const train = priorityQueue.dequeue();
          const reallocatedTrain = allocatePlatformAndTime(
            train,
            newAllocatedTrains,
            platformInput
          );
          newAllocatedTrains.push(reallocatedTrain);
        }

        setTrainData(newAllocatedTrains);
      }
    }
  }, [allocatePlatformAndTime, platformInput, trainData]);

  const handlePlatformNumber = useCallback((e) => {
    setPlatformInput(e.target.value);
  }, []);

  const fileInputRef = useRef(null);
  const handleButtonClick = useCallback(() => {
    fileInputRef.current.click(); // Programmatically trigger file input
  }, []);

  const dashboardProps = useMemo(
    () => ({
      trainData,
    }),
    [trainData]
  );

  const infoComponentProps = useMemo(
    () => ({
      handlePlatformNumber,
      handlePlatformSubmit,
      platformInput,
      currentTime,
    }),
    [handlePlatformNumber, handlePlatformSubmit, platformInput, currentTime]
  );

  const platformDisplayProps = useMemo(
    () => ({
      trainData,
      numberOfPlatform: platformInput,
    }),
    [trainData, platformInput]
  );

  return (
    <div className="platform-container">
      <div className="dashboard-container">
        <DashboardComponent {...dashboardProps} />
        <div className="csvbutton-container">
          <div>
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {/* Custom Button to Trigger File Input */}
            <button className="upload-button" onClick={handleButtonClick}>
              <img src={UploadImg} /> Upload File
            </button>
          </div>
        </div>
      </div>

      <div className="info-container">
        <InfoComponent {...infoComponentProps} />
        <PlatformDisplayComponent {...platformDisplayProps} />
      </div>
    </div>
  );
};

export default TrainPlatform;
