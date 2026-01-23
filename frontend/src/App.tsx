import './App.css'
import HotelGrid from './hotel-pages/main'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './header-partials/header';
import { AuthProvider } from './context/authContext';

function App() {
    return (
        <div className="app-container">
            <AuthProvider>
                <header className="app-header">
                    <Header />
                </header>

                <main className="main-content">
                    <HotelGrid />
                </main>
            </AuthProvider>
        </div>
    )
}

export default App;