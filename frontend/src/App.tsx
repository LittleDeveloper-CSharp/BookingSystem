import './App.css'
import HotelGrid from './hotel-pages/main'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './header-partials/header';
import { AuthProvider } from './context/authContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Route, Routes } from 'react-router-dom';
import MyBookingsPage from './booking-pages/main';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="app-container">

                <AuthProvider>
                    <header className="app-header">
                        <Header />
                    </header>

                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<HotelGrid />} />
                            <Route path="/hotels" element={<HotelGrid />} />

                            <Route path="/my-bookings" element={
                                <MyBookingsPage />
                            } />
                        </Routes>
                    </main>
                </AuthProvider>
            </div>
        </Router>

    )
}

export default App;