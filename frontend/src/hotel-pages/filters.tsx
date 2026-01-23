import React from 'react';
import { Form, InputGroup, Button, Row, Col, Card } from 'react-bootstrap';
import type { HotelFiltersProps } from '../clients/models/hotelFiltersProps';

function HotelFiltersContainer(
    { filters,
        onFiltersChange,
        onReset }: HotelFiltersProps,
) {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, name: e.target.value });
    };

    const handleMinRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : Number(e.target.value);
        onFiltersChange({ ...filters, minPerson: value });
    };

    const handleMaxRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : Number(e.target.value);
        onFiltersChange({ ...filters, maxPerson: value });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({ ...filters, sortBy: e.target.value as 'name' | 'rooms' });
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' });
    };

    const handleReset = () => {
        onReset();
    };

    return (
        <Card className="mb-4" >
            <Card.Header>
                <Card.Title>Фильтры и сортировка </Card.Title>
            </Card.Header>
            < Card.Body >
                <Row className="g-3" >
                    {/* Фильтр по названию */}
                    < Col md={12} lg={4} >
                        <Form.Group>
                            <Form.Label>Название отеля </Form.Label>
                            < InputGroup >
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск по названию..."
                                    value={filters.name || ''}
                                    onChange={handleNameChange}
                                />
                                {
                                    filters.name && (
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => onFiltersChange({ ...filters, name: undefined })
                                            } >
                                            ×
                                        </Button>
                                    )
                                }
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    {/* Фильтр по количеству гостей */}
                    <Col md={6} lg={3} >
                        <Form.Group>
                            <Form.Label>Кол - во гостей от </Form.Label>
                            < Form.Control
                                type="number"
                                placeholder="Минимум"
                                value={filters.minPerson || ''}
                                onChange={handleMinRoomsChange}
                                min="0"
                            />
                        </Form.Group>
                    </Col>

                    < Col md={6} lg={3} >
                        <Form.Group>
                            <Form.Label>Кол - во гостей до </Form.Label>
                            < Form.Control
                                type="number"
                                placeholder="Максимум"
                                value={filters.maxPerson || ''}
                                onChange={handleMaxRoomsChange}
                                min="0"
                            />
                        </Form.Group>
                    </Col>

                    {/* Сортировка */}
                    <Col md={6} lg={6} >
                        <Form.Group>
                            <Form.Label>Сортировать по </Form.Label>
                            < Form.Select
                                value={filters.sortBy || ''}
                                onChange={handleSortChange}
                            >
                                <option value="" > Без сортировки </option>
                                < option value="name" > Названию </option>
                                < option value="rooms" > Количеству гостей </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    < Col md={6} lg={6} >
                        <Form.Group>
                            <Form.Label>Порядок сортировки </Form.Label>
                            < Form.Select
                                value={filters.sortOrder || 'asc'}
                                onChange={handleSortOrderChange}
                            >
                                <option value="asc" > По возрастанию </option>
                                < option value="desc" > По убыванию </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Кнопки действий */}
                <Row className="mt-3" >
                    <Col className="d-flex justify-content-end" >
                        <Button
                            variant="outline-danger"
                            onClick={handleReset}
                            className="me-2"
                        >
                            Сбросить фильтры
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );


};

export default HotelFiltersContainer;