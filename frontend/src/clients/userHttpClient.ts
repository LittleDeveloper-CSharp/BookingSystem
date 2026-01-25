import { jwtDecode } from 'jwt-decode';
import type { User } from "../models/user";
import type { HttpClientOptions } from "./models/httpClientOptions";

interface LoginDto {
    login: string,
    password: string
}

interface LoginResultDto {
    jwt: string
}

interface RegisterDto {
    login: string,
    password: string
}

interface CustomJwtPayload {
    sub?: string;
    email?: string;
    unique_name?: string;
    exp?: number;
    iat?: number;

    role?: string;
}

export default class UserHttpClient {
    _url: string;

    constructor({ url }: HttpClientOptions) {
        this._url = url;
    }

    async login(model: LoginDto): Promise<User> {
        const formData = new FormData();

        formData.append("login", model.login);
        formData.append("password", model.password);

        const response = await fetch(`${this._url}/login`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LoginResultDto = await response.json();
        const decoded = jwtDecode<CustomJwtPayload>(data.jwt);

        return {
            token: data.jwt,
            role: decoded.role || '',
        };
    }

    async register(model: RegisterDto) {
        const formData = new FormData();

        formData.append("login", model.login);
        formData.append("password", model.password);

        const response = await fetch(`${this._url}/register`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}
