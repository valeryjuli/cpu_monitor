import { CPUDataGlobalState } from '../dataLoader/data-types';
import './CpuLoadStatus.css';

function CpuLoadStatus(props: CPUDataGlobalState) {
  return (
    <div className="cpu-load-status">
      <h1>CPU Load Status</h1>
    </div>
  );
}

export default CpuLoadStatus;
