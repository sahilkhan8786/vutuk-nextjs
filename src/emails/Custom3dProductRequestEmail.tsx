export const Custom3dProductRequestEmail = ({
    name,
    requestId,
    material,
    color,
    quantity,
}: {
    name: string;
    requestId: string;
    material: string;
    color: string;
    quantity: number;
}) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
        <h2>Hi {name}, 👋</h2>
        <p>Thank you for submitting your 3D print request with <strong>Vutuk</strong>.</p>
        <p>Here are your request details  with  id ${requestId}:</p>
        <ul>
            <li><strong>Material:</strong> {material}</li>
            <li><strong>Color:</strong> {color}</li>
            <li><strong>Quantity:</strong> {quantity}</li>
        </ul>
        <p>Our team will review your model and get back to you shortly with pricing and estimated delivery time.</p>
        <p>We appreciate your trust in us!</p>
        <p>— The Vutuk 3D Printing Team</p>
    </div>
);
