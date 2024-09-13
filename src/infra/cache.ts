import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redis.get(key);
      return value;
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await this.redis.set(key, value);
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Error deleting key from Redis:', error);
    }
  }

  // Additional methods can be added here if needed
}
