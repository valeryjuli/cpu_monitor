import { Queue } from "../../../dataStructures/queue";
import { CPULoadAlertTypes, CPULoadDataPoint } from "./data-types";

/**
* Threshold to trigger a CPU load alert.
*/
const CPU_ALERT_THRESHOLD = 1;

/**
 * Loads CPU average load data points to a dataHistory queue with a specified max length.
 */
export class CPUDataLoader {
    /**
     * Queue with history of last maxDataPoints cpu average load values.
     */
    readonly dataHistory: Queue<CPULoadDataPoint>;

    constructor (maxDataPoints: number) {
        this.dataHistory = new Queue(maxDataPoints);
    }

    verifyRecovery(cpuLoad: number) {
        if (this.dataHistory.queue.length > 12) {
            // 2min = 120s = 12 points
            // Verify that 2min ago CPUAvgLoad > 1 and after that, for at least 2min all CPUAvgLoad < 1
            const startWindowLoad = this.dataHistory.queue[this.dataHistory.queue.length  - 12].cpuLoad;
            const allAverageLoadsBelowTh = this.dataHistory.queue.slice(-120).every((cpuData) => cpuData.cpuLoad < CPU_ALERT_THRESHOLD);
            if (startWindowLoad > CPU_ALERT_THRESHOLD && cpuLoad < CPU_ALERT_THRESHOLD && allAverageLoadsBelowTh) return true
            return false;
        }
        return false;
    }

    verifyOverload(): boolean {
        if (this.dataHistory.queue.length > 12) {
            // Verify if for the last 2min CPUAvgLoad > 1
            return this.dataHistory.queue.slice(-120).every((cpuData) => cpuData.cpuLoad > CPU_ALERT_THRESHOLD);
        }
        return false;
    }

    /**
     * Enqueue on the data history the latest cpu load
     * @returns a cpu load data with average cpu load and timestamp
     */
    async enqueueCPULoadStatistic(): Promise<CPULoadDataPoint> {
        const request = new Request('http://localhost:5000/cpuLoad');
        return fetch(request)
            .then((response: any) => response.json())
            .then((cpuLoadData: CPULoadDataPoint) => {
                const currCpuLoad = cpuLoadData.cpuLoad;
                const cpuLoadDataPoint = {
                    cpuLoad: currCpuLoad,
                    timestamp: cpuLoadData.timestamp,
                    isAlert: 
                            this.verifyOverload() ? 
                            CPULoadAlertTypes.OVERLOAD : 
                            this.verifyRecovery(currCpuLoad) ? CPULoadAlertTypes.RECOVERY : undefined,
                }
                this.dataHistory.enqueue(cpuLoadDataPoint);
                return cpuLoadData
            })
    }
}