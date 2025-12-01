import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Proteção básica para ninguém limpar seu cache à toa
  // Em produção, use uma variável de ambiente complexa
  if (secret !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  try {
    // Manda o Next.js reconstruir a página inicial
    revalidatePath('/');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Erro ao revalidar' }, { status: 500 });
  }
}