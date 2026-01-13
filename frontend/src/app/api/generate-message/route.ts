// app/api/generate-message/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// -----------------------------------------------------------
// 1. Configurazione della Generative AI
// -----------------------------------------------------------

// Assicurati che la chiave sia disponibile
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY non è impostata nelle variabili d\'ambiente.');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// -----------------------------------------------------------
// 2. Definizione della Route Handler POST
// -----------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Il metodo .json() è nativo delle richieste Next.js
    const { relationship, occasion, tone } = await req.json();

    if (!relationship || !occasion || !tone) {
      return NextResponse.json(
        { message: 'Parametri mancanti: relationship, occasion, tone.' },
        { status: 400 }
      );
    }
    
    // Costruzione del prompt
    const prompt = `
      Sei un assistente per un fiorista online. Genera un messaggio medio lungo, emozionante e appropriato
      per un bigliettino di auguri che sarà allegato a un mazzo di fiori.
      
      Contesto:
      - Destinatario/Relazione: ${relationship}
      - Occasione: ${occasion}
      - Tono desiderato: ${tone}
      
      Il messaggio deve essere al massimo 300 caratteri. Genera solo il testo del messaggio,
      senza saluti o firme aggiuntive.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Pulizia del testo generato
    const generatedText = (response.text ?? '').trim().replace(/^['"]|['"]$/g, '');

    // Usa NextResponse.json() per la risposta
    return NextResponse.json({ message: generatedText }, { status: 200 });

  } catch (error) {
    console.error('Errore durante la generazione del contenuto:', error);
    
    // Restituisce un errore standard del server
    return NextResponse.json(
      { message: 'Errore interno del server durante la generazione.' },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------
// 3. (Opzionale) Prevenire altri metodi HTTP
// -----------------------------------------------------------

// Se viene richiesto un metodo diverso da POST (es. GET), Next.js restituirà 405 (Method Not Allowed)
// automaticamente, a meno che tu non definisca anche le altre funzioni (GET, PUT, ecc.).
// Per sicurezza, puoi definirli per restituire esplicitamente l'errore se non vuoi il default:
export function GET() {
    return NextResponse.json({ message: 'GET non supportato per questo endpoint.' }, { status: 405 });
}