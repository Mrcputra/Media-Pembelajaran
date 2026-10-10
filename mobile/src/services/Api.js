import axios from 'axios';

// Jika menggunakan React Native CLI dengan react-native-dotenv
// import { BACKEND_API_URL } from '@env'; 

// Jika menggunakan Expo dan file .env tidak terbaca, Anda bisa hardcode sementara untuk development:
// const BACKEND_API_URL = 'http://10.0.2.2:3000/api'; 
// (10.0.2.2 adalah localhost untuk Android Emulator)

const API = axios.create({
    baseURL: process.env.BACKEND_API_URL || 'http://10.0.2.2:3000/api',
    timeout: 5000,
});

export default API;
