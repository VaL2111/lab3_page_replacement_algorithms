class PhysicalPage {
  constructor(frameId) {
    this.frameId = frameId;
    this.isOccupied = false;
    this.virtualPageId = -1;
  }
}

module.exports = PhysicalPage;
