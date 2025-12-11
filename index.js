const { SETTINGS, ACCESS_TYPE } = require("./config");
const Process = require("./components/Process");
const Kernel = require("./components/Kernel");
const MMU = require("./components/MMU");

function runSimulation(algorithmName) {
  console.log(`Запуск симуляції з алгоритмом ${algorithmName}`);

  const kernel = new Kernel(algorithmName);
  const mmu = new MMU(kernel);
  const process = new Process(1);

  for (let time = 0; time < SETTINGS.TOTAL_ACCESSES; time++) {
    if (time > 0 && time % SETTINGS.WS_CHANGE_INTERVAL === 0) {
      process.updateWorkingSet();
    }
    if (time > 0 && time % SETTINGS.R_RESET_INTERVAL === 0) {
      kernel.resetReferenceBits(process);
    }

    const vPageId = process.getNextVirtualPageId();
    const type = Math.random() < 0.7 ? ACCESS_TYPE.READ : ACCESS_TYPE.WRITE;

    mmu.access(process, vPageId, type);
  }

  const efficiency = (
    (1 - kernel.pageFaults / SETTINGS.TOTAL_ACCESSES) *
    100
  ).toFixed(2);

  console.log(`Результати для алгоритму ${algorithmName}`);
  console.log(`Page faults: ${kernel.pageFaults}`);
  console.log(`Ефективність: ${efficiency}`);

  return kernel.pageFaults;
}

const faultsRandom = runSimulation("Random");
console.log("------------------------------------------");
const faultsNRU = runSimulation("NRU");

console.log("------------------------------------------");

if (faultsNRU < faultsRandom) {
  console.log("Алгоритм 'NRU' має менше промахів за алгоритм 'Random'.");
} else {
  console.log("Алгоритм 'Random' має менше промахів за алгортм 'NRU'.");
}
