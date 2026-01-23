import type { HotelFilters } from './hotelFilters';

export interface HotelFiltersProps {
    filters: HotelFilters;
    onFiltersChange: (filters: HotelFilters) => void;
    onReset: () => void;
}
