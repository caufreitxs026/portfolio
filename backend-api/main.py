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

# Novo Modelo para Feedback
class FeedbackLog(BaseModel):
    usability: int
    design: int
    projects: int
    structure: int
    experience: int
    mechanics: int
    suggestion: str | None = None

def send_email_resend(contact: ContactMessage):
    print(">>> [RESEND] Iniciando envio via API...")
    if not RESEND_API_KEY: return False

    # Template HTML Premium Otimizado para Outlook
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
            body {{ margin: 0; padding: 0; width: 100% !important; background-color: #020617; }}
            
            /* Tipografia e Cores */
            .text-muted {{ color: #94a3b8; }}
            .text-light {{ color: #f8fafc; }}
            .border-color {{ border-color: #1e293b; }}
            .bg-card {{ background-color: #0f172a; }}
            
            @media screen and (max-width: 600px) {{
                .container {{ width: 100% !important; }}
                .mobile-padding {{ padding-left: 24px !important; padding-right: 24px !important; }}
                .mobile-title {{ font-size: 20px !important; }}
            }}
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020617;">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #020617;">
            <tr>
                <td align="center" style="padding: 60px 0;">
                    
                    <!--[if mso]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    
                    <!-- Container Principal (Efeito Cartão Flutuante) -->
                    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; border-collapse: separate; mso-border-radius-alt: 12px;">
                        
                        <!-- Barra Superior Emerald -->
                        <tr>
                            <td height="4" style="background-color: #10b981; font-size: 0; line-height: 0;">&nbsp;</td>
                        </tr>

                        <!-- Cabeçalho -->
                        <tr>
                            <td class="mobile-padding" style="padding: 40px 40px 10px 40px;">
                                <h1 class="mobile-title" style="color: #f8fafc; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                                    Novo Contato Recebido
                                </h1>
                                <p style="color: #94a3b8; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; margin: 8px 0 0 0;">
                                    Uma nova mensagem foi enviada através do seu portfólio.
                                </p>
                            </td>
                        </tr>

                        <!-- Divisor Sutil -->
                        <tr>
                            <td style="padding: 20px 40px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td height="1" style="background-color: #1e293b; font-size: 0; line-height: 0;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Conteúdo Principal -->
                        <tr>
                            <td class="mobile-padding" style="padding: 0 40px 40px 40px;">
                                
                                <!-- Detalhes do Remetente -->
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 24px;">
                                            
                                            <!-- Nome -->
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                                <tr>
                                                    <td width="30" valign="middle" style="padding-right: 12px;">
                                                        <!-- Ícone Simulado (Bullet) -->
                                                        <span style="height: 8px; width: 8px; background-color: #10b981; border-radius: 50%; display: block;"></span>
                                                    </td>
                                                    <td valign="middle">
                                                        <span style="color: #64748b; font-family: 'Segoe UI', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Nome</span>
                                                        <div style="color: #f1f5f9; font-family: 'Segoe UI', sans-serif; font-size: 16px; font-weight: 500; margin-top: 4px;">{contact.name}</div>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Email -->
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td width="30" valign="middle" style="padding-right: 12px;">
                                                        <span style="height: 8px; width: 8px; background-color: #3b82f6; border-radius: 50%; display: block;"></span>
                                                    </td>
                                                    <td valign="middle">
                                                        <span style="color: #64748b; font-family: 'Segoe UI', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Email</span>
                                                        <div style="margin-top: 4px;">
                                                            <a href="mailto:{contact.email}" style="color: #f1f5f9; font-family: 'Segoe UI', sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; border-bottom: 1px dotted #94a3b8;">{contact.email}</a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>
                                    
                                    <!-- Caixa de Mensagem (Design Tátil) -->
                                    <tr>
                                        <td>
                                            <span style="color: #64748b; font-family: 'Segoe UI', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; display: block; margin-bottom: 12px;">Mensagem</span>
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <span style="color: #cbd5e1; font-family: 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.6; display: block;">
                                                            {contact.content.replace(chr(10), '<br>')}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <!-- Rodapé do Cartão -->
                        <tr>
                            <td align="center" style="background-color: #020617; padding: 24px; border-top: 1px solid #1e293b;">
                                <p style="color: #475569; font-family: 'Segoe UI', sans-serif; font-size: 11px; margin: 0; letter-spacing: 0.5px;">
                                    PORTFOLIO SYSTEM • SECURE CHANNEL
                                </p>
                            </td>
                        </tr>

                    </table>
                    
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
            "subject": f"Nova mensagem de {contact.name}",
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

# --- ROTA DE FEEDBACK ---
@app.post("/feedback")
@limiter.limit("3/hour") # Limite mais restrito para evitar spam de feedback
def send_feedback(request: Request, feedback: FeedbackLog):
    try:
        if supabase:
            supabase.table("feedback_logs").insert({
                "usability": feedback.usability,
                "design": feedback.design,
                "projects": feedback.projects,
                "structure": feedback.structure,
                "experience": feedback.experience,
                "mechanics": feedback.mechanics,
                "suggestion": feedback.suggestion
            }).execute()
            return {"status": "success", "message": "Feedback logged"}
        else:
             raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        print(f"--- Erro Feedback: {str(e)}")
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail="Error processing feedback")
