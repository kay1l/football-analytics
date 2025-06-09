export async function api(endpoint: string) {
    const res = await fetch(`https://api.football-data.org/v4/${endpoint}`, {
      headers: {
        'X-Auth-Token': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY!,
      },
      next: { revalidate: 60 }, 
    });
  
    if (!res.ok) {
      throw new Error(`Football API error: ${res.status}`);
    }
  
    return res.json();
  }
  