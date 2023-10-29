'use client';

import { getCookie } from 'cookies-next';
import AuthDialog from './auth-dialog';
import { Button } from './ui/button';
import AccountMenu from './account-menu';
import { useRouter } from 'next-nprogress-bar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const loginState = getCookie('auth');
  const loginData = loginState && JSON.parse(loginState!);
  const tokenData = loginState && loginData && loginData?.token;
  const token = tokenData && JSON.parse(tokenData!);
  const router = useRouter();

  return (
    <div className='min-h-screen h-full flex flex-col max-w-3xl w-full mx-auto'>
      <div className='flex fixed top-0 h-16 w-full max-w-3xl items-center justify-between bg-white/50 z-10 backdrop-blur-sm container'>
        <h1 className='font-semibold'>Perpustakaan</h1>

        <div className='flex gap-2 items-center'>
          <Button variant='ghost' onClick={() => router.push('/')}>
            Beranda
          </Button>

          {!token ? (
            <AuthDialog />
          ) : (
            <div className='flex gap-4 items-center'>
              <div className='flex'>
                <Button variant='ghost' onClick={() => router.push('/history')}>
                  Riwayat
                </Button>
              </div>

              <AccountMenu token={token} />
            </div>
          )}
        </div>
      </div>

      <div className='container min-h-[calc(100svh-128px)] mt-16 p-4'>
        {children}
      </div>

      <div>
        <div className='items-center  h-16 w-full bg-white/50 container flex justify-between text-xs text-gray-500'>
          <div className='flex gap-3'>
            <a href='https://github.com/mhmdbhsk'>Github</a>
          </div>

          <p>2023 © PBP MiniProject</p>
        </div>
      </div>
    </div>
  );
}
