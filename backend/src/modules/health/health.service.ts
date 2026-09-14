export interface HealthStatus {
  status: 'ok';
  message: string;
}

export class HealthService {
  getStatus(): HealthStatus {
    return {
      status: 'ok',
      message: 'DevMind backend is healthy',
    };
  }

  getHealth(name: string): HealthStatus {
    return {
      status: 'ok',
      message: `Hello, ${name}`,
    };
  }
}
