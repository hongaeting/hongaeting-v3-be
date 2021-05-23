import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
