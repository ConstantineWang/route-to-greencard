import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const id = Date.now().toString(36);
    const result = { ...req.body, timestamp: Date.now(), id };
    
    await redis.lpush('results', JSON.stringify(result));
    await redis.ltrim('results', 0, 999);
    await redis.hincrby('stats', 'total', 1);
    await redis.hincrby('stats', `ending:${result.ending}`, 1);
    await redis.hincrbyfloat('stats', 'totalYears', result.yearsSpent || 0);
    // 开挂和EB5不算上岸
    if (result.ending === 'success' && !result.cheat) {
      await redis.hincrby('stats', 'success', 1);
    }
    
    return res.json({ success: true, id });
  }

  if (req.method === 'GET') {
    const [results, statsRaw] = await Promise.all([
      redis.lrange('results', 0, 19),
      redis.hgetall('stats')
    ]);
    
    const stats = statsRaw || {};
    const total = parseInt(stats.total) || 0;
    const success = parseInt(stats.success) || 0;
    const totalYears = parseFloat(stats.totalYears) || 0;
    
    const endings = {};
    Object.entries(stats).forEach(([k, v]) => {
      if (k.startsWith('ending:')) endings[k.slice(7)] = parseInt(v);
    });
    
    return res.json({
      total, success, endings,
      avgYears: total ? (totalYears / total).toFixed(1) : '0',
      recent: results.map(r => typeof r === 'string' ? JSON.parse(r) : r)
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
