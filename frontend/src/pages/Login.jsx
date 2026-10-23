import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (res.ok) {
            onLoginSuccess(data.user);
            navigate("/");
        } else {
            alert(data.error || "Ошибка входа");
        }
    };

    return (
        <form onSubmit={handleLogin} className="auth-form">
            <h2>Вход</h2>
            <input type="text" placeholder="Имя пользователя" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Войти</button>
        </form>
    );
}