import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('TRANSFER_WORKER') private worker) {}

  async close() {
    await this.worker.close();
  }
}
