import type { IHttpClient } from '../../../services/httpClient';
import type { Exchange } from '../../../types';

export const getCurrencies = (client: IHttpClient): Promise<Exchange[]> => {
    const responsePromise = client.get<Exchange[]>('/currency');
    console.log("Response Promise from API:", responsePromise); // Log the entire promise object
    return responsePromise.then(response => {
        console.log("Full Response Object (inside then):", response); // Log the full response object
        // console.log("Data from API (inside then):", response.data); // This line is now incorrect
        return response; // Return the response directly, as it's already the data array
    });
};