import axios from 'axios';
import { url } from './settings.js';

const instance = axios.create({
    withCredentials: true,
    baseURL: url,
});
export default instance;