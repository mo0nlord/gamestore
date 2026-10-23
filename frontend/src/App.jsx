import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "./CartContext";
import "./App.css";

// Импорт страниц из папки pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ user, allowedRoles, children }) {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default function App() {
    const { totalCount } = useCart();
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div>
            <nav className="app-nav">
                <Link to="/">Каталог</Link>
                <Link to="/cart">Корзина ({totalCount})</Link>

                {user && (user.role === "seller" || user.role === "admin") && (
                    <Link to="/orders" style={{ color: "#38bdf8" }}>Заказы</Link>
                )}

                {user && user.role === "admin" && (
                    <Link to="/users" style={{ color: "#f59e0b" }}>Пользователи</Link>
                )}

                {user ? (
                    <span className="nav-user-panel">
                        <span className="nav-user-name">
                            {user.username} ({user.role})
                        </span>
                        <button onClick={handleLogout} className="nav-logout-btn">
                            Выйти
                        </button>
                    </span>
                ) : (
                    <>
                        <Link to="/login">Вход</Link>
                        <Link to="/register">Регистрация</Link>
                    </>
                )}
            </nav>

            <hr className="app-divider" />

            <Routes>
                <Route path="/" element={<Home user={user} />} />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute user={user}>
                            <Cart user={user} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["seller", "admin"]}>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <Users />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}