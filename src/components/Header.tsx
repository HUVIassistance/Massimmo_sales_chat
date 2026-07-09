interface Props {
  onInfoClick: () => void
}

export function Header({ onInfoClick }: Props) {
  return (
    <div className="widget-header">
      <div className="header-logo">M</div>
      <div className="header-info">
        <div className="header-title">Massimmo</div>
        <div className="header-subtitle">Assistant immobilier</div>
      </div>
      <button className="header-action" onClick={onInfoClick} aria-label="Demander un rappel">
        📞 Rappel
      </button>
    </div>
  )
}
