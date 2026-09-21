import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface HsnMasterItem {
  c: string; // code
  d: string; // description
  t: 'Goods' | 'Services';
  ch: string; // chapter / heading
  r: number; // estimated GST rate %
}

interface MasterStats {
  totalGoods: number;
  totalServices: number;
  total: number;
}

let cachedData: HsnMasterItem[] | null = null;
let cachedStats: MasterStats | null = null;

function loadMasterData(): HsnMasterItem[] {
  if (cachedData) return cachedData;

  const dataPath = path.join(process.cwd(), 'data', 'hsn_sac_master.json');
  if (!fs.existsSync(dataPath)) {
    console.error('HSN master file not found at:', dataPath);
    return [];
  }

  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    cachedData = JSON.parse(raw) as HsnMasterItem[];
    const goodsCount = cachedData.filter(x => x.t === 'Goods').length;
    const servicesCount = cachedData.filter(x => x.t === 'Services').length;
    cachedStats = {
      totalGoods: goodsCount,
      totalServices: servicesCount,
      total: cachedData.length
    };
    return cachedData;
  } catch (err) {
    console.error('Failed to load HSN master data:', err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const master = loadMasterData();
    const { searchParams } = new URL(req.url);

    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const type = searchParams.get('type') || 'All'; // 'All' | 'Goods' | 'Services'
    const rate = searchParams.get('rate') || 'All';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

    let filtered = master;

    // 1. Filter by Type
    if (type === 'Goods' || type === 'Services') {
      filtered = filtered.filter(item => item.t === type);
    }

    // 2. Filter by Rate
    if (rate !== 'All') {
      const numRate = parseInt(rate, 10);
      if (!isNaN(numRate)) {
        filtered = filtered.filter(item => item.r === numRate);
      }
    }

    // 3. Search Filter
    if (q) {
      const isNumeric = /^\d+$/.test(q);

      if (isNumeric) {
        // Code search: exact match first, then starts with, then includes
        const exactMatches: HsnMasterItem[] = [];
        const startsWithMatches: HsnMasterItem[] = [];
        const includesMatches: HsnMasterItem[] = [];

        for (let i = 0; i < filtered.length; i++) {
          const item = filtered[i];
          if (item.c === q) {
            exactMatches.push(item);
          } else if (item.c.startsWith(q)) {
            startsWithMatches.push(item);
          } else if (item.c.includes(q)) {
            includesMatches.push(item);
          }
        }

        filtered = [...exactMatches, ...startsWithMatches, ...includesMatches];
      } else {
        // Multi-word description search
        const keywords = q.split(/\s+/).filter(Boolean);
        filtered = filtered.filter(item => {
          const codeLower = item.c.toLowerCase();
          const descLower = item.d.toLowerCase();
          return keywords.every(kw => codeLower.includes(kw) || descLower.includes(kw));
        });
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      query: q,
      type,
      rate,
      page,
      limit,
      total,
      totalPages,
      stats: cachedStats || {
        totalGoods: 21935,
        totalServices: 681,
        total: 22616
      },
      items: paginatedItems
    });
  } catch (error: any) {
    console.error('API /api/tools/hsn-search error:', error);
    return NextResponse.json({ error: error.message || 'Failed to search HSN database' }, { status: 500 });
  }
}
