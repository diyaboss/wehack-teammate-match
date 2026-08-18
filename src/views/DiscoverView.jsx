import React, { useState, useMemo, useRef } from 'react'
import { profiles } from '../data/profiles'
import AnimalAvatar from '../components/AnimalAvatar'
import MatchOverlay from './MatchOverlay'
import ChatPanel from './ChatPanel'

export default function DiscoverView({ onExit, showToast }) {
  const [mode, setMode] = useState('discover')
  const [genderFilter, setGenderFilter] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // State for requests / chat
  const [sentRequests, setSentRequests] = useState([])
  const [acceptedRequests, setAcceptedRequests] = useState([])
  const [mutualMatch, setMutualMatch] = useState(null)
  const [activeChat, setActiveChat] = useState(null)
  
  const [swipeOffset, setSwipeOffset] = useState(0)
  const swipeStartRef = useRef(null)

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    if (genderFilter === 'All') return profiles
    return profiles.filter(p => p.gender === genderFilter)
  }, [genderFilter])

  // Get current and next profile (looping)
  const activeProfile = filteredProfiles[currentIndex % filteredProfiles.length]
  const nextProfile = filteredProfiles[(currentIndex + 1) % filteredProfiles.length]

  // Pending incoming requests (mock: everyone except sent)
  // For the demo, incoming requests are profiles where 'match' is true, OR specific subset
  const incomingRequests = useMemo(() => {
    return profiles.filter(p => p.match && !acceptedRequests.includes(p.name))
  }, [acceptedRequests])

  const handleNext = (animate = false) => {
    if (animate) {
      setSwipeOffset(-600)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setSwipeOffset(0)
      }, 250)
    } else {
      setCurrentIndex(prev => prev + 1)
      setSwipeOffset(0)
    }
  }

  const handleTeamUp = () => {
    if (!activeProfile) return
    
    // If it's a mutual match (mock flag in data)
    if (activeProfile.match || incomingRequests.some(r => r.name === activeProfile.name)) {
      setAcceptedRequests(prev => [...prev, activeProfile.name])
      setMutualMatch(activeProfile)
    } else {
      setSentRequests(prev => [...prev, activeProfile.name])
      showToast(`TEAM REQUEST SENT TO ${activeProfile.name.toUpperCase()} · THEY'LL SEE IT IN TEAM REQUESTS`)
    }
    
    setSwipeOffset(600)
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwipeOffset(0)
    }, 250)
  }

  const handleAcceptRequest = (profile) => {
    setAcceptedRequests(prev => [...prev, profile.name])
    setMutualMatch(profile)
  }

  const openChat = (profile) => {
    setMutualMatch(null)
    setActiveChat(profile)
  }

  const handlePointerDown = (e) => {
    swipeStartRef.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (swipeStartRef.current !== null) {
      setSwipeOffset(e.clientX - swipeStartRef.current)
    }
  }

  const handlePointerUp = () => {
    swipeStartRef.current = null
    if (swipeOffset > 100) {
      handleTeamUp()
    } else if (swipeOffset < -100) {
      handleNext(true)
    } else {
      setSwipeOffset(0)
    }
  }

  const cardStyle = {
    transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 30}deg)`
  }

  return (
    <section className="discover-screen">
      <div className="portal-toolbar">
        <button className="exit-matching" onClick={onExit}>← EXIT MATCHING</button>
        
        <div className="portal-modes" role="tablist">
          <button 
            role="tab" 
            className={mode === 'discover' ? 'active' : ''} 
            onClick={() => setMode('discover')}
          >
            DISCOVER
          </button>
          <button 
            role="tab" 
            className={mode === 'requests' ? 'active' : ''} 
            onClick={() => setMode('requests')}
          >
            TEAM REQUESTS <b>{incomingRequests.length}</b>
          </button>
        </div>

        {mode === 'discover' ? (
          <label className="gender-filter">
            <span>GENDER FILTER</span>
            <select 
              value={genderFilter} 
              onChange={e => {
                setGenderFilter(e.target.value)
                setCurrentIndex(0)
              }}
            >
              <option value="All">All genders</option>
              <option value="Woman">Women</option>
              <option value="Man">Men</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </label>
        ) : (
          <small>{incomingRequests.length} PENDING</small>
        )}
      </div>

      {mode === 'discover' ? (
        <div className="discover-layout">
          <aside className="match-rail">
            <p className="eyebrow">SMART ORDER</p>
            <h1>Meet people who complete your stack.</h1>
            <p className="pairing-note">
              We pair complementary people whose strengths fill the gaps in your team.
            </p>
            
            {activeProfile && (
              <div className="rail-score">
                <strong>{activeProfile.score}%</strong>
                <span>COMPLEMENT<br />SCORE</span>
              </div>
            )}
            <p className="filtered-count">
              <b>{String((currentIndex % (filteredProfiles.length || 1)) + 1).padStart(2, '0')}</b> / {String(filteredProfiles.length).padStart(2, '0')} IN THIS VIEW
            </p>
          </aside>

          <div className="deck-wrap">
            {filteredProfiles.length > 0 ? (
              <>
                <div 
                  className="swipe-stamp stamp-next" 
                  style={{ opacity: Math.max(0, -swipeOffset / 100) }}
                >
                  NEXT
                </div>
                <div 
                  className="swipe-stamp stamp-team" 
                  style={{ opacity: Math.max(0, swipeOffset / 100) }}
                >
                  TEAM UP
                </div>

                {nextProfile && (
                  <article className="profile-card card-behind">
                    <AnimalAvatar animal={nextProfile.animal} label={nextProfile.creature} />
                  </article>
                )}

                <article 
                  className="profile-card active-card" 
                  style={cardStyle}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
                  <div className="profile-visual">
                    <AnimalAvatar animal={activeProfile.animal} label={activeProfile.creature} />
                    <span className="card-count">
                      {String((currentIndex % filteredProfiles.length) + 1).padStart(2, '0')} / {String(filteredProfiles.length).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="profile-copy">
                    <div className="name-line">
                      <div>
                        <h2>{activeProfile.name}</h2>
                        <p>{activeProfile.year} · {activeProfile.branch} · {activeProfile.gender}</p>
                      </div>
                      <span className="available">AVAILABLE</span>
                    </div>

                    <h3>{activeProfile.role}</h3>
                    <p className="bio">{activeProfile.bio}</p>

                    <div className="skill-columns">
                      <div>
                        <small>THEY BUILD WITH</small>
                        <div>
                          {activeProfile.skills.map(s => <span key={s}>{s}</span>)}
                        </div>
                      </div>
                      <div>
                        <small>THEY WANT FROM A TEAMMATE</small>
                        <div>
                          {activeProfile.lookingFor.map(s => <span key={s}>{s}</span>)}
                        </div>
                      </div>
                    </div>

                    <div className="why">
                      <b>WHY YOU SHOULD TEAM UP</b>
                      {activeProfile.reason.map((r, i) => (
                        <p key={i}><span>↳</span> {r}</p>
                      ))}
                    </div>

                    <div className="personality">
                      <p>
                        <small>HACKATHON ANIMAL</small>
                        {activeProfile.creature}
                      </p>
                      <p>
                        <small>WHEN IT BREAKS AT 2:47 AM</small>
                        {activeProfile.crisis}
                      </p>
                    </div>
                  </div>
                </article>
              </>
            ) : (
              <div style={{ padding: '40px', color: 'var(--paper-dim)' }}>
                No profiles found for this gender filter.
              </div>
            )}
          </div>

          <div className="swipe-actions">
            <button className="next-button" onClick={() => handleNext(true)}>
              <span>←</span>
              <div>
                <b>NEXT</b>
                <small>Maybe later</small>
              </div>
            </button>
            <button 
              className="team-button" 
              onClick={handleTeamUp}
              disabled={!activeProfile || sentRequests.includes(activeProfile.name)}
            >
              <span>{sentRequests.includes(activeProfile?.name) ? '✓' : '→'}</span>
              <div>
                <b>{sentRequests.includes(activeProfile?.name) ? 'REQUEST SENT' : 'TEAM UP'}</b>
                <small>{sentRequests.includes(activeProfile?.name) ? 'They can review it' : 'I’d build with them'}</small>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="requests-layout">
          <div className="requests-intro">
            <p className="eyebrow">INCOMING TEAM REQUESTS</p>
            <h1>People who want to build with you.</h1>
            <p>These participants sent you a Team Up request. Review what they bring, then accept if the stack works for your team.</p>
            <span>ACCEPTING OPENS A TEAM CHAT</span>
          </div>
          
          <div className="request-list">
            {incomingRequests.length > 0 ? (
              incomingRequests.map(req => (
                <article key={req.name} className="request-card">
                  <div className="request-avatar">
                    <AnimalAvatar animal={req.animal} label={req.creature} />
                  </div>
                  <div className="request-details">
                    <p>{req.year} · {req.branch} · {req.gender}</p>
                    <h2>{req.name}</h2>
                    <h3>{req.role}</h3>
                    <div className="request-skills">
                      {req.skills.slice(0, 4).map(s => <span key={s}>{s}</span>)}
                    </div>
                    <div className="request-reason">
                      <b>WHY IT COULD WORK</b>
                      <span>↳ {req.reason[0]}</span>
                    </div>
                  </div>
                  <div className="request-actions">
                    <span>
                      {req.score}%
                      <small>COMPLEMENT</small>
                    </span>
                    <button onClick={() => {
                      setGenderFilter('All')
                      setMode('discover')
                      setCurrentIndex(profiles.findIndex(p => p.name === req.name))
                    }}>
                      VIEW PROFILE
                    </button>
                    <button className="accept-request" onClick={() => handleAcceptRequest(req)}>
                      ACCEPT TEAM REQUEST <b>→</b>
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="requests-empty">
                <b>INBOX CLEAR</b>
                <p>You have reviewed every team request.</p>
                <button onClick={() => setMode('discover')} style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--accent)', 
                  color: 'var(--accent)',
                  padding: '12px 24px',
                  marginTop: '24px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  letterSpacing: '0.1em'
                }}>
                  BACK TO DISCOVERY →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {mutualMatch && (
        <MatchOverlay 
          partner={mutualMatch} 
          onClose={() => setMutualMatch(null)}
          onOpenChat={openChat}
        />
      )}

      {activeChat && (
        <ChatPanel 
          partner={activeChat} 
          onClose={() => setActiveChat(null)}
        />
      )}
    </section>
  )
}
