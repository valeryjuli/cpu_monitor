import { CPULoadDataPoint } from "../client/components/dataLoader/data-types";

/**
 * Queue data structure implementing FIFO queue definition.
 */
export class Queue<T> {
  /**
   * Array representing the queue.
   */
  public queue: Array<T>;
  /**
   * Maximum length of queue.
   */
  private maxLength: number;

  constructor(maxLength: number) {
    if (!maxLength) {
      throw ('Queue minimal length is 1')
    }
    this.queue = [];
    this.maxLength = maxLength;
  };

  /**
   * Add item to queue, adds it to the bottom of the queue
   */
  enqueue(item: T): void {
    if (this.queue.length === this.maxLength) {
      this.dequeue();
    }
    this.queue.push(item);
    console.log(this.queue)
  };

  /**
   * Remove item from queue, takes the first element on queue
   */
  dequeue(): void {
    this.queue.shift();
  };

  /**
   * return queue as an array
   */
  toArray(): Array<T> {
    return this.queue;
  };

  /**
   * return queue length
   */
  size(): number {
    return this.queue.length;
  };
}
