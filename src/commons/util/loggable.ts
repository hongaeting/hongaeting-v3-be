import { Logger } from '@nestjs/common';

export abstract class Loggable {
  private readonly logger: Logger = new Logger(this.constructor.name);

  protected log(message: string) {
    this.logger.log(message);
  }

  protected warn(message: string) {
    this.logger.warn(message);
  }

  protected debug(message: string) {
    this.logger.debug(message);
  }

  protected error(message: string) {
    this.logger.error(message);
  }
}
