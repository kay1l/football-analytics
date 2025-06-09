import { api } from '@/lib/axios';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { competitionId: string } }) {
  try {
    const data = await api(`competitions/${params.competitionId}/standings`);
    return NextResponse.json({ standings: data.standings });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
