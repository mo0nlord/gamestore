import { useEffect, useState } from "react";
import "./Orders.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/orders/`)
            .then((res) => res.json())
            .then((data) => { if (Array.isArray(data)) setOrders(data); });
    }, []);

    return (
        <div className="orders-container">
            <h2>Заказы покупателей</h2>
            {orders.length === 0 ? <p>Заказов пока нет</p> : (
                <div className="orders-list">
                    {orders.map((o) => (
                        <div key={o.id} className="order-card">
                            <div className="order-header">
                                <b>Заказ #{o.id} — {o.customer_name}</b>
                                <span className="order-date">{o.created_at}</span>
                            </div>
                            <p className="order-status">
                                Статус: <b>{o.status}</b> | Сумма: <b className="order-amount">{o.total_amount} ₽</b>
                            </p>
                            <ul className="order-items">
                                {o.items.map((i, idx) => (
                                    <li key={idx} style={{ fontSize: "13px" }}>
                                        {i.title} — {i.quantity} шт. ({i.price} ₽)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}