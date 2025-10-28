import EditCouponFormWrapper from "../admin/wrappers/EditCouponFormWrapper";
import DeleteHandler from "../deleteHandler/DeleteHandler";

type Coupon = {
    _id: string;
    name: string;
    type: "percentage" | "fixed";
    value: number;
    maxUses: number;
    isActive: boolean;        // ✅ add this
    startDate?: string;       // ✅ add this
    endDate?: string;         // ✅ add this
};


// ✅ Server Component
const AdminCoupons = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coupons`, {
        cache: "no-store", // ensures fresh data (not static)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch coupons");
    }

    const coupons: Coupon[] = await res.json();

    return (
        <div className="space-y-4 mt-4 border rounded-xl p-4 border-primary">
            <h2 className="text-xl font-semibold">All Coupons</h2>

            {coupons.length === 0 ? (
                <p className="text-gray-500">No coupons created yet.</p>
            ) : (
                <div className="space-y-2">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className="flex items-center justify-between border p-3 rounded-lg"
                        >
                            <div>
                                <p className="font-bold">{coupon.name}</p>
                                <p className="text-sm text-gray-500">
                                    {coupon.type === "percentage"
                                        ? `${coupon.value}%`
                                        : `$${coupon.value}`}{" "}
                                    | Max Uses: {coupon.maxUses}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {/* ✅ Edit wrapper must be client-side */}
                                <EditCouponFormWrapper coupon={coupon} />
                                {/* ✅ Delete must also be client-side */}
                                {/* We'll wrap delete button in a small client component */}
                                <DeleteHandler id={coupon._id} docToDelete="coupon" />

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
