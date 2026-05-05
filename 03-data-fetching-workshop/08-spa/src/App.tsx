import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Demo } from './routes/Demo'
import { Home } from './routes/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
