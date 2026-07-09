interface Props {
  onSubmit: (data: { nom: string; courriel: string; telephone: string }) => void
  onClose: () => void
  status: 'idle' | 'sending' | 'sent' | 'error'
}

import { useState, FormEvent } from 'react'

export function LeadForm({ onSubmit, onClose, status }: Props) {
  const [nom, setNom] = useState('')
  const [courriel, setCourriel] = useState('')
  const [telephone, setTelephone] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ nom, courriel, telephone })
  }

  if (status === 'sent') {
    return (
      <div className="form-overlay">
        <div className="form-card success">
          <p>✅ Demande envoyée !</p>
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-card" onClick={(e) => e.stopPropagation()}>
        <h3>Soyez rappelé dans les 24h</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nom complet *"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Courriel *"
            value={courriel}
            onChange={(e) => setCourriel(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi...' : 'Envoyer'}
          </button>
          {status === 'error' && <p className="form-error">Erreur. Réessayez.</p>}
        </form>
        <button className="form-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}
