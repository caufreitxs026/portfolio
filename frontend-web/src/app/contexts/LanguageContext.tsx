'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

// Dicionário de Traduções
const translations = {
  pt: {
    nav: {
      projects: 'Projetos',
      experience: 'Experiência',
      contact: 'Contato',
    },
    hero: {
      role: 'Desenvolvedor Full Stack & Analista de Dados',
      description: 'Transformo problemas complexos em aplicações performáticas e dashboards estratégicos.',
      btnProject: 'Ver Projetos',
      btnCv: 'Currículo',
      openToWork: 'Disponível para Projetos'
    },
    contact: {
      title: 'Vamos Conversar?',
      subtitle: 'Estou disponível para novos desafios. Envie uma mensagem.',
      nameLabel: 'Identificação // Nome',
      namePlaceholder: 'Como devo chamá-lo?',
      emailLabel: 'Canal de Contato // Email',
      msgLabel: 'Payload // Mensagem',
      msgPlaceholder: 'Descreva seu projeto ou ideia...',
      btnSend: 'Iniciar Conexão',
      btnSending: 'Enviando Dados...',
      btnSuccess: 'Mensagem Recebida!',
      btnError: 'Erro no Envio'
    }
  },
  en: {
    nav: {
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact',
    },
    hero: {
      role: 'Full Stack Developer & Data Analyst',
      description: 'I transform complex problems into high-performance applications and strategic dashboards.',
      btnProject: 'View Projects',
      btnCv: 'Resume',
      openToWork: 'Open to Work'
    },
    contact: {
      title: 'Let\'s Talk?',
      subtitle: 'I am available for new challenges. Send me a message.',
      nameLabel: 'Identification // Name',
      namePlaceholder: 'How should I call you?',
      emailLabel: 'Contact Channel // Email',
      msgLabel: 'Payload // Message',
      msgPlaceholder: 'Describe your project or idea...',
      btnSend: 'Init Connection',
      btnSending: 'Sending Data...',
      btnSuccess: 'Message Received!',
      btnError: 'Sending Error'
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
