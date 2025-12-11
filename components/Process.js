const PageTableEntry = require("../models/PageTableEntry");
const { SETTINGS } = require("../config");

class Process {
  constructor(id) {
    this.id = id;

    this.pageTable = Array(SETTINGS.VIRTUAL_PAGES)
      .fill(null)
      .map((_, i) => new PageTableEntry(i));

    this.workingSet = [];
    this.updateWorkingSet();
  }

  updateWorkingSet() {
    this.workingSet = [];
    const pool = Array.from({ length: SETTINGS.VIRTUAL_PAGES }, (_, i) => i);

    for (let i = 0; i < SETTINGS.WORKING_SET_SIZE; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      this.workingSet.push(pool[idx]);
      pool.splice(idx, 1);
    }
  }

  getNextVirtualPageId() {
    if (Math.random() < 0.9) {
      const idx = Math.floor(Math.random() * this.workingSet.length);
      return this.workingSet[idx];
    } else {
      return Math.floor(Math.random() * SETTINGS.VIRTUAL_PAGES);
    }
  }
}

module.exports = Process;
