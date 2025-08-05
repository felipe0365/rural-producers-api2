import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        username: string;
        name: string;
    };
}

class AuthService {
    async login(username: string, password: string): Promise<AuthResponse> {
        console.log(
            "AuthService: Fazendo requisição de login para:",
            `${API_URL}/auth/login`
        );
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password,
            });
            console.log("AuthService: Resposta do login:", response.data);
            return response.data;
        } catch (error: any) {
            console.error(
                "AuthService: Erro no login:",
                error.response?.data || error.message
            );
            throw error;
        }
    }

    async register(
        name: string,
        username: string,
        password: string
    ): Promise<AuthResponse> {
        console.log(
            "AuthService: Fazendo requisição de registro para:",
            `${API_URL}/auth/register`
        );
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                username,
                password,
            });
            console.log("AuthService: Resposta do registro:", response.data);
            return response.data;
        } catch (error: any) {
            console.error(
                "AuthService: Erro no registro:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
}

export const authService = new AuthService();
