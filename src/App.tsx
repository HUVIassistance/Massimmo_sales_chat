import { useState, useRef, useEffect } from 'react'
import { ChatBox } from './components/ChatBox'
import { LeadForm } from './components/LeadForm'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Message, sendMessage, createLead } from './hooks/useChat'

const SESSION_KEY = 'massimmo_session'

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = 'lead_' + Math.random().toString(36).slice(2, 10)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Bonjour ! Je suis **Massimmo**, votre assistant immobilier.\n\nAchat · Vente · Estimation · Conseil. Que puis-je faire pour vous ?',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: 'user', content: text }
    setMessages((m) => [...m, userMsg])
    setLoading(true)

    const reply = await sendMessage(text, getSessionId())
    setMessages((m) => [...m, reply])
    setLoading(false)
  }

  const handleLeadSubmit = async (data: { nom: string; courriel: string; telephone: string }) => {
    setFormStatus('sending')
    try {
      await createLead({
        nom: data.nom,
        courriel: data.courriel,
        telephone: data.telephone,
        source: 'Widget chat',
        session_id: getSessionId(),
      })
      setFormStatus('sent')
      setShowForm(false)
      const confirm: Message = {
        role: 'assistant',
        content: `Merci ${data.nom} ! J'ai transmis votre demande à notre courtier qui vous contactera dans les 24h. D'ici là, vous pouvez continuer à me poser vos questions.`,
      }
      setMessages((m) => [...m, confirm])
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <div className="widget-container">
      <Header onInfoClick={() => setShowForm(true)} />
      <div className="messages-area">
        <ChatBox messages={messages} loading={loading} onSend={handleSend} />
        <div ref={bottomRef} />
      </div>
      {showForm && (
        <LeadForm
          onSubmit={handleLeadSubmit}
          onClose={() => setShowForm(false)}
          status={formStatus}
        />
      )}
      <Footer />
    </div>
  )
}
