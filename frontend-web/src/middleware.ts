import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/admin/login",
    },
});

export const config = {
    // Define quais rotas serão protegidas pelo middleware
    matcher: [
        "/admin/dashboard/:path*",
        "/admin"
    ],
};