'use client';

import Image from 'next/image';
import BookCard from './book-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Rating } from '@smastrom/react-rating';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import HistoryCard from './history-card';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { getCookie } from 'cookies-next';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface DetailHistoryDialogProps {
  history: any;
}

export default function DetailHistoryDialog({
  history,
}: DetailHistoryDialogProps) {
  const loginState = getCookie('auth');
  const loginData = loginState && JSON.parse(loginState!);
  const tokenData = loginState && loginData && loginData?.token;
  const token = tokenData && JSON.parse(tokenData!);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const query = useQuery({
    queryKey: ['detail-history'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/borrowing/show/${history.id}`,
        {
          headers: {
            Authorization: `${tokenData}`,
          },
        }
      );

      return res.data.data;
    },
  });

  const data = query.data;

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
    <Dialog>
      <DialogTrigger>
        <HistoryCard history={history} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-4'>
            ID Peminjaman #{history.id}
          </DialogTitle>
          <DialogDescription>
            <div className='flex flex-col gap-1 basis-1/2 w-full flex-1'>
              <ul className='flex-col flex gap-1'>
                <li className='flex'>
                  <span className='flex basis-1/4'>Operator</span>
                  <span className='mx-2'>:</span>
                  <span className='flex flex-1'>
                    {history.officer_user_name}
                  </span>
                </li>
                <Separator />
                <li className='flex'>
                  <span className='flex basis-1/4'>Nama Buku</span>
                  <span className='mx-2'>:</span>
                  <span className='flex flex-1'>{history.book_name}</span>
                </li>
                <Separator />
                <li className='flex'>
                  <span className='flex basis-1/4'>Status</span>
                  <span className='mx-2'>:</span>
                  <span className='flex flex-1'>
                    {renderBadgeHistory(history.status_code)}
                  </span>
                </li>
              </ul>
            </div>

            {history.status_code === 'returned' && (
              <div className='mt-4'>
                <DialogTitle className='mb-4'>Beri Ulasan</DialogTitle>

                <Input
                  multiple
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder='Masukkan komentar'
                />

                <div className='mt-2 flex justify-between'>
                  <Rating
                    style={{ maxWidth: 150 }}
                    value={rating}
                    onChange={(value: any) => setRating(value)}
                  />

                  <Button size='sm'>Ulas</Button>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
