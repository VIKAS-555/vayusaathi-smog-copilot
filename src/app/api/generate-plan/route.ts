import { NextResponse } from 'next/server';
import { fetchGenAIPlan } from '@/lib/geminiService';
import { HouseholdProfile, CitySmogContext } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile, city } = body as { profile: HouseholdProfile; city: CitySmogContext };

    if (!profile || !city) {
      return NextResponse.json(
        { error: 'Missing profile or city context in request body' },
        { status: 400 }
      );
    }

    const plan = await fetchGenAIPlan(profile, city);
    return NextResponse.json(plan);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
