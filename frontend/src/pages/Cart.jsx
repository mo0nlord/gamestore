import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import "./Cart.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Cart({ user }) {
    const { cart, removeFromCart, clearCart, totalPrice } = useCart();
    const navigate = useNavigate();

    const checkout = async () => {
        const res = await fetch(`${API_BASE}/orders/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer_name: user?.username || "Гость",
                total_amount: totalPrice,
                items: cart,
            }),
        });

        if (res.ok) {
            alert("Заказ успешно оформлен и передан продавцу!");
            clearCart();
            navigate("/");
        }
    };

    if (cart.length === 0) {
        return (
            <div>
                <h2>Корзина</h2>
                <p>Ваша корзина пуста</p>
                <Link to="/">Вернуться к покупкам</Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Корзина</h2>
            <div className="cart-list">
                {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                        <div><b>{item.title}</b> — {item.price} ₽ × {item.count} шт.</div>
                        <button onClick={() => removeFromCart(item.id)}>Удалить</button>
                    </div>
                ))}
            </div>
            <h3 className="cart-total">Итого: {totalPrice} ₽</h3>
            <div className="cart-buttons">
                <button onClick={clearCart}>Очистить</button>
                <button onClick={checkout} style={{ background: "#22c55e" }}>Оформить заказ</button>
            </div>
        </div>
    );
}