import { Queue } from "../../../dataStructures/queue";

export enum CPULoadAlertTypes {
    OVERLOAD = 'red-alert',
    RECOVERY = 'green-alert',
}
export interface CPULoadDataPoint {
    /**
     * Average cpu load at the timestamp
     */
    cpuLoad: number,
    /**
     * Date of average measured cpu load 
     */
    timestamp: Date,
    /**
     * Indicates if the data point is a CPU overload alert
     */
    isAlert?: CPULoadAlertTypes,
}

export type CPUDataGlobalState = {
    cpuLoadData: Queue<CPULoadDataPoint>;
}