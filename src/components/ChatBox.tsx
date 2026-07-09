import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Message } from '../hooks/useChat'
import { MessageBubble } from './MessageBubble'
import { TypingDots } from './TypingDots'

interface Props {
  messages: Message[]
  loading: boolean
  onSend: (text: string) => void
}

export function ChatBox({ messages, loading, onSend }: Props) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [loading])

  const handleSend = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    onSend(text)
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-box">
      <div className="messages-list">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && <TypingDots />}
      </div>
      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Écrivez votre message..."
          disabled={loading}
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Envoyer"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
