import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { success: false, message: "Erro de configuração no servidor." },
                { status: 500 }
            );
        }

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { success: false, message: "Acesso Negado: Senha Incorreta." },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Erro interno ao processar a requisição." },
            { status: 500 }
        );
    }
}