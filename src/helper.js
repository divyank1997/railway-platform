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
      // If same priority, sort by scheduled arrival time
      return new Date(a.scheduledArrival) - new Date(b.scheduledArrival);
    });
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

const STATUS_OBJ = {
  AT_PLATFORM: "AT_PLATFORM",
  SCHEDULED: "SCHEDULED",
  DEPARTED: "DEPARTED",
};

export { PriorityQueue, STATUS_OBJ };
