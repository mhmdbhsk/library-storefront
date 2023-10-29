'use client';

import dayjs from 'dayjs';
import { Badge } from './ui/badge';

export default function HistoryCard({ history }: { history: any }) {
  const renderBadgeHistory = (status: string) => {
    switch (status) {
      case 'returned':
        return (
          <Badge className='bg-green-400 hover:bg-green-500'>
            Sudah Dikembalikan
          </Badge>
        );
      case 'ongoing':
        return (
          <Badge className='bg-blue-400 hover:bg-blue-500'>
            Sedang Dipinjam
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className='bg-red-400 hover:bg-red-500'>Melebihi Batas</Badge>
        );
      default:
        return (
          <Badge className='bg-gray-400 hover:bg-gray-500'>
            Tidak diketahui
          </Badge>
        );
    }
  };

  return (
    <div
      className='border p-4 rounded-xl flex justify-between hover:bg-gray-100 active:scale-[0.99] hover:scale-[1.02] transition-all duration-200 cursor-pointer'
      key={history.id}
    >
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-semibold'>{history.book_name}</span>
        <div className='flex flex-col items-start'>
          <span className='text-xs text-gray-400'>Tanggal Dipinjam</span>
          <span className='text-sm'>
            {dayjs(history.created_at).format('DD MMMM YYYY')}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2 items-end justify-between'>
        <span className='text-xs'>ID Peminjaman #{history.id}</span>
        {renderBadgeHistory(history.status_code)}
      </div>
    </div>
  );
}
