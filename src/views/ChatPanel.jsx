import React, { useState } from 'react'
import AnimalAvatar from '../components/AnimalAvatar'

export default function ChatPanel({ partner, onClose }) {
  const [messages, setMessages] = useState([
    "Hey! Looks like our stacks fit really well. What are you thinking of building?"
  ])
  const [inputValue, setInputValue] = useState('')

  if (!partner) return null

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    setMessages(prev => [...prev, inputValue])
    setInputValue('')
    
    // Mock partner reply
    setTimeout(() => {
      setMessages(prev => [...prev, "I’m in. Want to sketch the idea and split the stack?"])
    }, 1000)
  }

  return (
    <aside className="chat-panel" role="dialog" aria-modal="true" aria-label={`Chat with ${partner.name}`}>
      <header>
        <AnimalAvatar animal={partner.animal} label={partner.creature} compact />
        <div>
          <small>TEAM CHAT</small>
          <strong>{partner.name}</strong>
          <span><i /> ONLINE NOW</span>
        </div>
        <button onClick={onClose} aria-label="Close chat">×</button>
      </header>
      
      <div className="chat-context">
        <b>{partner.score}% COMPLEMENT SCORE</b>
        <span>Your skills + their stack. That could actually ship.</span>
      </div>

      <div className="messages">
        <div className="system-message">Team request accepted today</div>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${i === 0 || i % 2 === 0 ? 'theirs' : 'mine'}`}>
            {msg}
          </div>
        ))}
      </div>

      <div className="quick-replies">
        <button onClick={() => setInputValue('Hey! Want to compare project ideas?')}>COMPARE IDEAS</button>
        <button onClick={() => setInputValue('What stack do you want to use?')}>TALK STACK</button>
      </div>

      <form onSubmit={handleSend}>
        <input 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)}
          placeholder={`Message ${partner.name.split(' ')[0]}`}
          aria-label="Message"
        />
        <button type="submit" aria-label="Send message">↑</button>
      </form>
    </aside>
  )
}
