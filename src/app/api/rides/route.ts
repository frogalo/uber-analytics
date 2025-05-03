import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseCSVData } from '@/lib/csv-parser';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'rides.csv');
    const csvText = fs.readFileSync(filePath, 'utf8');
    const data = await parseCSVData(csvText);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading rides data:', error);
    return NextResponse.json({ error: 'Failed to load rides data' }, { status: 500 });
  }
}
