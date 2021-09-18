import { Queue } from './queue.entity';

export interface RequestMatchingDto {
  result: 'WAITING' | 'MATCHING' | 'ERROR';
  roomId?: string;
  queue?: Queue;
  error?: Error;
}

export interface CancelMatchingDto {
  result: 'SUCCESS' | 'FAIL' | 'ERROR';
  error?: Error;
}
