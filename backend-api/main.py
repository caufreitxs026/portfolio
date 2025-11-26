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

# Configuração Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Em produção, isso evita que a API quebre se as envs não carregarem na hora
    print("Aviso: Variáveis do Supabase não encontradas.")

# Tenta conectar, se falhar, a API continua rodando
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except:
    supabase = None

# Configuração Email
EMAIL_FROM = os.environ.get("EMAIL_FROM")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
EMAIL_TO = os.environ.get("EMAIL_TO")

app = FastAPI(title="Portfolio API - Cauã Freitas")

# --- CONFIGURAÇÃO DE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite qualquer origem (Vercel, Localhost)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de Dados
class ContactMessage(BaseModel):
    name: str
    email: str
    content: str

# --- TAREFA DE EMAIL (RODA EM SEGUNDO PLANO) ---
def send_email_background(contact: ContactMessage):
    """
    Esta função roda desconectada da resposta do usuário.
    Se demorar 10 segundos, o usuário não percebe.
    """
    try:
        if not EMAIL_FROM or not EMAIL_PASSWORD:
            print("Email não configurado nas variáveis de ambiente.")
            return

        print(f"Iniciando envio de email para {EMAIL_TO}...")

        # Monta o email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = EMAIL_TO
        msg['Subject'] = f"Portfolio: Novo contato de {contact.name}"

        body = f"""
        NOVA MENSAGEM RECEBIDA PELO PORTFÓLIO
        --------------------------------------
        Nome: {contact.name}
        Email: {contact.email}
        
        Mensagem:
        {contact.content}
        --------------------------------------
        """
        msg.attach(MIMEText(body, 'plain'))

        # Conecta ao servidor SMTP do Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_FROM, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_FROM, EMAIL_TO, text)
        server.quit()
        
        print("Email enviado com sucesso (Background)!")
    except Exception as e:
        # Se der erro aqui, apenas logamos no servidor, o usuário já recebeu o sucesso.
        print(f"ERRO CRÍTICO AO ENVIAR EMAIL: {e}")

# --- ROTAS ---

@app.get("/")
def read_root():
    return {"status": "online", "version": "1.2.0"}

@app.get("/projects")
def get_projects():
    if not supabase: return []
    return supabase.table("projects").select("*").order("created_at", desc=True).execute().data

@app.get("/experiences")
def get_experiences():
    if not supabase: return []
    return supabase.table("experiences").select("*").order("start_date", desc=True).execute().data

@app.post("/contact")
def send_contact(message: ContactMessage, background_tasks: BackgroundTasks):
    try:
        # 1. Salva no Banco de Dados (Isso é rápido)
        if supabase:
            supabase.table("messages").insert({
                "name": message.name,
                "email": message.email,
                "content": message.content
            }).execute()
        
        # 2. Agenda o envio do email para depois (NÃO BLOQUEIA O SITE)
        background_tasks.add_task(send_email_background, message)
        
        # 3. Responde imediatamente para o usuário
        return {
            "message": "Mensagem recebida e salva!", 
            "status": "success"
        }
    except Exception as e:
        print(f"Erro na rota contact: {e}")
        # Mesmo se der erro no banco, tentamos não travar o front
        raise HTTPException(status_code=500, detail="Erro interno ao processar mensagem")
