import { Message } from '../hooks/useChat'

interface Props {
  message: Message
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  const html = message.content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')

  return (
    <div className={`bubble ${isUser ? 'user' : 'massimmo'}`}>
      <div className="bubble-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
