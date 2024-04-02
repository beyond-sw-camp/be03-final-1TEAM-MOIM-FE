import axios from 'axios';
import { jwtDecode } from 'jwt-decode'

const EXPIRATION_KEY = 'exp';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const decodeToken = (token) => {
    if(!token){
        return null;
    }
    return jwtDecode(token);
}

// Access Token 가져오는 함수
const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

// Refresh Token 가져오는 함수
const getRefreshToken = () => {
    return localStorage.getItem('refresh_token');
};

// Access Token 유효성 검증 함수
const isAccessTokenExpired = (token) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken){
        return true;
    }

    const expirationDate = new Date(decodedToken[EXPIRATION_KEY]);
    const now = new Date();
    const remainingTime = expirationDate.getTime() - now.getTime();

    // 만료 시간이 30초 이하 남았으면 만료 처리
    return remainingTime <= 30 * 1000;
};

// Axios Interceptor 설정
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = getAccessToken();
        if (accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (isAccessTokenExpired(getAccessToken())) {
            // Access Token 유효 시 
        }
    }
);



