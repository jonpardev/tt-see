import axios from 'axios';
import { API_URL } from './env';

export default axios.create({
    baseURL: API_URL,
    timeout: 9000,
    headers: {
        "Content-type": "application/json"
    }
});