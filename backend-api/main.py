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
RESEND_API_KEY = os.environ.get("RESEND_API_KEY") or "re_7hKWQt9L_9HUJKpAbADvVkCHhTpdDhkDE"
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

    try:
        params = {
            "from": "Portfolio <onboarding@resend.dev>",
            "to": [EMAIL_TO],
            "subject": f"Portfolio: Novo contato de {contact.name}",
            "html": f"""
            <h3>Nova mensagem recebida!</h3>
            <p><strong>Nome:</strong> {contact.name}</p>
            <p><strong>Email do Visitante:</strong> {contact.email}</p>
            <hr />
            <p><strong>Mensagem:</strong></p>
            <p>{contact.content}</p>
            """,
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

# --- ROTA ANTI-SLEEP (NOVA) ---
# Esta rota será chamada a cada 14 min pelo cron-job para manter o Render acordado
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
