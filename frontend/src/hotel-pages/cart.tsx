import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import type { HotelCartDto } from './models/hotelCartDto';

interface HotelCartProps {
    model: HotelCartDto;
    onDetailsClick:(id: number, hotelName: string) => void;
    onEditClick: (id: number) => void;
    onDeleteClick: (id: number) => Promise<void>;
    isAdmin: boolean;
}

const HotelCart : React.FC<HotelCartProps>  =(
    {
        onDetailsClick,
        onDeleteClick,
        onEditClick,
        isAdmin,
        model,
    }) => {

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{model.name}</Card.Title>
                <Card.Text>
                    Количество свободных комнат: {model.countAvailableRooms}
                </Card.Text>
                <div className="d-flex flex-column gap-2">
                    <Button
                        variant="primary"
                        onClick={() => onDetailsClick(model.id, model.name)}
                        className="w-100"
                    >
                        Детальная информация
                    </Button>

                    {isAdmin && (
                        <Button
                            variant="warning"
                            onClick={() => onEditClick(model.id)}
                            className="w-100"
                        >
                            Редактировать
                        </Button>
                    )}
                    {isAdmin && (
                        <Button
                            variant="danger"
                            disabled={model.isActive}
                            onClick={() => onDeleteClick(model.id)}
                            className="w-100"
                        >
                            Удалить
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}

export default HotelCart;