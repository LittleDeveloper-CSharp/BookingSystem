import { Modal, Button, Form, Alert, Spinner, Row, Col, Badge, Table } from 'react-bootstrap';
import { useState, useCallback, useEffect } from 'react';
import { useRoleCheck } from '../hooks/useRoleCheck';
import type { RoomCartDto } from './models/roomCartDto';
import type { RoomFilters } from './models/roomFilters';
import type { RoomDetailsDto } from './models/roomDetailsDto';
import type { UpdateRoomDto } from './models/updateRoomDto';
import { useBookingClient, useRoomClient } from '../clients/useHttpClient';
import RoomFiltersContainer from './flters';

interface RoomsModalProps {
    hotelName: string;
    hotelId: number;
    show: boolean;
    onHide: () => void;
}

const DEFAULT_FILTERS: RoomFilters = {
    sortOrder: 'asc',
    sortBy: 'name'
};

const DEFAULT_ROOM_DETAILS: RoomDetailsDto = {
    name: '',
    description: '',
    maxPerson: 1,
}

export const RoomsModal: React.FC<RoomsModalProps> = ({
    hotelName,
    hotelId,
    show,
    onHide,
}) => {
    const { isAdmin, isClient } = useRoleCheck();
    const [rooms, setRooms] = useState<RoomCartDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [roomFormData, setRoomFormData] = useState<RoomDetailsDto>(DEFAULT_ROOM_DETAILS);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>();

    const httpClient = useRoomClient()!;
    const bookingHttpClient = useBookingClient()!;

    const [filters, setFilters] = useState<RoomFilters>(DEFAULT_FILTERS);

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await httpClient.getRoomCarts(hotelId, filters);
            setRooms(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки комнат');
        } finally {
            setLoading(false);
        }
    }, [httpClient, filters, hotelId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRooms();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchRooms]);


    const handleFiltersChange = (newFilters: RoomFilters) => {
        setFilters({ ...newFilters });
    };

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const handleCreateRoom = () => {
        setShowRoomModal(true);
    };

    const handleEditRoom = async (room: RoomCartDto) => {
        setSelectedRoomId(room.id);
        setEditMode(true);
        setRoomFormData({
            name: room.name,
            description: room.description || '',
            maxPerson: room.maxPerson,
        });
        setShowRoomModal(true);
    };

    const handleSaveRoom = async () => {
        try {
            if (!isEditMode) {
                await httpClient.createRoom(hotelId, roomFormData);
            } else if (selectedRoomId !== null && selectedRoomId !== undefined) {
                const updateData: UpdateRoomDto = {
                    ...roomFormData,
                };
                await httpClient.updateRoom(selectedRoomId, updateData);
            }

            setShowRoomModal(false);
            setRoomFormData(DEFAULT_ROOM_DETAILS);
            await fetchRooms();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка сохранения');
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        try {
            await httpClient.deleteRoom(roomId);
            await fetchRooms();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка удаления');
        }
    };


    const handleExportReport = async () => {
        try {
            await httpClient.getReport(filters);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка выгрузки');
        }
    };

    const bookingRoom = async (room: RoomCartDto) => {
        const dateTime = new Date();

        await bookingHttpClient.createBooking(room.id, {
            startDate: dateTime,
            endDate: dateTime
        });
    }

    return (
        <>
            <Modal
                show={show}
                onHide={() => {
                    setRooms([]);
                    return onHide();
                }}
                centered
                size="xl"
                scrollable
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Комнаты отеля: {hotelName}
                        <Badge bg="info" className="ms-2">
                            {rooms.length} комнат
                        </Badge>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="me-2"
                            >
                                <i className="bi bi-funnel me-1"></i>
                                Фильтры {showFilters ? '▲' : '▼'}
                            </Button>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleExportReport}
                                disabled={loading}
                            >
                                <i className="bi bi-file-earmark-excel me-1"></i>
                                Excel
                            </Button>
                        </div>

                        <div>
                            {isAdmin && (
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={handleCreateRoom}
                                >
                                    <i className="bi bi-plus-circle me-1"></i>
                                    Добавить комнату
                                </Button>
                            )}
                        </div>
                    </div>

                    {showFilters &&
                        <RoomFiltersContainer
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onReset={resetFilters}
                        />}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" />
                            <p className="mt-2">Загрузка комнат...</p>
                        </div>
                    ) : rooms.length === 0 ? (
                        <Alert variant="info">
                            Комнат не найдено
                        </Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th>Гостей</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map(room => (
                                        <tr key={room.id}>
                                            <td>
                                                <strong>{room.name}</strong>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {room.description || '—'}
                                                </small>
                                            </td>
                                            <td>
                                                <Badge bg="secondary">
                                                    {room.maxPerson} чел.
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    {isClient &&
                                                        (<Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            title="Забронировать"
                                                            onClick={() => bookingRoom(room)}
                                                        >
                                                            <i className="bi bi-calendar-check"></i>
                                                        </Button>
                                                        )}
                                                    {isAdmin && (
                                                        <>
                                                            <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                onClick={() => handleEditRoom(room)}
                                                                title="Редактировать"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </Button>

                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteRoom(room.id)}
                                                                title="Удалить"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRoomModal} onHide={() => {
                setRoomFormData(DEFAULT_ROOM_DETAILS);
                return setShowRoomModal(false);
            }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {!isEditMode ? 'Добавить комнату' : 'Редактировать комнату'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название комнаты *</Form.Label>
                            <Form.Control
                                type="text"
                                value={roomFormData.name}
                                onChange={(e) => setRoomFormData({
                                    ...roomFormData,
                                    name: e.target.value
                                })}
                                placeholder="Например: Люкс с видом на море"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={roomFormData.description}
                                onChange={(e) => setRoomFormData({
                                    ...roomFormData,
                                    description: e.target.value
                                })}
                                placeholder="Описание комнаты..."
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Макс. гостей *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={roomFormData.maxPerson}
                                        onChange={(e) => setRoomFormData({
                                            ...roomFormData,
                                            maxPerson: parseInt(e.target.value) || 1
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRoomModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSaveRoom}>
                        {!isEditMode ? 'Создать' : 'Сохранить'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};