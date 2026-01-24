import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Card,
    Table,
    Button,
    Alert,
    Spinner,
    Row,
    Col,
} from 'react-bootstrap';
import type { BookingCartDto } from './models/bookingCartDto';
import { useBookingClient } from '../clients/useHttpClient';
import { format } from 'date-fns';

const MyBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingCartDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const httpClient = useBookingClient();

    const fetchBookings = useCallback(async () => {
        if (!httpClient) return;

        setLoading(true);
        setError('');

        try {
            const data = await httpClient.getBookingCarts();
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки бронирований');
        } finally {
            setLoading(false);
        }
    }, [httpClient]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    if (loading && bookings.length === 0) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-3">Загрузка бронирований...</p>
            </Container>
        );
    }

    const formatDate = (dateString: Date) => {
        try {
            return format(dateString, 'dd.MM.yyyy');
        } catch {
            return dateString.toString();
        }
    };

    const handleCancelClick = async (booking: BookingCartDto) => {
        await httpClient?.deleteRoom(booking.id);
        await fetchBookings();
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4">Мои бронирования</h1>

            {/* Статистика */}
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <div className="text-center">
                                <h5>{bookings.length}</h5>
                                <small className="text-muted">Всего броней</small>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="text-center">
                                <h5 className="text-primary">
                                    {bookings.length}
                                </h5>
                                <small className="text-muted">Активные</small>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {bookings.length === 0 ? (
                <Alert variant="info">
                    <Alert.Heading>Бронирований не найдено</Alert.Heading>
                    <p>
                        У вас пока нет бронирований. Начните с поиска отелей на главной странице.
                    </p>
                </Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Отель / Комната</th>
                                <th>Даты</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>
                                        <div>
                                            <strong>{booking.hotelName}</strong>
                                            <div className="text-muted small">
                                                {booking.roomName}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div>Заезд: {formatDate(booking.startDate)}</div>
                                            <div>Выезд: {formatDate(booking.endDate)}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleCancelClick(booking)}
                                                title="Отменить бронирование"
                                            >
                                                <i className="bi bi-x-circle"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default MyBookingsPage;