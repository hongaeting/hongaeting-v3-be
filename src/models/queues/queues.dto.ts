import { Queue } from './queue.entity';

export interface ProcessQueueDto {
  result: 'WAITING' | 'MATCHING' | 'ERROR';
  roomId?: string;
  queue?: Queue;
  error?: Error;
}

export interface DeleteQueueDto {
  result: 'SUCCESS' | 'FAIL' | 'ERROR';
  error?: Error;
}
