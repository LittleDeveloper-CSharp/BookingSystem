import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import HotelHttpClient from '../clients/hotelHttpClient';
import RoomHttpClient from '../clients/roomHttpClient';
import BookingHttpClient from './bookingHttpClient';

export const useHotelClient = () => {
    const { user } = useAuth();
    const [client, setClient] = useState<HotelHttpClient | null>(null);

    useEffect(() => {
        const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
        const token = user?.token || '';
        setClient(new HotelHttpClient({ url: baseUrl, jwtToken: token }));

        const handleAuthChange = () => {
            setClient(new HotelHttpClient({
                url: baseUrl,
                jwtToken: localStorage.getItem('token') || ''
            }));
        };

        window.addEventListener('auth-changed', handleAuthChange);

        return () => {
            window.removeEventListener('auth-changed', handleAuthChange);
        };
    }, [user?.token]);

    return client;
};

export const useRoomClient = () => {
    const { user } = useAuth();
    const [client, setClient] = useState<RoomHttpClient | null>(null);

    useEffect(() => {
        const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
        const token = user?.token || '';
        setClient(new RoomHttpClient({ url: baseUrl, jwtToken: token }));

        const handleAuthChange = () => {
            setClient(new RoomHttpClient(
                {
                    url: baseUrl,
                    jwtToken: localStorage.getItem('token') || ''
                }));
        };

        window.addEventListener('auth-changed', handleAuthChange);

        return () => {
            window.removeEventListener('auth-changed', handleAuthChange);
        };
    }, [user?.token]);

    return client;
};

export const useBookingClient = () => {
    const { user } = useAuth();
    const [client, setClient] = useState<BookingHttpClient | null>(null);

    useEffect(() => {
        const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
        const token = user?.token || '';
        setClient(new BookingHttpClient({ url: baseUrl, jwtToken: token }));

        const handleAuthChange = () => {
            setClient(new BookingHttpClient(
                {
                    url: baseUrl,
                    jwtToken: localStorage.getItem('token') || ''
                }));
        };

        window.addEventListener('auth-changed', handleAuthChange);

        return () => {
            window.removeEventListener('auth-changed', handleAuthChange);
        };
    }, [user?.token]);

    return client;
};