// emails/AdminNewOrderEmail.tsx
import { AdminOrderEmailProps } from "@/types/email";

export const AdminNewOrderEmail = ({
    name,
    customerEmail,
    orderId,
    amount,
    items,
}: AdminOrderEmailProps) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
        <h2>🛒 New Order Received</h2>
        <p>A new order has been placed on <strong>Vutuk</strong>.</p>

        <h3>Customer Info</h3>
        <ul>
            <li><strong>Name:</strong> {name}</li>
            <li><strong>Email:</strong> {customerEmail}</li>
        </ul>

        <h3>Order Details</h3>
        <ul>
            <li><strong>Order ID:</strong> {orderId}</li>
            <li><strong>Total Amount:</strong> ₹{amount}</li>
        </ul>

        <h4>Items:</h4>
        {items?.length ? (
            <ul>
                {items.map((item, i) => (
                    <li key={i}>
                        {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No items found.</p>
        )}

        <p>Please review this order in your admin dashboard.</p>
        <p style={{ color: "#555", fontSize: "13px" }}>— Vutuk Order System</p>
    </div>
);
