import os
import resend
import sentry_sdk
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

# Bibliotecas de Rate Limiting (Segurança)
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

# --- CONFIGURAÇÃO SENTRY ---
SENTRY_DSN = os.environ.get("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# --- CONFIGURAÇÃO RATE LIMITER ---
limiter = Limiter(key_func=get_remote_address)

# --- CONFIGURAÇÃO SUPABASE ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except:
    supabase = None

# --- CONFIGURAÇÃO RESEND ---
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
resend.api_key = RESEND_API_KEY
EMAIL_TO = "cauafreitas026@gmail.com"

app = FastAPI(title="Portfolio API - Cauã Freitas")

# Conecta o Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactMessage(BaseModel):
    name: str
    email: str
    content: str

def send_email_resend(contact: ContactMessage):
    print(">>> [RESEND] Iniciando envio via API...")
    if not RESEND_API_KEY: return False

    # Template HTML Otimizado para Outlook e Responsivo
    # Usa tabelas aninhadas e estilos inline para garantir renderização perfeita no motor do Word
    html_content = f"""
    <!DOCTYPE html>
    <html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <style>
            body, table, td, a {{ -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
            table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
            img {{ -ms-interpolation-mode: bicubic; }}
            body {{ margin: 0; padding: 0; width: 100% !important; }}
            
            /* Responsividade para Mobile */
            @media screen and (max-width: 600px) {{
                .container {{ width: 100% !important; }}
                .mobile-padding {{ padding-left: 20px !important; padding-right: 20px !important; }}
            }}
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a;">
        
        <!-- Wrapper Principal -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    
                    <!-- Ghost Table para forçar largura no Outlook -->
                    <!--[if mso]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    
                    <!-- Container do Cartão -->
                    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; overflow: hidden;">
                        
                        <!-- Header (Gradient simulation via color fallback) -->
                        <tr>
                            <td align="center" style="background-color: #10b981; padding: 30px; border-bottom: 4px solid #059669;">
                                <h1 style="color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
                                    🚀 Novo Contato
                                </h1>
                            </td>
                        </tr>

                        <!-- Corpo do Conteúdo -->
                        <tr>
                            <td class="mobile-padding" style="padding: 40px;">
                                
                                <!-- Nome -->
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 5px;">
                                            <span style="color: #94a3b8; font-family: 'Segoe UI', sans-serif; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Remetente</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 25px;">
                                            <span style="color: #f1f5f9; font-family: 'Segoe UI', sans-serif; font-size: 18px; font-weight: 600;">{contact.name}</span>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Email -->
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 5px;">
                                            <span style="color: #94a3b8; font-family: 'Segoe UI', sans-serif; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">E-mail de Contato</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 25px;">
                                            <a href="mailto:{contact.email}" style="color: #34d399; font-family: 'Segoe UI', sans-serif; font-size: 16px; text-decoration: none;">{contact.email}</a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Box da Mensagem -->
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 10px;">
                                            <span style="color: #94a3b8; font-family: 'Segoe UI', sans-serif; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Mensagem</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="background-color: #0f172a; border: 1px solid #334155; border-radius: 4px; padding: 20px;">
                                            <span style="color: #cbd5e1; font-family: 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.6; display: block;">
                                                {contact.content.replace(chr(10), '<br>')}
                                            </span>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="background-color: #0f172a; padding: 20px; border-top: 1px solid #334155;">
                                <p style="color: #64748b; font-family: 'Segoe UI', sans-serif; font-size: 12px; margin: 0;">
                                    Enviado via <strong style="color: #94a3b8;">Portfolio Cauã Freitas</strong>
                                </p>
                                <p style="color: #475569; font-family: 'Segoe UI', sans-serif; font-size: 10px; margin: 5px 0 0 0;">
                                    Canal Seguro Criptografado • ID da Mensagem: Gerado Automaticamente
                                </p>
                            </td>
                        </tr>

                    </table>
                    
                    <!-- Fechamento Ghost Table -->
                    <!--[if mso]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                    
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    try:
        params = {
            "from": "Portfolio <onboarding@resend.dev>",
            "to": [EMAIL_TO],
            "subject": f"🚀 Nova mensagem de {contact.name}",
            "html": html_content,
            "reply_to": contact.email
        }
        email = resend.Emails.send(params)
        print(f">>> [RESEND] SUCESSO! ID: {email.id}")
        return True
    except Exception as e:
        print(f">>> [RESEND] Erro no envio: {str(e)}")
        sentry_sdk.capture_exception(e)
        return False

# --- ROTAS ---

@app.get("/")
def read_root():
    return {"status": "online"}

# --- ROTA ANTI-SLEEP ---
@app.get("/health-check")
def health_check():
    return {"status": "awake", "message": "Server is up and running!"}

@app.get("/projects")
def get_projects():
    if not supabase: return []
    return supabase.table("projects").select("*").order("created_at", desc=True).execute().data

@app.get("/experiences")
def get_experiences():
    if not supabase: return []
    return supabase.table("experiences").select("*").order("start_date", desc=True).execute().data

# NOVAS ROTAS PARA COMPETÊNCIAS E CERTIFICADOS
@app.get("/skills")
def get_skills():
    if not supabase: return []
    return supabase.table("skills").select("*").order("display_order", desc=False).execute().data

@app.get("/certificates")
def get_certificates():
    if not supabase: return []
    return supabase.table("certificates").select("*").order("display_order", desc=False).execute().data

@app.post("/contact")
@limiter.limit("5/hour")
def send_contact(request: Request, message: ContactMessage):
    print(f"--- ROTA CONTACT CHAMADA: {message.name} ---")
    
    try:
        if supabase:
            supabase.table("messages").insert({
                "name": message.name,
                "email": message.email,
                "content": message.content
            }).execute()
    except Exception as db_error:
        print(f"--- Erro banco: {db_error}")
        sentry_sdk.capture_exception(db_error)

    email_sucesso = send_email_resend(message)
    
    if email_sucesso:
        return {"status": "success", "message": "Mensagem enviada!"}
    else:
        return {"status": "success", "message": "Mensagem salva (Email falhou)!"}
