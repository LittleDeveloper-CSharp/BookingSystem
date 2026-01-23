import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import type { HotelCartDto } from './models/hotelCartDto';
import HotelCart from './cart';
import { useCallback, useEffect, useState } from 'react';
import HotelHttpClient from '../clients/hotelHttpClient';
import { Container, Alert, Button } from 'react-bootstrap';
import type { HotelFilters } from '../clients/models/hotelFilters';
import HotelFiltersContainer from './filters';
import { useRoleCheck } from '../hooks/useRoleCheck';
import type { CreateHotelDto } from './models/createHotelDto';
import { CreateHotelModal } from './details';
import { useAuth } from '../context/authContext';

// Дефолтные значения фильтров
const DEFAULT_FILTERS: HotelFilters = {
    sortOrder: 'asc',
    sortBy: 'name'
};

function HotelGrid() {
    const { isAdmin } = useRoleCheck();
    const { user } = useAuth();
    const [hotels, setHotels] = useState<HotelCartDto[]>([]);
    const [filters, setFilters] = useState<HotelFilters>(DEFAULT_FILTERS);
    const [httpClient] = useState(() => new HotelHttpClient({
        url: `${import.meta.env.VITE_API_URL}/api`,
        jwtToken: user?.token || ''
    }));
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Функция загрузки отелей с текущими фильтрами
    const fetchHotels = useCallback(async () => {
        try {
            // Делаем запрос с фильтрами
            const data = await httpClient.getHotelCarts(filters);
            setHotels(data);

        } catch (err) {
            console.error('Ошибка при загрузке отелей:', err);
        }
    }, [httpClient, filters]);

    // Загружаем отели при изменении фильтров
    useEffect(() => {
        // Добавляем небольшую задержку для дебаунса при вводе текста
        const timer = setTimeout(() => {
            fetchHotels();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchHotels]);

    const handleFiltersChange = (newFilters: HotelFilters) => {
        setFilters({ ...newFilters });
    };

    // Сброс фильтров
    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const handleCreateHotel = async (hotelData: CreateHotelDto) => {
        await httpClient.createHotel(hotelData);
        await fetchHotels();
    };

    return (
        <Container className="my-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Отели</h1>

                {isAdmin && (
                    <Button
                        variant="success"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Добавить отель
                    </Button>
                )}
            </div>

            <h1 className="mb-4">Доступные отели</h1>

            {/* Компонент фильтров */}
            <HotelFiltersContainer
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
            />

            {/* Список отелей */}
            {hotels.length === 0 ? (
                <Alert variant="warning">
                    <Alert.Heading>Отелей не найдено</Alert.Heading>
                    <p>
                        Попробуйте изменить параметры фильтрации или
                        <Button
                            variant="link"
                            onClick={handleResetFilters}
                            className="p-0 ms-1"
                        >
                            сбросить фильтры
                        </Button>
                    </p>
                </Alert>
            )
                : (
                    <Row xs={1} md={2} className="g-4">
                        {hotels.map((model, idx) => (
                            <Col key={idx}>
                                <HotelCart
                                    key={idx} id={model.id}
                                    name={model.name}
                                    countAvailableRooms={model.countAvailableRooms} />
                            </Col>
                        ))}
                    </Row>
                )}

            <CreateHotelModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCreate={handleCreateHotel}
            />
        </Container>
    );
}

export default HotelGrid;