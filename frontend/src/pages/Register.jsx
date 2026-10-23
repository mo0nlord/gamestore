import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Register({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE}/auth/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role }),
        });
        const data = await res.json();

        if (res.ok) {
            onLoginSuccess(data.user);
            navigate("/");
        } else {
            alert(data.error || "Ошибка регистрации");
        }
    };

    return (
        <form onSubmit={handleRegister} className="register-form">
            <h2>Регистрация</h2>
            <input type="text" placeholder="Имя пользователя" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label className="role-select-label">Роль:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Клиент (покупатель)</option>
                <option value="seller">Продавец (склад)</option>
            </select>
            <button type="submit">Зарегистрироваться</button>
        </form>
    );
}