'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'pt' | 'en';

const translations = {
  pt: {
    nav: {
      projects: 'Projetos',
      experience: 'Experiência',
      contact: 'Contato',
    },
    hero: {
      openToWork: 'Disponível para Projetos',
      greeting: 'Olá, sou',
      role: 'Desenvolvedor Full Stack & Analista de Dados',
      description: 'Desenvolvedor Full Stack e Analista de Dados focado em construir aplicações performáticas e dashboards estratégicos que geram valor real para o negócio.',
      btnProject: 'Ver Projetos',
      btnCv: 'Currículo',
      codeComment: '# Inicializando perfil...',
      codeRole: 'Analista de Suporte',
      codeLocation: 'Feira de Santana, BA'
    },
    home: {
      projectsTitle: 'Projetos em Destaque',
      projectsSubtitle: 'Casos reais onde apliquei tecnologia para gerar valor.',
      loading: 'Carregando dados do servidor...',
      experienceTitle: 'Experiência Profissional',
      contactTitle: 'Vamos Conversar?',
      contactSubtitle: 'Estou disponível para novos desafios. Envie uma mensagem.'
    },
    contact: {
      nameLabel: 'Identificação // Nome',
      namePlaceholder: 'Como devo chamá-lo?',
      emailLabel: 'Canal de Contato // Email',
      emailPlaceholder: 'seu@email.com',
      msgLabel: 'Payload // Mensagem',
      msgPlaceholder: 'Descreva seu projeto ou ideia...',
      btnSend: 'Iniciar Conexão',
      btnSending: 'Enviando Dados...',
      btnSuccess: 'Mensagem Recebida!',
      btnError: 'Erro no Envio',
      secure: 'CANAL SEGURO CRIPTOGRAFADO'
    },
    footer: {
      rights: 'Todos os direitos reservados.',
      developed: 'Desenvolvido com'
    }
  },
  en: {
    nav: {
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact',
    },
    hero: {
      openToWork: 'Open to Work',
      greeting: 'Hi, I am',
      role: 'Full Stack Developer & Data Analyst',
      description: 'Full Stack Developer and Data Analyst focused on building high-performance applications and strategic dashboards that generate real business value.',
      btnProject: 'View Projects',
      btnCv: 'Resume',
      codeComment: '# Initializing profile...',
      codeRole: 'Support Analyst',
      codeLocation: 'Bahia, Brazil'
    },
    home: {
      projectsTitle: 'Featured Projects',
      projectsSubtitle: 'Real cases where I applied technology to generate value.',
      loading: 'Loading server data...',
      experienceTitle: 'Professional Experience',
      contactTitle: 'Let\'s Talk?',
      contactSubtitle: 'I am available for new challenges. Send me a message.'
    },
    contact: {
      nameLabel: 'Identification // Name',
      namePlaceholder: 'How should I call you?',
      emailLabel: 'Contact Channel // Email',
      emailPlaceholder: 'your@email.com',
      msgLabel: 'Payload // Message',
      msgPlaceholder: 'Describe your project or idea...',
      btnSend: 'Init Connection',
      btnSending: 'Sending Data...',
      btnSuccess: 'Message Received!',
      btnError: 'Sending Error',
      secure: 'SECURE CHANNEL ENCRYPTED'
    },
    footer: {
      rights: 'All rights reserved.',
      developed: 'Developed with'
    }
  }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: typeof translations['pt'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
