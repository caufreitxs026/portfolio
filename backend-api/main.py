import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException, BackgroundTasks
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

# DEBUG: Imprimir configurações (mas ocultando a senha por segurança)
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

# --- TAREFA DE EMAIL ---
def send_email_background(contact: ContactMessage):
    print(">>> [BACKGROUND] Iniciando tarefa de envio de email...")
    
    try:
        if not EMAIL_FROM or not EMAIL_PASSWORD:
            print(">>> [BACKGROUND] ERRO: Credenciais de email ausentes.")
            return

        print(f">>> [BACKGROUND] Tentando conectar ao SMTP SSL (465)...")
        
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
        # Modo Debug do SMTP para ver a conversa com o Gmail
        server.set_debuglevel(1) 
        
        print(">>> [BACKGROUND] Conectado. Fazendo login...")
        server.login(EMAIL_FROM, EMAIL_PASSWORD)
        
        print(">>> [BACKGROUND] Enviando mensagem...")
        text = msg.as_string()
        server.sendmail(EMAIL_FROM, EMAIL_TO, text)
        
        server.quit()
        print(">>> [BACKGROUND] SUCESSO! Email enviado.")
        
    except Exception as e:
        print(f">>> [BACKGROUND] ERRO CRÍTICO: {str(e)}")

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
async def send_contact(message: ContactMessage, background_tasks: BackgroundTasks):
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
        
        # 2. Agenda Background Task
        print("--- Agendando tarefa de email... ---")
        background_tasks.add_task(send_email_background, message)
        print("--- Tarefa agendada. Retornando resposta 200. ---")
        
        return {"status": "success", "message": "Recebido"}
    except Exception as e:
        print(f"--- ERRO NA ROTA: {e} ---")
        raise HTTPException(status_code=500, detail="Erro interno")
