import type { IHttpClient } from '../../../services/httpClient';

export interface ChartData {
    date: string;
    [key: string]: number | string;
}

export const getChartData = (client: IHttpClient, startDate: string, endDate: string, dataTypes: string[]) => {
    return client.get<ChartData[]>('/transactions/stats/charts', { params: { startDate, endDate, dataTypes: dataTypes.join(',') } });
};