import Redis from 'ioredis';

const redisUri = process.env.REDIS_URI || 'redis://localhost:6379';

const redis = new Redis(redisUri);

redis.on('connect', () => {
    console.log('Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export const invalidateUserPhotosCache = async (userId: string) => {
    try {
        const pattern = `photos:${userId}:*`;
        let cursor = '0';
        do {
            const [newCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = newCursor;
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } while (cursor !== '0');
    } catch (error) {
        console.error('Error clearing user photo cache:', error);
    }
};

export default redis;
