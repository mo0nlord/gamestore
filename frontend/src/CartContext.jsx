import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    function addToCart(product) {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, count: item.count + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, count: 1 }];
        });
    }

    function removeFromCart(productId) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }

    function clearCart() {
        setCart([]);
    }

    const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.count, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                totalCount,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Отключаем предупреждение fast-refresh для экспорта хука
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    return useContext(CartContext);
}