import { UberData } from "./types";

export async function parseCSVData(csvString: string): Promise<UberData[]> {
  // Podziel tekst na linie
  const lines = csvString.split('\n');
  
  // Pobierz nagłówki z pierwszej linii
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parsuj każdą linię danych
  const data: UberData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Pomijamy puste linie
    
    // Podziel linię na pola, uwzględniając cudzysłowy
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) {
      console.warn(`Line ${i} has ${values.length} fields, expected ${headers.length}`);
      continue;
    }
    
    // Twórz obiekt z danych
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    
    data.push(row as UberData);
  }
  
  return data;
}

// Funkcja pomocnicza do parsowania linii CSV, uwzględniająca cudzysłowy
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Podwójny cudzysłówek wewnątrz cudzysłowów - traktuj jako pojedynczy
        current += '"';
        i++;
      } else {
        // Przełącz stan cudzysłowów
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Koniec pola
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Dodaj ostatnie pole
  result.push(current);
  
  return result;
}