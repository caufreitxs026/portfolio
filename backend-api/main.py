import os
import resend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

# --- CONFIGURAÇÃO SUPABASE ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Aviso: Variáveis do Supabase não encontradas.")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except:
    supabase = None

# --- CONFIGURAÇÃO RESEND ---
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
EMAIL_TO = os.environ.get("EMAIL_TO") # Seu email pessoal

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY
else:
    print("Aviso: RESEND_API_KEY não encontrada.")

app = FastAPI(title="Portfolio API - Cauã Freitas")

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

# --- FUNÇÃO DE EMAIL (VIA RESEND) ---
def send_email_resend(contact: ContactMessage):
    print(">>> [RESEND] Iniciando envio via API...")
    
    if not RESEND_API_KEY or not EMAIL_TO:
        print(">>> [RESEND] Erro: Configurações de email ausentes.")
        return False

    try:
        params = {
            "from": "Portfolio <onboarding@resend.dev>", # Domínio de teste do Resend
            "to": [EMAIL_TO],
            "subject": f"Portfolio: Novo contato de {contact.name}",
            "html": f"""
            <p><strong>Nova mensagem recebida!</strong></p>
            <p><strong>Nome:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
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
        return False

# --- ROTAS ---

@app.get("/")
def read_root():
    return {"status": "online"}

@app.get("/projects")
def get_projects():
    if not supabase: return []
    return supabase.table("projects").select("*").order("created_at", desc=True).execute().data

@app.get("/experiences")
def get_experiences():
    if not supabase: return []
    return supabase.table("experiences").select("*").order("start_date", desc=True).execute().data

@app.post("/contact")
def send_contact(message: ContactMessage):
    print(f"--- ROTA CONTACT CHAMADA: {message.name} ---")
    
    # 1. Salva no Banco
    try:
        if supabase:
            supabase.table("messages").insert({
                "name": message.name,
                "email": message.email,
                "content": message.content
            }).execute()
            print("--- Salvo no Supabase. ---")
    except Exception as db_error:
        print(f"--- Erro banco: {db_error}")

    # 2. Envia Email via Resend
    email_sucesso = send_email_resend(message)
    
    if email_sucesso:
        return {"status": "success", "message": "Mensagem enviada!"}
    else:
        return {"status": "success", "message": "Mensagem salva (Email falhou)!"}
