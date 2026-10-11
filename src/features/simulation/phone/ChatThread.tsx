import type { ChatLine } from '../whatsappStart';

interface ChatThreadProps {
  lines: readonly ChatLine[];
  typing: boolean;
  senderName: string;
}

export function ChatThread({ lines, typing, senderName }: ChatThreadProps) {
  return (
    <div className="phone-thread phone-thread--chat">
      {lines.length === 0 && !typing ? (
        <p className="phone-thread__empty">Conversación vacía</p>
      ) : null}
      {lines.map((line) => (
        <div key={line.id} className="phone-bubble" data-tone={line.tone}>
          {line.tone === 'incoming' ? (
            <span className="phone-bubble__who">{senderName}</span>
          ) : null}
          <p className="phone-bubble__text">{line.body}</p>
          <span className="phone-bubble__time">{line.time}</span>
        </div>
      ))}
      {typing ? (
        <div
          className="phone-bubble phone-typing"
          data-tone="incoming"
          aria-live="polite"
          aria-label={`${senderName} está escribiendo`}
        >
          <span className="phone-bubble__who">{senderName}</span>
          <span className="phone-typing__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      ) : null}
    </div>
  );
}