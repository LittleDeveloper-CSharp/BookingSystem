import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import type HotelHttpClient from '../clients/hotelHttpClient';
import type { HotelDetailsDto } from './models/hotelDetailsDto';

interface DetailsHotelModalProps {
    id?: null | number | undefined;
    isEditMode: boolean;
    show: boolean;
    onHide: () => void;
    onSubmit: (id: number | null | undefined,
        model: HotelDetailsDto,
        isEditMode: boolean) => Promise<void>;
    httpClient: HotelHttpClient;
}

export const DetailsHotelModal: React.FC<DetailsHotelModalProps> = ({
    id,
    isEditMode,
    show,
    onHide,
    onSubmit,
    httpClient
}) => {
    const [formData, setFormData] = useState<HotelDetailsDto>({
        name: '',
        address: '',
        city: ''
    });

    const fetchHotel = useCallback(async () => {
        try {
            if (isEditMode && id !== null) {
                const hotelData = await httpClient.getHotelDetails(id as number);

                setFormData(hotelData);
            }
        } catch (err) {
            console.error('Ошибка при загрузке отелей:', err);
        }
    }, [httpClient, id, isEditMode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchHotel();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchHotel]);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

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
            await onSubmit(id, formData, isEditMode);
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
                    <Modal.Title>
                        {isEditMode ? 'Обновить отель'
                            : 'Добавить новый отель'
                        }
                    </Modal.Title>
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
                                {isEditMode ? 'Обновление' : 'Создание'}...
                            </>
                        ) : isEditMode ? 'Обновить отель' : 'Создать отель'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};