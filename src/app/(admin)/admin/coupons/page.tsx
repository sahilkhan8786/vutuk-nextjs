import AddCouponsFormWrapper from '@/components/custom/admin/wrappers/AddCouponsFormWrapper'
import React from 'react'
import AdminCoupons from '@/components/custom/coupons/AdminCoupons'

const AdminCouponsPage = () => {
    return (
        <div>
            <div className='flex items-center justify-between w-full bg-dark text-light text-3xl p-3 rounded-xl'>

                <h1 className=''>Coupons </h1>
                <div className='flex gap-2 items-center justify-center'>
                    <AddCouponsFormWrapper />
                </div>






            </div>
            <AdminCoupons />
        </div>
    )
}

export default AdminCouponsPage