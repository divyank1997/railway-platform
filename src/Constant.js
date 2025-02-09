const TRAIN_STATUS = {
  AT_PLATFORM: "AT_PLATFORM",
  SCHEDULED: "SCHEDULED",
  DEPARTED: "DEPARTED",
};

const TRAIN_STATUS_TO_TEXT = {
  AT_PLATFORM: "At Platform",
  SCHEDULED: "Scheduled",
  DEPARTED: "Departed",
};

const HEADER_DATA_MAPPING = {
  trainNumber: [
    "train number",
    "train no",
    "trainno",
    "train_number",
    "trainnumber",
    "train id",
  ],
  scheduledArrival: [
    "scheduled arrival",
    "arrival time",
    "arrivaltime",
    "scheduled_arrival",
    "arrival",
    "arr time",
  ],
  scheduledDeparture: [
    "scheduled departure",
    "departure time",
    "departuretime",
    "scheduled_departure",
    "departure",
    "dep time",
  ],
  priority: ["priority", "train priority", "train_priority", "pri"],
};

const PRIORITY_ARR = ["P1", "P2", "P3"];

export {
  HEADER_DATA_MAPPING,
  TRAIN_STATUS,
  TRAIN_STATUS_TO_TEXT,
  PRIORITY_ARR,
};
