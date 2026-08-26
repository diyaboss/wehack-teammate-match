import React, { useState } from 'react'
import { allSkills } from '../data/profiles'
import AvatarPicker from '../components/AvatarPicker'

const PREDEFINED_SKILLS = allSkills.slice(0, 9)

export default function SetupForm({
  onComplete,
  onBack,
  selectedAvatar,
  onAvatarChange,
  initialSelectedSkills,
  initialLookingFor
}) {
  const [selectedSkills, setSelectedSkills] = useState(initialSelectedSkills || ['AI / ML', 'Cybersecurity'])
  const [lookingFor, setLookingFor] = useState(initialLookingFor || ['React', 'UI / UX'])

  const [showOtherSkill, setShowOtherSkill] = useState(false)
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [skillError, setSkillError] = useState('')

  const [showOtherLookingFor, setShowOtherLookingFor] = useState(false)
  const [customLookingForInput, setCustomLookingForInput] = useState('')
  const [lookingForError, setLookingForError] = useState('')

  const toggleSkill = (skill) => {
    setSkillError('')
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill))
    } else {
      if (selectedSkills.length >= 4) {
        setSkillError('You can select a maximum of 4 skills.')
        return
      }
      setSelectedSkills(prev => [...prev, skill])
    }
  }

  const handleAddCustomSkill = () => {
    setSkillError('')
    const trimmed = customSkillInput.trim()
    if (!trimmed) return
    if (selectedSkills.includes(trimmed)) {
      setCustomSkillInput('')
      setShowOtherSkill(false)
      return
    }
    if (selectedSkills.length >= 4) {
      setSkillError('You can select a maximum of 4 skills.')
      return
    }
    setSelectedSkills(prev => [...prev, trimmed])
    setCustomSkillInput('')
    setShowOtherSkill(false)
  }

  const toggleLookingFor = (skill) => {
    setLookingForError('')
    if (lookingFor.includes(skill)) {
      setLookingFor(prev => prev.filter(s => s !== skill))
    } else {
      if (lookingFor.length >= 4) {
        setLookingForError('You can select a maximum of 4 skills.')
        return
      }
      setLookingFor(prev => [...prev, skill])
    }
  }

  const handleAddCustomLookingFor = () => {
    setLookingForError('')
    const trimmed = customLookingForInput.trim()
    if (!trimmed) return
    if (lookingFor.includes(trimmed)) {
      setCustomLookingForInput('')
      setShowOtherLookingFor(false)
      return
    }
    if (lookingFor.length >= 4) {
      setLookingForError('You can select a maximum of 4 skills.')
      return
    }
    setLookingFor(prev => [...prev, trimmed])
    setCustomLookingForInput('')
    setShowOtherLookingFor(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedSkills.length < 2) {
      setSkillError('Please select at least 2 skills.')
      return
    }
    if (lookingFor.length < 2) {
      setLookingForError('Please select at least 2 skills.')
      return
    }
    if (selectedSkills.length > 4) {
      setSkillError('Maximum 4 skills allowed.')
      return
    }
    if (lookingFor.length > 4) {
      setLookingForError('Maximum 4 skills allowed.')
      return
    }
    if (onComplete) {
      onComplete({
        selectedSkills,
        lookingFor
      })
    }
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

        <AvatarPicker selected={selectedAvatar} onSelect={onAvatarChange} />

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
          {skillError && <p className="field-error-msg">{skillError}</p>}
          <div className="choice-grid">
            {PREDEFINED_SKILLS.map(skill => (
              <button 
                key={skill}
                type="button"
                className={selectedSkills.includes(skill) ? 'selected' : ''}
                onClick={() => toggleSkill(skill)}
              >
                {skill} <span>{selectedSkills.includes(skill) ? '×' : '+'}</span>
              </button>
            ))}
            {selectedSkills.filter(s => !PREDEFINED_SKILLS.includes(s)).map(skill => (
              <button 
                key={skill}
                type="button" 
                className="selected"
                onClick={() => toggleSkill(skill)}
              >
                {skill} <span>×</span>
              </button>
            ))}
            <button
              type="button"
              className={showOtherSkill ? 'selected' : ''}
              onClick={() => {
                setSkillError('')
                if (!showOtherSkill && selectedSkills.length >= 4) {
                  setSkillError('You can select a maximum of 4 skills.')
                  return
                }
                setShowOtherSkill(!showOtherSkill)
              }}
            >
              Other <span>{showOtherSkill ? '×' : '+'}</span>
            </button>
          </div>
          {showOtherSkill && (
            <div className="custom-skill-input-wrap">
              <input 
                type="text" 
                className="custom-skill-input"
                placeholder="Type custom skill (e.g., Python)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomSkill()
                  }
                }}
                autoFocus
              />
              <button 
                type="button" 
                className="add-custom-btn"
                onClick={handleAddCustomSkill}
              >
                ADD
              </button>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>
            I need teammates who know… <small>Pick 2–4</small>
          </legend>
          {lookingForError && <p className="field-error-msg">{lookingForError}</p>}
          <div className="choice-grid">
            {PREDEFINED_SKILLS.map(skill => (
              <button 
                key={skill}
                type="button"
                className={lookingFor.includes(skill) ? 'selected' : ''}
                onClick={() => toggleLookingFor(skill)}
              >
                {skill} <span>{lookingFor.includes(skill) ? '×' : '+'}</span>
              </button>
            ))}
            {lookingFor.filter(s => !PREDEFINED_SKILLS.includes(s)).map(skill => (
              <button 
                key={skill}
                type="button" 
                className="selected"
                onClick={() => toggleLookingFor(skill)}
              >
                {skill} <span>×</span>
              </button>
            ))}
            <button
              type="button"
              className={showOtherLookingFor ? 'selected' : ''}
              onClick={() => {
                setLookingForError('')
                if (!showOtherLookingFor && lookingFor.length >= 4) {
                  setLookingForError('You can select a maximum of 4 skills.')
                  return
                }
                setShowOtherLookingFor(!showOtherLookingFor)
              }}
            >
              Other <span>{showOtherLookingFor ? '×' : '+'}</span>
            </button>
          </div>
          {showOtherLookingFor && (
            <div className="custom-skill-input-wrap">
              <input 
                type="text" 
                className="custom-skill-input"
                placeholder="Type custom skill (e.g., Blockchain)..."
                value={customLookingForInput}
                onChange={(e) => setCustomLookingForInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomLookingFor()
                  }
                }}
                autoFocus
              />
              <button 
                type="button" 
                className="add-custom-btn"
                onClick={handleAddCustomLookingFor}
              >
                ADD
              </button>
            </div>
          )}
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


