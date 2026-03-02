import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <Router>
        {/* Mevcut rotaların ve bileşenlerin */}
        <Navbar />
        <Routes> ... </Routes>
        <Footer />
      </Router>

      {/* Performans ve Analiz araçlarını buraya ekle */}
      <SpeedInsights />
      <Analytics />
    </>
  )
}