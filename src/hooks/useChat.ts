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
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000) // 60s max

  try {
    const res = await fetch(`${API}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return {
        role: 'assistant',
        content: 'Désolé, je rencontre une difficulté technique. Veuillez réessayer.',
      }
    }

    const data = await res.json()
    return { role: 'assistant', content: data.response }
  } catch (err: any) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') {
      return { role: 'assistant', content: 'Désolé, ma réponse prend trop de temps. Pouvez-vous reformuler ?' }
    }
    return { role: 'assistant', content: 'Désolé, je rencontre une difficulté technique. Veuillez réessayer.' }
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
