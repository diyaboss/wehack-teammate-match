import React from 'react'

export default function TopBar({ currentView, navigateTo }) {
  const isHome = currentView === 'welcome'

  return (
    <header className="topbar">
      <button 
        className="brand" 
        onClick={() => navigateTo('welcome')}
        aria-label="WE Hack home"
      >
        <img className="brand-logo" src="/brand/wehack-logo.svg" alt="WE Hack Logo" />
        <span className="brand-text">
          <strong>WE HACK 5.0</strong>
          <small>TEAMMATE MATCH</small>
        </span>
      </button>

      {isHome ? (
        <nav className="home-nav" aria-label="Page sections">
          <a href="#how" onClick={(e) => {
            e.preventDefault()
            document.querySelector('.engine-section')?.scrollIntoView({ behavior: 'smooth' })
          }}>HOW IT MATCHES</a>
          <a href="#rules" onClick={(e) => {
            e.preventDefault()
            document.querySelector('.rules-section')?.scrollIntoView({ behavior: 'smooth' })
          }}>TEAM RULES</a>
        </nav>
      ) : (
        <div className="status-line">
          <span className="pulse" /> MATCHING IS LIVE
        </div>
      )}

      <button className="profile-chip" onClick={() => navigateTo('setup')}>
        <span className="profile-avatar-circle">DG</span>
        <b>YOUR PROFILE</b>
      </button>
    </header>
  )
}
