import { useEffect, useState } from "react";
import "./Users.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Users() {
    const [users, setUsers] = useState([]);

    const fetchUsers = () => {
        fetch(`${API_BASE}/users/`)
            .then((res) => res.json())
            .then((data) => { if (Array.isArray(data)) setUsers(data); });
    };

    useEffect(() => { fetchUsers(); }, []);

    const changeRole = async (userId, currentRole) => {
        const nextRole = currentRole === "customer" ? "seller" : "customer";
        await fetch(`${API_BASE}/users/${userId}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: nextRole })
        });
        fetchUsers();
    };

    return (
        <div className="users-container">
            <h2>Пользователи системы</h2>
            <div className="users-list">
                {users.map((u) => (
                    <div key={u.id} className="user-item">
                        <div>
                            <b>{u.username}</b> <span className="user-role-label">({u.role})</span>
                        </div>
                        {u.role !== "admin" && (
                            <button onClick={() => changeRole(u.id, u.role)} style={{ fontSize: "12px" }}>
                                Сделать {u.role === "customer" ? "Продавцом" : "Клиентом"}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}