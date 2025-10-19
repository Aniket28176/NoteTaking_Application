import { Route, Routes } from "react-router-dom"
import HomePage from './pages/Homepage'
import CreatePage from './pages/createPage'
import NoteDetailPage from './pages/NoteDetailPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="/note/:id" element={<NoteDetailPage/>}/>
         <Route path="/edit-note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  )
}

export default App