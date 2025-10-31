// emails/AdminNewUserEmail.tsx
export const AdminNewUserEmail = ({
    name,
    email,
}: {
    name: string;
    email: string;
}) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
        <h2>👤 New User Registered</h2>
        <p>A new user has just signed up on <strong>Vutuk</strong>.</p>

        <ul>
            <li><strong>Name:</strong> {name}</li>
            <li><strong>Email:</strong> {email}</li>
        </ul>

        <p>You can review this user’s details from your admin dashboard.</p>

        <p style={{ color: "#555", fontSize: "13px" }}>
            — Vutuk System Notification
        </p>
    </div>
);
