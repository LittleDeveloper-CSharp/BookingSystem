import { downloadFile } from "../modules/report-saver";
import type { CreateRoomDto } from "../rooms-pages/models/createRoomDto";
import type { RoomCartDto } from "../rooms-pages/models/roomCartDto";
import type { RoomDetailsDto } from "../rooms-pages/models/roomDetailsDto";
import type { RoomFilters } from "../rooms-pages/models/roomFilters";
import type { UpdateRoomDto } from "../rooms-pages/models/updateRoomDto";
import type { HttpClientOptions } from "./models/httpClientOptions";

export default class RoomHttpClient {
    _headers: HeadersInit;
    _url: string;
    _resourceName: string;

    constructor({ url, jwtToken }: HttpClientOptions) {
        this._headers = {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": 'application/json'
        };
        this._url = url;
        this._resourceName = "/rooms"
    }

    async getRoomCarts(hotelId: number, filters: RoomFilters): Promise<RoomCartDto[]> {
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
            const response = await fetch(`${this._url}/hotels/${hotelId}${this._resourceName}${queryString ? `?${queryString}` : ''}`, {
                method: 'GET',
                headers: this._headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: RoomCartDto[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching room carts:', error);
            throw error;
        }
    }

    async getRoomDetails(id: number): Promise<RoomDetailsDto> {
        try {
            const response = await fetch(`${this._url}${this._resourceName}/${id}`, {
                method: 'GET',
                headers: this._headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: RoomDetailsDto = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching room details:', error);
            throw error;
        }
    }

    async createRoom(hotelId: number, model: CreateRoomDto): Promise<number> {
        try {
            const response = await fetch(`${this._url}/hotels/${hotelId}${this._resourceName}`, {
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
            console.error('Error creating room:', error);
            throw error;
        }
    }

    async updateRoom(id: number, model: UpdateRoomDto) {
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
            console.error('Error updating room:', error);
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
            console.error('Error deleting room:', error);
            throw error;
        }
    }

    async getReport(filters: RoomFilters) {
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
            console.error('Error fetching room report:', error);
            throw error;
        }
    }
}