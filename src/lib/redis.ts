import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var redisGlobal: Redis | undefined;
}

const redisUrl = process.env.REDIS_URL ?? "";

export const redis: Redis = global.redisGlobal ?? new Redis(redisUrl);

if (process.env.NODE_ENV !== "production") {
  global.redisGlobal = redis;
}
