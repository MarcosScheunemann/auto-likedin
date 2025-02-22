import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTopicService {
  constructor() {}
  execute(): string {
    return 'Tesla';
  }
}
