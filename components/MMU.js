const { ACCESS_TYPE } = require("../config");

class MMU {
  constructor(kernel) {
    this.kernel = kernel;
  }

  access(process, virtualPageId, type) {
    const entry = process.pageTable[virtualPageId];

    if (entry.P === 0) {
      this.kernel.handlePageFault(process, virtualPageId);
    }

    entry.R = 1;
    if (type === ACCESS_TYPE.WRITE) {
      entry.M = 1;
    }
  }
}

module.exports = MMU;
