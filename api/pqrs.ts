import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

export default function handler(
  _req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'pqrs.json');
    
    if (!fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Archivo data/pqrs.json no encontrado' }));
      return;
    }

    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(500);
    res.end(JSON.stringify({ 
      error: 'Error al procesar la solicitud de PQRS',
      details: error instanceof Error ? error.message : String(error)
    }));
  }
}
