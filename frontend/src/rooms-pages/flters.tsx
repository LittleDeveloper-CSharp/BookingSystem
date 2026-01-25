import Card from "react-bootstrap/esm/Card";
import type { RoomFilters } from "./models/roomFilters"
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Form, Button } from "react-bootstrap";

export interface RoomFiltersProps {
    filters: RoomFilters,
    onFiltersChange: (filters: RoomFilters) => void;
    onReset: () => void;
}

function RoomFiltersContainer(
    { filters,
        onFiltersChange,
        onReset }: RoomFiltersProps
) {
    const handleMinRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : Number(e.target.value);
        onFiltersChange({ ...filters, minPerson: value });
    };

    const handleMaxRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : Number(e.target.value);
        onFiltersChange({ ...filters, maxPerson: value });
    };

    const handleReset = () => {
        onReset();
    };

    return (
        <Card className="mb-4" >
            <Card.Body>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Гостей от </Form.Label>
                            < Form.Control
                                type="number"
                                value={filters.minPerson || ''}
                                onChange={handleMinRoomsChange}
                                min="1"
                            />
                        </Form.Group>
                    </Col>

                    < Col md={4} >
                        <Form.Group>
                            <Form.Label>Гостей до </Form.Label>
                            < Form.Control
                                type="number"
                                value={filters.maxPerson || ''}
                                onChange={handleMaxRoomsChange}
                                min="1"
                            />
                        </Form.Group>
                    </Col>

                    < Col md={12} className="mt-3" >
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleReset}
                        >
                            Сбросить фильтры
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default RoomFiltersContainer;