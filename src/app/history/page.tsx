'use client';

import { getCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import id from 'dayjs/locale/id';
import DetailHistoryDialog from '@/components/detail-history-dialog';

dayjs.locale(id);

export default function HistoryPage() {
  const loginState = getCookie('auth');
  const loginData = loginState && JSON.parse(loginState!);
  const tokenData = loginState && loginData && loginData?.token;
  const token = tokenData && JSON.parse(tokenData!);

  const query = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/borrowing/list`,
        {
          headers: {
            Authorization: `${tokenData}`,
          },
        }
      );

      return res.data.data;
    },
  });

  return (
    <div>
      {token ? (
        <div className='flex justify-center flex-col'>
          <div className='mb-6 flex justify-center'>
            <span className='text-center text-xl font-semibold'>
              Riwayat Peminjaman
            </span>
          </div>

          {query.data?.length > 0 ? (
            query.isLoading ? (
              <div>
                <span>Memuat...</span>
              </div>
            ) : (
              query.data?.map((history: any) => (
                <DetailHistoryDialog history={history} key={history.id} />
              ))
            )
          ) : (
            <div className='flex justify-center flex-col gap-1 mt-4'>
              <span className='text-center text-sm'>
                Anda belum melakukan peminjaman.
              </span>

              <span className='text-center text-sm'>
                Silahkan melakukan peminjaman untuk melihat riwayat peminjaman.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className='flex justify-center'>
          <span className='text-center text-sm'>
            Anda belum login. Silahkan login untuk melihat riwayat peminjaman.
          </span>
        </div>
      )}
    </div>
  );
}
