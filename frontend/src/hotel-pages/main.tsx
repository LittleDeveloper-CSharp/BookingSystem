import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import type { HotelCartDto } from './models/hotelCartDto';
import HotelCart from './cart';
import { useCallback, useEffect, useState } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import HotelFiltersContainer from './filters';
import { useRoleCheck } from '../hooks/useRoleCheck';
import { DetailsHotelModal } from './details';
import type { HotelDetailsDto } from './models/hotelDetailsDto';
import { RoomsModal } from '../rooms-pages/main';
import { useHotelClient } from '../clients/useHttpClient';
import type { HotelFilters } from './models/hotelFilters';

const DEFAULT_FILTERS: HotelFilters = {
    sortOrder: 'asc',
    sortBy: 'name'
};

function HotelGrid() {
    const [showRoomsModal, setShowRoomsModal] = useState<boolean>(false);
    const [hotelId, setHotelId] = useState<number>(0);
    const [hotelName, setHotelName] = useState<string>('');
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const { isAdmin } = useRoleCheck();
    const [hotels, setHotels] = useState<HotelCartDto[]>([]);
    const [filters, setFilters] = useState<HotelFilters>(DEFAULT_FILTERS);
    const httpClient = useHotelClient()!;

    const [showCreateModal, setShowDetailsModal] = useState(false);

    const onDetailsClick = (
        id: number,
        name: string) => {
        setHotelId(id);
        setHotelName(name);
        setShowRoomsModal(true);
    }

    const fetchHotels = useCallback(async () => {
        try {
            const data = await httpClient.getHotelCarts(filters);
            setHotels(data);

        } catch (err) {
            console.error('Ошибка при загрузке отелей:', err);
        }
    }, [httpClient, filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchHotels();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchHotels]);

    const handleFiltersChange = (newFilters: HotelFilters) => {
        setFilters({ ...newFilters });
    };

    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const handleSubmitHotel = async (
        id: number | null | undefined,
        model: HotelDetailsDto,
        isEditMode: boolean) => {

        setEditMode(false);

        if (isEditMode && id !== null && id !== undefined)
            await httpClient.updateHotel(id, model);
        else
            await httpClient.createHotel(model);

        await fetchHotels();
    };

    const onEditClick = (id: number) => {
        setEditMode(true);
        setHotelId(id);
        setShowDetailsModal(true);
    };

    const onDeleteClick = async (id: number) => {
        await httpClient.deleteHotel(id);

        await fetchHotels();
    };

    const onReportClick = async () => {
        await httpClient.getReport(filters);
    }

    return (
        <Container className="my-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Отели</h1>

                {isAdmin && (
                    <Button
                        variant="info"
                        onClick={onReportClick}
                    >
                        Выгрузить в excel
                    </Button>
                )}

                {isAdmin && (
                    <Button
                        variant="success"
                        onClick={() => {
                            setEditMode(false);
                            return setShowDetailsModal(true);
                        }}
                    >
                        + Добавить отель
                    </Button>
                )}
            </div>

            <h1 className="mb-4">Доступные отели</h1>

            <HotelFiltersContainer
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
            />

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
                                    key={idx}
                                    isAdmin={isAdmin}
                                    model={model}
                                    onDetailsClick={onDetailsClick}
                                    onDeleteClick={onDeleteClick}
                                    onEditClick={onEditClick} />
                            </Col>
                        ))}
                    </Row>
                )}

            <DetailsHotelModal
                show={showCreateModal}
                onHide={() => setShowDetailsModal(false)}
                onSubmit={handleSubmitHotel}
                httpClient={httpClient}
                isEditMode={isEditMode}
                id={hotelId}
            />
            <RoomsModal
                hotelId={hotelId}
                hotelName={hotelName}
                show={showRoomsModal}
                onHide={() => setShowRoomsModal(false)}
                onUpdate={fetchHotels}
            />
        </Container>
    );
}

export default HotelGrid;