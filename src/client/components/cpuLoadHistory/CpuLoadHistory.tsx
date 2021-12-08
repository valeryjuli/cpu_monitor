import { CPUDataGlobalState } from '../dataLoader/data-types';
import CpuLoadAlerts from './cpuLoadAlerts/CpuLoadAlerts';
import CpuLoadChart from './cpuLoadChart/CpuLoadChart';
import './CpuLoadHistory.css';

/**
 * Component providing history chart of CPU load and CPU Alerts
 */
function CpuLoadHistory(props: CPUDataGlobalState) {
  return (
    <div className="cpu-load-history">
      <CpuLoadChart {...props} />
      <CpuLoadAlerts {...props}/>
    </div>
  );
}

export default CpuLoadHistory;
