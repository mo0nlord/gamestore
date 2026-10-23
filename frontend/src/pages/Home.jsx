import { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import "./Home.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Home({ user }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const { addToCart } = useCart();

    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "", description: "", price: "", stock: "", category_id: ""
    });

    const isStaff = user && (user.role === "seller" || user.role === "admin");

    const fetchProducts = () => {
        fetch(`${API_BASE}/products/`)
            .then((res) => res.json())
            .then((data) => { if (Array.isArray(data)) setProducts(data); })
            .catch((err) => console.error(err));
    };

    const fetchCategories = () => {
        fetch(`${API_BASE}/categories/`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                    if (data.length > 0 && !formData.category_id) {
                        setFormData((prev) => ({ ...prev, category_id: data[0].id }));
                    }
                }
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10) || 0,
            category_id: parseInt(formData.category_id, 10),
        };

        const url = editingId ? `${API_BASE}/products/${editingId}/` : `${API_BASE}/products/`;
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setFormData({ title: "", description: "", price: "", stock: "", category_id: categories[0]?.id || "" });
            setEditingId(null);
            fetchProducts();
        } else {
            alert("Ошибка сохранения");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить этот товар?")) return;
        const res = await fetch(`${API_BASE}/products/${id}/`, { method: "DELETE" });
        if (res.ok) fetchProducts();
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            title: item.title,
            description: item.description,
            price: item.price,
            stock: item.stock,
            category_id: item.category_id,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="catalog-container">
            <h2>Каталог ПК и Игр</h2>

            {isStaff && (
                <div className="seller-panel">
                    <h3>{editingId ? "✏️ Редактировать товар" : "➕ Добавить новый товар (Склад)"}</h3>
                    <form onSubmit={handleSubmit} className="seller-form">
                        <input
                            type="text" placeholder="Название" required
                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Описание" rows="2"
                            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="form-row">
                            <input
                                type="number" step="0.01" placeholder="Цена" required
                                value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                            <input
                                type="number" placeholder="Остаток"
                                value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                        <div className="form-row">
                            <button type="submit" style={{ flex: 1, backgroundColor: "#0284c7" }}>
                                {editingId ? "Сохранить" : "Создать товар"}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => setEditingId(null)} style={{ background: "#64748b" }}>
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <hr style={{ borderColor: "#334155", margin: "25px 0" }} />

            <div className="product-list">
                {products.map((item) => (
                    <div key={item.id} className="product-card">
                        <span className="category-badge">{item.category_name}</span>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <span className="price">{item.price} ₽</span>
                        <div className="stock-info">Остаток: {item.stock} шт.</div>

                        <button onClick={() => addToCart(item)} style={{ width: "100%", marginBottom: "6px" }}>
                            В корзину
                        </button>

                        {isStaff && (
                            <div className="card-actions">
                                <button onClick={() => startEdit(item)} style={{ flex: 1, fontSize: "12px", background: "#334155" }}>
                                    Изм.
                                </button>
                                <button onClick={() => handleDelete(item.id)} style={{ flex: 1, fontSize: "12px", background: "#ef4444" }}>
                                    Удал.
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}