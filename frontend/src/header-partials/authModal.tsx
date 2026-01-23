import React, { useState } from 'react';
import { Modal, Button, Form, Tab, Tabs, Alert } from 'react-bootstrap';
import UserHttpClient from '../clients/userHttpClient';
import { useAuth } from '../context/authContext';

interface AuthModalProps {
    show: boolean;
    onHide: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ show, onHide }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [loginData, setLoginData] = useState({ email: 'admin@admin.com', password: 'Admin123' });
    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string>('');
    const [httpClient] = useState(() => new UserHttpClient({
        url: `${import.meta.env.VITE_API_URL}/api/users`,
    }));
    const { login } = useAuth();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (!loginData.email || !loginData.password) {
            setError('Пожалуйста заполните все поля');
            return;
        }

        try {
            console.log('Login attempt:', loginData);
            await login(loginData.email, loginData.password);

            onHide();
        } catch(err) {
            console.error(err);
            setError('Ошибка входа. Пожалуйста проверьте данные для входа.');
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (registerData.password !== registerData.confirmPassword) {
            setError('Пароль не совпадает.');
            return;
        }

        if (registerData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов.');
            return;
        }

        try {
            console.log('Register attempt:', registerData);

            await httpClient.register({
                login: registerData.email,
                password: registerData.password
            });

            setActiveTab('login');
            setLoginData({ email: registerData.email, password: '' });
        } catch (err) {
            console.error(err);
            setError('Ошибка регистрации. Попробуйте еще раз.');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Вход</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {error && (
                    <Alert variant="danger" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k as 'login' | 'register')}
                    className="mb-3"
                >
                    <Tab eventKey="login" title="Авторизация">
                        <Form onSubmit={handleLoginSubmit} className="mt-3">
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button variant="primary" type="submit">
                                    Вход
                                </Button>
                            </div>
                        </Form>
                    </Tab>

                    <Tab eventKey="register" title="Регистрация">
                        <Form onSubmit={handleRegisterSubmit} className="mt-3">

                            <Form.Group className="mb-3">
                                <Form.Label>Email адрес</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Минимум 6 символов"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Подтвердите пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button variant="success" type="submit">
                                    Зарегистрироваться
                                </Button>
                            </div>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;