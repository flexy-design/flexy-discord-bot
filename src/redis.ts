import { env } from "./env";
import * as redis from "redis";
import blackpink from 'blackpink'

export const redisClient = redis.createClient({
  url: env.redisUrl,
});

export const pink = blackpink(redisClient as redis.RedisClientType)