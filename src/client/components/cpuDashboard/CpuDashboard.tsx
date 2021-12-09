import { useEffect, useState, createContext } from 'react';
import { Queue } from '../../../dataStructures/queue';
import CpuLoadHistory from '../cpuLoadHistory/CpuLoadHistory';
import CpuLoadStatus from '../cpuLoadStatus/CpuLoadStatus';
import { CPUDataGlobalState, CPULoadDataPoint } from '../dataLoader/data-types';
import { CPUDataLoader } from '../dataLoader/data-loader';
import './CpuDashboard.css';

/**
 * Maximum number of data points to store on frontend side.
 * 10min = 600s, 600s / 10s = 60 data points 
 */
export const MAX_DATA_POINTS = 60;
/**
 * Frequency in ms to push new data to the history queue.
 */
export const MONITOR_FREQ = 10000;

/**
 * Start CPU data context value.
 */
const initialCpuLoadDataState: CPUDataGlobalState = {
  cpuLoadData: new Queue<CPULoadDataPoint>(MAX_DATA_POINTS),
}

/**
 * Main component that updates every 10s the CPULoadData context with the cpu load data.
 */
const CpuDashboard = () => {

  let dataLoader: CPUDataLoader;
  const [cpuLoadData, setCpuLoadData] = useState<CPUDataGlobalState>(initialCpuLoadDataState);

  useEffect(() => {
    dataLoader = new CPUDataLoader(MAX_DATA_POINTS);
    const loadDataInterval = setInterval(() => {
      loadCPULoadData();
    }, MONITOR_FREQ);
    
    return () => clearInterval(loadDataInterval);
  }, [])

  /**
   * Load data to dataQueue and update context state
   */
  const loadCPULoadData = async () => {
    await dataLoader.enqueueCPULoadStatistic();
    setCpuLoadData(
      {cpuLoadData : dataLoader.dataHistory
    });
  }

  return (
    <div className="cpu-dashboard-container">
        <CpuLoadStatus {...cpuLoadData}/>
        <CpuLoadHistory {...cpuLoadData}/>
    </div>
  );
}

export default CpuDashboard;
