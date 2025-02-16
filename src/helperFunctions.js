import { HEADER_DATA_MAPPING, TRAIN_STATUS } from "./constant";

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(train) {
    this.values.push(train);
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => {
      const priorityMap = { P1: 1, P2: 2, P3: 3 };
      if (priorityMap[a.priority] !== priorityMap[b.priority]) {
        return priorityMap[a.priority] - priorityMap[b.priority];
      }
      if (
        timeToDate(a.scheduledArrival).getTime() !==
        timeToDate(b.scheduledArrival).getTime()
      ) {
        return (
          timeToDate(a.scheduledArrival).getTime() -
          timeToDate(b.scheduledArrival).getTime()
        );
      } else {
        return (
          timeToDate(a.scheduledDeparture).getTime() -
          timeToDate(b.scheduledDeparture).getTime()
        );
      }
    });
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

const findHeaderIndex = (headers, field) => {
  //function to find index from csv for header order
  const headersToSend = headers.map((header) => header.trim().toLowerCase());

  const indexMap = HEADER_DATA_MAPPING[field] || [];

  const headerArr = indexMap.map((name) => name.trim().toLowerCase());

  for (const name of headerArr) {
    const index = headersToSend.indexOf(name);
    if (index !== -1) {
      return index;
    }
  }

  return -1;
};

const formatTime = (timeStr) => {
  if (!timeStr) return null;

  const time = timeStr.trim().toLowerCase();

  // 12-hour format
  const amPmMatch = time.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/);
  if (amPmMatch) {
    let [, hours, minutes, meridiem] = amPmMatch;
    hours = parseInt(hours, 10);

    if (meridiem === "pm" && hours !== 12) {
      hours += 12;
    } else if (meridiem === "am" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  // 24-hour format
  const timeMatch = time.match(/^([01]?\d|2[0-3]):?([0-5]\d)$/);
  if (timeMatch) {
    const [, hours, minutes] = timeMatch;
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  // Handle mix formats
  const mixFormat = time.match(/^(\d{1,2})(\d{2})$/);
  if (mixFormat) {
    let [, hours, minutes] = mixFormat;
    hours = parseInt(hours, 10);

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  return null;
};

const findLastDepartedTrain = (trainData, platformNumber) => {
  for (let i = trainData.length - 1; i >= 0; i--) {
    const train = trainData[i];
    if (
      train.platformNumber === platformNumber &&
      train.status === TRAIN_STATUS.DEPARTED
    ) {
      return train.trainNumber;
    }
  }
  return null;
};

const timeToDate = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map((item) => Number(item));
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const dateToTimeString = (date) => {
  return date.toTimeString().substring(0, 5);
};

export {
  PriorityQueue,
  findHeaderIndex,
  formatTime,
  findLastDepartedTrain,
  timeToDate,
  dateToTimeString,
};
