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

# Configuração Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("As variáveis SUPABASE_URL e SUPABASE_KEY são obrigatórias no .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuração Email
EMAIL_FROM = os.environ.get("EMAIL_FROM")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
EMAIL_TO = os.environ.get("EMAIL_TO")

app = FastAPI(title="Portfolio API - Cauã Freitas")

# --- CONFIGURAÇÃO DE CORS (NOVO) ---
# Permite que o Frontend (localhost:3000) converse com este Backend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, substitua "*" pela URL do seu site
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de Dados
class ContactMessage(BaseModel):
    name: str
    email: str
    content: str

# --- FUNÇÃO AUXILIAR DE EMAIL ---
def send_email_notification(contact: ContactMessage):
    try:
        if not EMAIL_FROM or not EMAIL_PASSWORD:
            print("Email não configurado no .env, pulando envio.")
            return False

        # Monta o email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = EMAIL_TO
        msg['Subject'] = f"Novo contato no Portfolio: {contact.name}"

        body = f"""
        Você recebeu uma nova mensagem do site!
        
        Nome: {contact.name}
        Email: {contact.email}
        
        Mensagem:
        {contact.content}
        """
        msg.attach(MIMEText(body, 'plain'))

        # Conecta ao servidor SMTP do Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() # Criptografia
        server.login(EMAIL_FROM, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_FROM, EMAIL_TO, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return False

# --- ROTAS ---

@app.get("/")
def read_root():
    return {"status": "online", "message": "API do Portfólio rodando com CORS ativado."}

@app.get("/projects")
def get_projects():
    # Retorna projetos ordenados por data de criação
    return supabase.table("projects").select("*").order("created_at", desc=True).execute().data

@app.get("/experiences")
def get_experiences():
    # Retorna experiências ordenadas pela data de início
    return supabase.table("experiences").select("*").order("start_date", desc=True).execute().data

@app.post("/contact")
def send_contact(message: ContactMessage):
    try:
        # 1. Salva no Banco de Dados
        supabase.table("messages").insert({
            "name": message.name,
            "email": message.email,
            "content": message.content
        }).execute()
        
        # 2. Envia Notificação por Email
        email_sent = send_email_notification(message)
        
        return {
            "message": "Mensagem recebida!", 
            "db_saved": True, 
            "email_sent": email_sent
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))