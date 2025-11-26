import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

# --- CONFIGURAÇÃO SUPABASE ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
# Usamos o email de destino para saber onde entregar
EMAIL_TO = os.environ.get("EMAIL_TO") 

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Aviso: Variáveis do Supabase não encontradas.")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except:
    supabase = None

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

# --- NOVA FUNÇÃO DE EMAIL (VIA API HTTP) ---
def send_email_http(contact: ContactMessage):
    """
    Envia o email usando uma requisição HTTP POST (Porta 443).
    Isso contorna o bloqueio de portas SMTP do Render.
    """
    print(">>> [HTTP] Iniciando envio via API...")
    
    if not EMAIL_TO:
        print(">>> [HTTP] Erro: EMAIL_TO não configurado.")
        return False

    # URL do serviço que vai entregar o email para você
    url = f"https://formsubmit.co/{EMAIL_TO}"
    
    # Dados que vão chegar no seu email
    payload = {
        "name": contact.name,
        "email": contact.email, # O email da pessoa (para você poder responder)
        "message": contact.content,
        "_subject": f"Portfolio: Contato de {contact.name}",
        "_template": "table", # Formata bonito
        "_captcha": "false"   # Desativa captcha manual
    }

    try:
        # O Python acessa a URL como se fosse um navegador
        response = requests.post(url, data=payload)
        
        if response.status_code == 200:
            print(">>> [HTTP] SUCESSO! API respondeu OK.")
            return True
        else:
            print(f">>> [HTTP] Falha na API: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f">>> [HTTP] Erro de Conexão: {str(e)}")
        return False

# --- ROTAS ---

@app.get("/")
def read_root():
    return {"status": "online", "method": "http-tunnel"}

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
    
    # 1. Salva no Banco (Sua garantia de dados)
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

    # 2. Envia Email via HTTP
    email_sucesso = send_email_http(message)
    
    if email_sucesso:
        return {"status": "success", "message": "Mensagem enviada com sucesso!"}
    else:
        # Mesmo se o email falhar, salvamos no banco, então é um sucesso parcial
        return {"status": "success", "message": "Mensagem salva no banco!"}
