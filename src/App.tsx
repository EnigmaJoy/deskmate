import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import type { Page } from './types'

function App() {
    const [page, setPage] = useState<Page>('dashboard')

    return (
        <div className="w-screen h-screen bg-gray-950 overflow-hidden flex items-center justify-center">
            {page === 'dashboard'
                ? <Dashboard navigate={setPage} />
                : <Settings navigate={setPage} />
            }
        </div>
    )
}

export default App
