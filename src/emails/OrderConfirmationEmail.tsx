// emails/OrderConfirmationEmail.tsx
import { OrderEmailProps } from "@/types/email";

export const OrderConfirmationEmail = ({
    name,
    orderId,
    amount,
    items,
}: OrderEmailProps) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
        <h2>🎉 Order Confirmed!</h2>
        <p>Hi {name},</p>
        <p>
            Thank you for your order with <strong>Vutuk</strong>. We’re thrilled to start preparing your products.
        </p>

        <h3>🧾 Order Summary</h3>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Total:</strong> ₹{amount}</p>

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

        <p>We’ll notify you when your order ships.</p>
        <p>— The Vutuk Team</p>
    </div>
);
