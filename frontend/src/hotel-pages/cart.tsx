import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import type { HotelCartDto } from '../models/hotelCartDto';

function HotelCart(
    { name, countAvailableRooms }: HotelCartDto, 
) {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    Количество свободных комнат: {countAvailableRooms}
                </Card.Text>
                <Button variant="primary">Детальная информация</Button>
            </Card.Body>
        </Card>
    );
}

export default HotelCart;