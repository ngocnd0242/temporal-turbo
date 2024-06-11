import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('WF_WORKER') private worker) {}

  async close() {
    await this.worker.close();
  }
}
