import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight, PersonFill } from 'react-bootstrap-icons';
import AuthModal from './authModal';
import { useAuth } from '../context/authContext';
import { useRoleCheck } from '../hooks/useRoleCheck';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const { isClient } = useRoleCheck();

    const handleLogin = () => {
        setShowAuthModal(true);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand href="/" className="fw-bold">
                        <span className="text-warning">🏨</span> Booking System
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Главная</Nav.Link>
                            {isClient &&
                                <Nav.Link as={Link} to="/my-bookings">Мои бронирования</Nav.Link>
                            }
                        </Nav>

                        <Nav className="align-items-center">
                            {isAuthenticated ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle
                                        variant="outline-light"
                                        id="dropdown-user"
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <PersonFill size={20} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={handleLogout}
                                            className="text-danger"
                                        >
                                            <BoxArrowRight className="me-2" />
                                            Выход
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <>
                                    <Button
                                        variant="outline-light"
                                        className="me-2"
                                        onClick={handleLogin}
                                    >
                                        <PersonCircle className="me-1" />
                                        Вход
                                    </Button>

                                    <Button
                                        variant="warning"
                                        onClick={handleLogin}
                                    >
                                        Зарегистрироваться
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <AuthModal
                show={showAuthModal}
                onHide={() => setShowAuthModal(false)}
            />
        </>
    );
};

export default Header;