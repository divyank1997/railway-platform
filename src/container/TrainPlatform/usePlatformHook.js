import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  findHeaderIndex,
  formatTime,
  PriorityQueue,
} from "../../helperFunctions";
import { PRIORITY_ARR, TRAIN_STATUS } from "../../constant";
export const useTrainPlatform = () => {
  const [platformInput, setPlatformInput] = useState(2);
  const [trainData, setTrainData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

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
      if (!train || !currentTime) {
        return "Not Available";
      }

      const arrivalTime = timeToDate(train.actualArrival);
      const departureTime = timeToDate(train.actualDeparture);

      let status = "";
      if (currentTime < arrivalTime) {
        status = TRAIN_STATUS.SCHEDULED;
      } else if (currentTime >= arrivalTime && currentTime < departureTime) {
        status = TRAIN_STATUS.AT_PLATFORM;
      } else {
        status = TRAIN_STATUS.DEPARTED;
      }
      return status;
    },
    [timeToDate]
  );

  const updateTrainStatuses = useCallback(() => {
    const updatedTrains = trainData.map((train) => {
      return Object.assign(
        {},
        {
          ...train,
          trainStatus: getTrainStatus(train, currentTime),
          status: getTrainStatus(train, currentTime),
        }
      );
    });
    setTrainData(updatedTrains);
  }, [trainData, getTrainStatus, currentTime]);

  const getNextAvailableTime = useCallback(
    (platform, trainStart, allocatedTrains) => {
      const trainsOnPlatform = allocatedTrains
        .filter((allocTrain) => allocTrain.platformNumber === platform)
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
      let earliestPossibleStart = null;

      for (let platform = 1; platform <= numPlatforms; platform++) {
        const nextAvailable = getNextAvailableTime(
          platform,
          scheduledArrival,
          allocatedTrains
        );

        if (
          nextAvailable < earliestPossibleStart ||
          earliestPossibleStart === null
        ) {
          earliestPossibleStart = nextAvailable;
          bestPlatform = platform;
        }
      }

      const actualArrival = earliestPossibleStart;
      const actualDeparture = new Date(
        actualArrival.getTime() + scheduledDuration
      );
      return {
        ...train,
        platformNumber: bestPlatform,
        actualArrival: dateToTimeString(actualArrival),
        actualDeparture: dateToTimeString(actualDeparture),
        delay: Math.round((actualArrival - scheduledArrival) / (1000 * 60)),
        trainStatus: getTrainStatus(
          {
            actualArrival: dateToTimeString(actualArrival),
            actualDeparture: dateToTimeString(actualDeparture),
          },
          currentTime
        ),
        status:
          getTrainStatus(
            {
              actualArrival: dateToTimeString(actualArrival),
              actualDeparture: dateToTimeString(actualDeparture),
            },
            currentTime
          ) || "",
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
        const fileData = text.split("\n").filter((line) => line.trim());

        if (fileData.length <= 1) {
          console.log("CSV file is empty or contains only headers");
          return [];
        }
        const trainQueue = new PriorityQueue();
        const headerData = fileData[0]
          .split(",")
          .map((headerItem) => headerItem.trim());
        const trainNumberIndex = findHeaderIndex(headerData, "trainNumber");
        const arrivalIndex = findHeaderIndex(headerData, "scheduledArrival");
        const departureIndex = findHeaderIndex(
          headerData,
          "scheduledDeparture"
        );
        const priorityIndex = findHeaderIndex(headerData, "priority");
        if (
          trainNumberIndex === -1 ||
          arrivalIndex === -1 ||
          departureIndex === -1
        ) {
          alert("Missing Required Fields");
          return [];
        }
        fileData.forEach((line, index) => {
          if (index > 0) {
            const values = line.split(",").map((val) => val.trim());

            if (
              values.length <=
              Math.max(trainNumberIndex, arrivalIndex, departureIndex)
            ) {
              return;
            }

            const trainNumber = values[trainNumberIndex];
            const scheduledArrival = formatTime(values[arrivalIndex]);
            const scheduledDeparture = formatTime(values[departureIndex]);
            const priority =
              priorityIndex !== -1 &&
              PRIORITY_ARR.includes(values[priorityIndex])
                ? values[priorityIndex]
                : "P3";

            trainQueue.enqueue({
              trainNumber,
              scheduledArrival,
              scheduledDeparture,
              priority,
            });
          }
        });

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

        const trainDataToSet = [...trainData, ...allocatedTrains];
        setTrainData(trainDataToSet);
      } catch (error) {
        console.error("Error processing file:", error);
      }
    },
    [allocatePlatformAndTime, platformInput]
  );

  const handlePlatformSubmit = useCallback(() => {
    if (platformInput >= 2 && platformInput <= 20) {
      if (trainData.length > 0) {
        const priorityQueue = new PriorityQueue();
        trainData.forEach((train) => priorityQueue.enqueue(train));

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
    } else {
      alert("Please Enter Number Between 2 and 20");
    }
  }, [allocatePlatformAndTime, platformInput, trainData]);

  const handlePlatformNumber = useCallback((e) => {
    const { value } = e.target;
    if (value > 2 && value < 20) setPlatformInput(value);
  }, []);

  const fileInputRef = useRef(null);
  const handleButtonClick = useCallback(() => {
    fileInputRef.current.click();
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

  return {
    dashboardProps,
    fileInputRef,
    handleFileUpload,
    handleButtonClick,
    infoComponentProps,
    platformDisplayProps,
  };
};
