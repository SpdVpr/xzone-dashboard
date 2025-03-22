import { NextRequest, NextResponse } from 'next/server';
import { mockVisitorData } from '@/mock-data/visitors';
import { VisitorData } from '@/lib/types';

// Globální proměnná pro ukládání importovaných dat
// V reálné aplikaci by tato data byla uložena v databázi
let importedVisitorData: VisitorData[] = [];

export async function GET() {
  try {
    // Kombinace mock dat a importovaných dat
    const allVisitorData = [...mockVisitorData, ...importedVisitorData];
    
    // Seřazení podle data (od nejnovějšího)
    const sortedData = allVisitorData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json(sortedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při získávání dat o návštěvnosti' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newVisitorData: VisitorData[] = await request.json();
    
    if (!Array.isArray(newVisitorData)) {
      return NextResponse.json(
        { error: 'Neplatný formát dat. Očekáváno pole objektů.' },
        { status: 400 }
      );
    }
    
    // Přidání nových dat do globální proměnné
    importedVisitorData = [...importedVisitorData, ...newVisitorData];
    
    return NextResponse.json({
      success: true,
      message: `Úspěšně importováno ${newVisitorData.length} záznamů`,
      count: newVisitorData.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při importu dat o návštěvnosti' },
      { status: 500 }
    );
  }
}
