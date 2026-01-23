// components/CreateHotelModal.tsx
import { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import type { CreateHotelDto } from './models/createHotelDto';

interface CreateHotelModalProps {
    show: boolean;
    onHide: () => void;
    onCreate: (hotelData: CreateHotelDto) => Promise<void>;
}

export const CreateHotelModal: React.FC<CreateHotelModalProps> = ({
    show,
    onHide,
    onCreate
}) => {
    const [formData, setFormData] = useState<CreateHotelDto>({
        name: '',
        address: '',
        city: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Сбрасываем ошибку при изменении
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Простая валидация
        if (!formData.name.trim()) {
            setError('Название обязательно');
            return;
        }
        if (!formData.address.trim()) {
            setError('Адрес обязателен');
            return;
        }
        if (!formData.city.trim()) {
            setError('Город обязателен');
            return;
        }

        setIsLoading(true);
        try {
            await onCreate(formData);
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка создания отеля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', address: '', city: '' });
        setError('');
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить новый отель</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Название отеля *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Введите название отеля"
                            required
                            disabled={isLoading}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Адрес *</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Введите полный адрес"
                            required
                            disabled={isLoading}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Город *</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Введите город"
                            required
                            disabled={isLoading}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                Создание...
                            </>
                        ) : 'Создать отель'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};