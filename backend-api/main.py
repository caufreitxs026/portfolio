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

    # Template HTML Premium
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 40px auto; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 1px solid #334155; }}
            .header {{ background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; }}
            .header h1 {{ margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; text-transform: uppercase; }}
            .content {{ padding: 40px 30px; }}
            .info-item {{ margin-bottom: 20px; }}
            .label {{ color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; display: block; margin-bottom: 6px; }}
            .value {{ color: #f1f5f9; font-size: 16px; background-color: #0f172a; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; display: block; }}
            .message-box {{ background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; color: #cbd5e1; line-height: 1.6; margin-top: 10px; }}
            .footer {{ background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155; color: #64748b; font-size: 12px; }}
            .highlight {{ color: #34d399; font-weight: bold; }}
            a {{ color: #34d399; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Novo Contato Recebido 🚀</h1>
            </div>
            <div class="content">
                <div class="info-item">
                    <span class="label">Remetente</span>
                    <span class="value">{contact.name}</span>
                </div>
                
                <div class="info-item">
                    <span class="label">E-mail de Contato</span>
                    <span class="value">{contact.email}</span>
                </div>
                
                <div class="info-item" style="margin-top: 30px;">
                    <span class="label">Mensagem</span>
                    <div class="message-box">
                        {contact.content}
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>Enviado via <strong>Portfolio Cauã Freitas</strong></p>
                <p>Este é um canal seguro e criptografado.</p>
            </div>
        </div>
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
