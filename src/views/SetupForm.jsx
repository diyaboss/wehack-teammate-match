import React, { useState } from 'react'
import { allSkills } from '../data/profiles'

export default function SetupForm({ onComplete, onBack }) {
  const [selectedSkills, setSelectedSkills] = useState(['AI / ML', 'Cybersecurity'])
  const [lookingFor, setLookingFor] = useState(['React', 'UI / UX'])

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const toggleLookingFor = (skill) => {
    setLookingFor(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onComplete()
  }

  return (
    <section className="setup-screen">
      <div className="setup-heading">
        <button className="back-home" onClick={onBack}>← BACK HOME</button>
        <p className="eyebrow">01 / QUICK SETUP</p>
        <h1>What do you<br />bring to the table?</h1>
      </div>

      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label>
            <span>Your name</span>
            <input type="text" defaultValue="Diya Gupta" required />
          </label>
          <label>
            <span>Branch & year</span>
            <input type="text" defaultValue="CSE Cybersecurity · 2nd year" required />
          </label>
        </div>

        <label className="wide-field">
          <span>Current team size</span>
          <select defaultValue="Just me">
            <option>Just me</option>
            <option>2 people</option>
            <option>3 people</option>
            <option>4 people</option>
          </select>
        </label>

        <fieldset>
          <legend>
            Your strongest skills <small>Pick 2–4</small>
          </legend>
          <div className="choice-grid">
            {allSkills.slice(0, 9).map(skill => (
              <button 
                key={skill}
                type="button" 
                className={selectedSkills.includes(skill) ? 'selected' : ''}
                onClick={() => toggleSkill(skill)}
              >
                {skill} <span>{selectedSkills.includes(skill) ? '×' : '+'}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            I need teammates who know… <small>Pick 2–4</small>
          </legend>
          <div className="choice-grid">
            {allSkills.slice(0, 9).map(skill => (
              <button 
                key={skill}
                type="button" 
                className={lookingFor.includes(skill) ? 'selected' : ''}
                onClick={() => toggleLookingFor(skill)}
              >
                {skill} <span>{lookingFor.includes(skill) ? '×' : '+'}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="field-row">
          <label>
            <span>Your hackathon animal</span>
            <select defaultValue="Raccoon">
              <option>Raccoon</option>
              <option>Owl</option>
              <option>Black cat</option>
              <option>Golden retriever</option>
            </select>
          </label>
          <label>
            <span>At 2:47 AM, when it breaks…</span>
            <input type="text" defaultValue="I open the logs and pretend not to panic" />
          </label>
        </div>

        <div className="form-footer">
          <p>
            <b>Team eligibility:</b> Review all hackathon rules before final submission.
          </p>
          <button className="primary-action" type="submit">
            FIND MY PEOPLE <span>→</span>
          </button>
        </div>
      </form>
    </section>
  )
}
