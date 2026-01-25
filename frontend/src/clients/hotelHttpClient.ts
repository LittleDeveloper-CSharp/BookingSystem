import type { HttpClientOptions } from "./models/httpClientOptions";
import { downloadFile } from "../modules/report-saver";
import type { CreateHotelDto } from "../hotel-pages/models/createHotelDto";
import type { HotelCartDto } from "../hotel-pages/models/hotelCartDto";
import type { HotelDetailsDto } from "../hotel-pages/models/hotelDetailsDto";
import type { UpdateHotelDto } from "../hotel-pages/models/updateHotelDto";
import type { HotelFilters } from "../hotel-pages/models/hotelFilters";

export default class HotelHttpClient {
    _headers: HeadersInit;
    _url: string;
    _resourceName: string;

    constructor({ url, jwtToken }: HttpClientOptions) {
        this._headers = {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": 'application/json'
        };
        this._url = url;
        this._resourceName = "/hotels";
    }

    async getHotelCarts(filters: HotelFilters): Promise<HotelCartDto[]> {
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const queryString = queryParams.toString();
            const response = await fetch(`${this._url}${this._resourceName}${queryString ? `?${queryString}` : ''}`, {
                method: 'GET',
                headers: this._headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: HotelCartDto[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching hotel carts:', error);
            throw error;
        }
    }

    async getHotelDetails(id: number): Promise<HotelDetailsDto> {
        try {
            const response = await fetch(`${this._url}${this._resourceName}/${id}`, {
                method: 'GET',
                headers: this._headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: HotelDetailsDto = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching hotel details:', error);
            throw error;
        }
    }

    async createHotel(model: CreateHotelDto) : Promise<number> {
        try {      
            const response = await fetch(`${this._url}${this._resourceName}`, {
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
        } catch (error){
            console.error('Error creating hotel:', error);
            throw error;
        }
    }

    async updateHotel(id: number, model: UpdateHotelDto) {
        try {
            const response = await fetch(`${this._url}${this._resourceName}/${id}`, {
                method: 'PUT',
                headers: this._headers,
                body: JSON.stringify(model)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating hotel:', error);
            throw error;
        }
    }

    async deleteHotel(id: number) {
        try {
            const response = await fetch(`${this._url}${this._resourceName}/${id}`, {
                method: 'DELETE',
                headers: this._headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting hotel:', error);
            throw error;
        }
    }

    async getReport(filters: HotelFilters) {
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const queryString = queryParams.toString();

            await downloadFile(`${this._url}${this._resourceName}/report${queryString ? `?${queryString}` : ''}`, this._headers);
        } catch (error) {
            console.error('Error fetching hotel report:', error);
            throw error;
        }
    }
}