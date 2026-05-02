import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                // Guard Clause 1: Rejeita imediatamente se o payload vier vazio
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                // Guard Clause 2: Evita falhas silenciosas se o servidor estiver mal configurado
                if (!adminEmail || !adminPassword) {
                    console.error("ERRO: Variáveis ADMIN_EMAIL ou ADMIN_PASSWORD ausentes no .env.local");
                    return null;
                }

                // Validação estrita de credenciais. 
                // Neste ponto, o TypeScript sabe que 'credentials' não é undefined.
                if (
                    credentials.email === adminEmail &&
                    credentials.password === adminPassword
                ) {
                    return { id: "1", name: "Administrador", email: credentials.email };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };