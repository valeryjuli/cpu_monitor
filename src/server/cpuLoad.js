// Loadavg ponyfill for Windows_NT OS
require('loadavg-windows');
const os = require('os');

/**
 * Total of CPU cores on the machine.
 */
const NUM_CPU = os.cpus().length;

/**
 * Return average cpu load and current timestamp
 */
const getCurrentCpuLoadData = (req, res) => {
  const lastMinuteLoadavg = os.loadavg();
  console.log(lastMinuteLoadavg[0] / NUM_CPU)
    const cpuLoadPoint = {
      cpuLoad: (lastMinuteLoadavg[0]) / NUM_CPU,
      timestamp: new Date(Date.now()),
    }
    res.status(200).send(cpuLoadPoint);
}

/**
 * Return cpu cores parameters
 */
 const getUserInfo = (req, res) => {
  const cpuParams = {
    cpuTotal: NUM_CPU,
    platform: os.platform(),
    cpus: os.cpus()
  }
  res.status(200).send(cpuParams);
}

/**
 * Route handler for cpu load and parameters request
 */
module.exports = (app) => {
  app.get('/cpuLoad', getCurrentCpuLoadData);
  app.get('/userInfo', getUserInfo);
}