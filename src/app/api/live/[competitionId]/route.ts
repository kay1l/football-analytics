import { api } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params} : {params: {competitionId:string}}) {
const {competitionId} = params;

try {
  const data = await api(`matches?status=LIVE`);

  const filtered = competitionId ? data.matches.filter((m: any) =>m.competition.id.toString() === competitionId) : data.matches;

  return NextResponse.json({matches:filtered})
} catch (err) {
  return NextResponse.json({error: 'Failed to fetch live matches'}, {status: 500});
}
}