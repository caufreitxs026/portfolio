import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

# 1. Carrega variáveis
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

# --- CONFIGURAÇÃO EMAIL ---
EMAIL_FROM = os.environ.get("EMAIL_FROM")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
EMAIL_TO = os.environ.get("EMAIL_TO")

# DEBUG: Imprimir configurações
print(f"DEBUG INICIAL - EMAIL_FROM: {EMAIL_FROM}")
print(f"DEBUG INICIAL - EMAIL_TO: {EMAIL_TO}")
print(f"DEBUG INICIAL - Senha Configurada? {'SIM' if EMAIL_PASSWORD else 'NÃO'}")

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

# --- FUNÇÃO DE EMAIL (AGORA SÍNCRONA) ---
def send_email_sync(contact: ContactMessage):
    print(">>> [SYNC] Iniciando envio de email (Bloqueante)...")
    
    try:
        if not EMAIL_FROM or not EMAIL_PASSWORD:
            print(">>> [SYNC] ERRO: Credenciais de email ausentes.")
            return False

        print(f">>> [SYNC] Tentando conectar ao SMTP SSL (465)...")
        
        # Monta o email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = EMAIL_TO
        msg['Subject'] = f"Portfolio: Novo contato de {contact.name}"

        body = f"""
        Nome: {contact.name}
        Email: {contact.email}
        Mensagem: {contact.content}
        """
        msg.attach(MIMEText(body, 'plain'))

        # Conexão
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.set_debuglevel(1) 
        
        print(">>> [SYNC] Conectado. Fazendo login...")
        server.login(EMAIL_FROM, EMAIL_PASSWORD)
        
        print(">>> [SYNC] Enviando mensagem...")
        text = msg.as_string()
        server.sendmail(EMAIL_FROM, EMAIL_TO, text)
        
        server.quit()
        print(">>> [SYNC] SUCESSO! Email enviado.")
        return True
        
    except Exception as e:
        print(f">>> [SYNC] ERRO CRÍTICO: {str(e)}")
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
    # Removemos 'background_tasks' dos parâmetros e 'async' da definição
    print(f"--- ROTA CONTACT CHAMADA: {message.name} ---")
    
    try:
        # 1. Salva no Banco
        if supabase:
            print("--- Salvando no Supabase... ---")
            supabase.table("messages").insert({
                "name": message.name,
                "email": message.email,
                "content": message.content
            }).execute()
            print("--- Salvo no Supabase com sucesso. ---")
        
        # 2. Envia Email AGORA (o usuário espera terminar)
        print("--- Enviando email de forma SÍNCRONA... ---")
        email_sucesso = send_email_sync(message)
        
        if email_sucesso:
            print("--- Email enviado. Retornando resposta 200. ---")
            return {"status": "success", "message": "Recebido e Email Enviado"}
        else:
            print("--- Email falhou, mas salvo no banco. ---")
            return {"status": "partial_success", "message": "Salvo, mas falha no email"}
            
    except Exception as e:
        print(f"--- ERRO NA ROTA: {e} ---")
        raise HTTPException(status_code=500, detail="Erro interno")
