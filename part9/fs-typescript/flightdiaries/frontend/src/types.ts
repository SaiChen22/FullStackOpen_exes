export interface Diary{
    id: number;
    date: string;
    weather: string;
    visibility: string;
}

export type NewDiary = Omit<Diary,"id">;

export const WeatherOptions = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as const;
export const VisibilityOptions = ['great', 'good', 'ok', 'poor'] as const;
