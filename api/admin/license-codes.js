import { db } from 'hatchable';
export const access = 'admin';
export const methods = ['GET','POST'];
function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return 'RPK-' + Array.from(bytes).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
}
async function hashCode(value) {
  const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
export default async function(req,res) {
  if (req.method === 'GET') {
    const {rows}=await db.query("SELECT id,plan,source,status,redeemed_by,redeemed_at,created_at FROM license_codes ORDER BY created_at DESC LIMIT 100");
    return res.json({codes:rows});
  }
  const plan=String(req.body?.plan||'').toLowerCase();
  const source=['manual','appsumo','lemonsqueezy','stripe'].includes(req.body?.source)?req.body.source:'manual';
  const count=Math.max(1,Math.min(50,Number(req.body?.count)||1));
  if (!['starter','pro','agency'].includes(plan)) return res.status(400).json({error:'Plan must be starter, pro or agency.'});
  const codes=[];
  const statements=[];
  for(let i=0;i<count;i++){
    const code=makeCode();
    const hash=await hashCode(code);
    codes.push(code);
    statements.push({sql:"INSERT INTO license_codes (code_hash,plan,source) VALUES ($1,$2,$3)",params:[hash,plan,source]});
  }
  await db.transaction(statements);
  return res.status(201).json({created:codes.length,plan,source,codes,warning:'Save these codes now. Plaintext codes are shown only once; the database stores hashes.'});
}