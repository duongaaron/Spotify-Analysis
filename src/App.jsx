import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Analysis from './pages/Analysis'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  )
}

export default App