export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface LeadData {
  nom: string
  courriel: string
  telephone?: string
  source?: string
  session_id?: string
}

const API = 'https://api.huvioptimisation.com'

export async function sendMessage(
  message: string,
  sessionId: string
): Promise<Message> {
  const res = await fetch(`${API}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  })

  if (!res.ok) {
    return {
      role: 'assistant',
      content:
        'Désolé, je rencontre une difficulté technique. Veuillez réessayer dans quelques instants.',
    }
  }

  const data = await res.json()
  return {
    role: 'assistant',
    content: data.response,
  }
}

export async function createLead(data: LeadData): Promise<void> {
  const res = await fetch(`${API}/lead/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Lead creation failed')
  }
}
