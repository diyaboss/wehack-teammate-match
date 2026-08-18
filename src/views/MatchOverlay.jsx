import React from 'react'
import AnimalAvatar from '../components/AnimalAvatar'

export default function MatchOverlay({ partner, onClose, onOpenChat }) {
  if (!partner) return null

  return (
    <div className="match-overlay" role="dialog" aria-modal="true" aria-label="Team request accepted">
      <button className="close-match" onClick={onClose} aria-label="Close">×</button>
      <div className="match-burst">TEAM REQUEST ACCEPTED</div>
      
      <div className="matched-avatars">
        <AnimalAvatar animal="raccoon" label="Your raccoon" compact />
        <span>+</span>
        <AnimalAvatar animal={partner.animal} label={partner.creature} compact />
      </div>

      <p className="eyebrow">STACKS ALIGNED</p>
      <h2>Time to build<br /><i className="editorial-italic">something together.</i></h2>
      
      <p>
        You and {partner.name.split(' ')[0]} have both accepted the team-up. Your shared team chat is ready.
      </p>

      <button className="primary-action" onClick={() => onOpenChat(partner)}>
        OPEN CHAT <span>↗</span>
      </button>

      <button className="text-action" onClick={onClose}>
        BACK TO PORTAL
      </button>
    </div>
  )
}
