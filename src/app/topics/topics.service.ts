import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTopicService {
  private topics: string[] = [
    'Artificial Intelligence',
    'Cybersecurity',
    'Artificial Intelligence',
    'Innovation',
    'Blockchain',
    'Artificial Intelligence',
    'Quantum',
    'Innovation',
    'Metaverse',
    'Startup',
    'Cybersecurity',
    'Microsoft',
    'BigData',
    'Robotics',
    'Autonomous',
    'GitHub',
    'Virtual',
    'Artificial Intelligence',
    'Cloud',
    'DevOps',
    'Analytics',
    'Elon Musk',
    'Tesla',
    'NVidia',
    'Digital',
    'Tech',
    'Ecommerce',
    'Fintech',
    'Insurtech',
    'Web Development',
    'Biotech',
    'Nanotech',
    'Automation Tests',
    'Sustainability',
    'Connectivity',
    'Webhook',
  ];
  public execute(): string {
    const randomIndex = Math.floor(Math.random() * this.topics.length);
    return this.topics[randomIndex];
  }
}
