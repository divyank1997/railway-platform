const STATUS_OBJ = {
  AT_PLATFORM: "AT_PLATFORM",
  SCHEDULED: "SCHEDULED",
  DEPARTED: "DEPARTED",
};

const STATUS_TO_TEXT = {
  AT_PLATFORM: "At Platform",
  SCHEDULED: "Scheduled",
  DEPARTED: "Departed",
};

const HEADER_MAPPINGS = {
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

export { HEADER_MAPPINGS, STATUS_OBJ, STATUS_TO_TEXT };
