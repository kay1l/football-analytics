import { api } from "@/lib/axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await api("competitions");

    if (!data.competitions || !Array.isArray(data.competitions)) {
      console.error("Unexpected API response:", data);
      return NextResponse.json(
        { error: "Invalid data format from Football API" },
        { status: 502 }
      );
    }

    const competitions = data.competitions.filter(
      (c: any) => c.plan === "TIER_ONE" && c.emblem
    );

    return NextResponse.json({ competitions });
  } catch (err) {
    console.error("Error fetching competitions:", err);
    return NextResponse.json(
      { error: "Failed to fetch competitions" },
      { status: 500 }
    );
  }
}
