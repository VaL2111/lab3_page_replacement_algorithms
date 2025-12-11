const PhysicalPage = require("../models/PhysicalPage");
const { SETTINGS } = require("../config");

class Kernel {
  constructor(algorithmName) {
    this.algorithmName = algorithmName;

    this.ram = Array(SETTINGS.PHYSICAL_FRAMES)
      .fill(null)
      .map((_, i) => new PhysicalPage(i));

    this.pageFaults = 1;
  }

  handlePageFault(process, virtualPageId) {
    this.pageFaults++;

    let frame = this.ram.find((f) => f.isOccupied);

    if (!frame) {
      frame = this.selectVictim(process);
      this.swapOut(process, frame);
    }

    this.swapIn(process, frame, virtualPageId);
  }

  selectVictim(process) {
    const occupied = this.ram.filter((f) => f.isOccupied);

    if (this.algorithmName === "Random") {
      return occupied[Math.floor(Math.random() * occupied.length)];
    }

    if (this.algorithmName === "NRU") {
      let minClass = 4;
      let candidates = [];

      for (let frame of occupied) {
        const entry = process.pageTable[frame.virtualPageId];
        const pageClass = entry.R * 2 + entry.M;

        if (pageClass < minClass) {
          minClass = pageClass;
          candidates = [frame];
        } else if (pageClass === minClass) {
          candidates.push(frame);
        }
      }

      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }

  swapOut(process, frame) {
    const entry = process.pageTable[frame.virtualPageId];
    entry.P = 0;
    entry.frameId = -1;
    frame.isOccupied = false;
  }

  swapIn(process, frame, virtualPageId) {
    const entry = process.pageTable[virtualPageId];
    frame.isOccupied = true;
    frame.virtualPageId = virtualPageId;

    entry.P = 0;
    entry.frameId = frame.frameId;
    entry.R = 1;
    entry.M = 0;
  }

  resetReferenceBits(process) {
    process.pageTable.forEach((entry) => {
      if (entry.P === 1) entry.R = 0;
    });
  }
}

module.exports = Kernel;
