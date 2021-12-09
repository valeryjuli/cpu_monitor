import { useEffect, useState } from 'react';
import { Queue } from '../../../../dataStructures/queue';
import { CPUDataGlobalState, CPULoadAlertTypes, CPULoadDataPoint } from '../../dataLoader/data-types';
import CpuAlertCard from '../cpuAlertCard/CpuAlertCard';
import './CpuLoadAlerts.css';

const MAX_DISPLAYED_ALERTS = 8;

function CpuLoadAlerts(props: CPUDataGlobalState) {

  const [alertQueue, setAlertQueue] = useState<Queue<CPULoadDataPoint>>(new Queue(MAX_DISPLAYED_ALERTS));
  const [recoveryQueue, setrecoveryQueue] = useState<Queue<CPULoadDataPoint>>(new Queue(MAX_DISPLAYED_ALERTS));

  useEffect(() => {
    const lastPositionData = props.cpuLoadData.queue.length - 1;
    if (lastPositionData >= 0) {
      const lastCPUData = props.cpuLoadData.queue[lastPositionData];
      if (lastCPUData.isAlert !== undefined) {
        if (lastCPUData.isAlert === CPULoadAlertTypes.OVERLOAD) { 
          alertQueue.enqueue(lastCPUData);
        } else {
          recoveryQueue.enqueue(lastCPUData);
        }
      }
    }
  }, [props])

  return (
    <div className="cpu-load-alerts">
      <div className='alerts-container'>
        <h2> CPU Overload Alerts</h2>
        <div className='alerts cpu-overload-alerts'>
          {alertQueue.queue.map((alert: CPULoadDataPoint) => (
            <CpuAlertCard key={String(alert.timestamp)} {...alert} />
            ))}
      </div>
      </div>
      <div className='alerts-container'>
        <h2>CPU Recovery Alerts</h2>
        <div className='alerts cpu-recovery-alerts'>
          {recoveryQueue.queue.map((alert: CPULoadDataPoint) => (
                  <CpuAlertCard key={String(alert.timestamp)} {...alert} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CpuLoadAlerts;
