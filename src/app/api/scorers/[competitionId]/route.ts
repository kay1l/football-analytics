import { api } from '@/lib/axios';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { competitionId: string } }) {
  try {
    const data = await api(`competitions/${params.competitionId}/scorers`);
    return NextResponse.json({ scorers: data.scorers });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch scorers' }, { status: 500 });
  }
}
