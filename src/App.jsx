import { useState } from 'react'
import TopBar from './components/TopBar'
import Toast from './components/Toast'
import HomePage from './views/HomePage'
import SetupForm from './views/SetupForm'
import DiscoverView from './views/DiscoverView'

function App() {
  const [currentView, setCurrentView] = useState('welcome')
  const [toastMessage, setToastMessage] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  const navigateTo = (view) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <main className="app-shell">
      <TopBar currentView={currentView} navigateTo={navigateTo} selectedAvatar={selectedAvatar} />

      {currentView === 'welcome' && <HomePage onStart={() => navigateTo('setup')} />}

      {currentView === 'setup' && (
        <SetupForm
          selectedAvatar={selectedAvatar}
          onAvatarChange={setSelectedAvatar}
          onComplete={() => navigateTo('discover')}
          onBack={() => navigateTo('welcome')}
        />
      )}

      {currentView === 'discover' && (
        <DiscoverView
          onExit={() => navigateTo('welcome')}
          showToast={showToast}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </main>
  )
}

export default App
