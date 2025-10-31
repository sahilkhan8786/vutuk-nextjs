// emails/AdminNewCustomOrderEmail.tsx
export const AdminNewCustomOrderEmail = ({
    customerName,
    customerEmail,
    material,
    color,
    quantity,
    notes,
}: {
    customerName: string;
    customerEmail: string;
    material: string;
    color: string;
    quantity: number;
    notes?: string;
}) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
        <h2>🧩 New Custom 3D Print Request</h2>
        <p>A new 3D print request has been submitted.</p>

        <h3>Customer Info</h3>
        <ul>
            <li><strong>Name:</strong> {customerName}</li>
            <li><strong>Email:</strong> {customerEmail}</li>
        </ul>

        <h3>Request Details</h3>
        <ul>
            <li><strong>Material:</strong> {material}</li>
            <li><strong>Color:</strong> {color}</li>
            <li><strong>Quantity:</strong> {quantity}</li>
            {notes && <li><strong>Notes:</strong> {notes}</li>}
        </ul>

        <p>Please log in to the admin panel to review and process the order.</p>

        <p style={{ color: "#555", fontSize: "13px" }}>
            — Vutuk Order Notification
        </p>
    </div>
);
