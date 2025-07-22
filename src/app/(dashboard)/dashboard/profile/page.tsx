// app/profile/page.tsx (Server Component)

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardProfileForm from '@/components/custom/dashboard/DashboardProfileForm';



export default async function UserProfilePage() {
    const session = await auth();
    console.log(session)

    if (!session || !session.user?.email) {
        return redirect('/login');
    }


    const user = session.user;
    console.log("USER FROM SESSION", user)


    const userData = {
        image: user?.image || '',
        id: user?.id || '',
        username: user?.name || '',
        email: user?.email || '',
        isEmailVerfied: user?.isEmailVerfied || false,
        phone: user?.phone?.toString() || '',
        isPhoneVerfied: user?.isPhoneVerfied || false,

    };

    return <DashboardProfileForm defaultValues={userData} />;
}
