/* eslint-disable no-debugger */
import type { BookingCartDto } from "../booking-pages/models/bookingCartDto";
import type { CreateBookingDto } from "../booking-pages/models/createBookingDto";
import type { HttpClientOptions } from "./models/httpClientOptions";

export default class BookingHttpClient {
    _headers: HeadersInit;
    _url: string;
    _resourceName: string;

    constructor({ url, jwtToken }: HttpClientOptions) {
        this._headers = {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": 'application/json'
        };
        this._url = url;
        this._resourceName = "/bookings"
    }

    async getBookingCarts(): Promise<BookingCartDto[]> {
        try {
            const response = await fetch(`${this._url}${this._resourceName}`, {
                method: 'GET',
                headers: this._headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: BookingCartDto[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching bookings carts:', error);
            throw error;
        }
    }

    async createBooking(roomId: number, model: CreateBookingDto): Promise<number> {
        try {
            const response = await fetch(`${this._url}/rooms/${roomId}${this._resourceName}`, {
                method: 'POST',
                headers: this._headers,
                body: JSON.stringify(model),
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    }

    async deleteRoom(id: number) {
        try {
            const response = await fetch(`${this._url}${this._resourceName}/${id}`, {
                method: 'DELETE',
                headers: this._headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    }
}