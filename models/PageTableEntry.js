class PageTableEntry {
  constructor(id) {
    this.id = id;
    this.P = 0;
    this.R = 0;
    this.M = 0;
    this.frameId = -1;
  }
}

module.exports = PageTableEntry;
