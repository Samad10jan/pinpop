'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
    (await cookies()).set('access', '', { maxAge: 0 })
        .set('refresh', '', { maxAge: 0 });
    redirect('/');
}