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

interface DetailBookDialogProps {
  book: any;
}

export default function DetailBookDialog({ book }: DetailBookDialogProps) {
  const query = useQuery({
    queryKey: ['detail-book'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/book/show/${book.id}`
      );

      return res.data.data;
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <BookCard book={book} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-4'>{book.name}</DialogTitle>
          <DialogDescription>
            <div className='flex gap-4'>
              <Image
                src={`${book.img_photo.preview}`}
                width={100}
                height={300}
                alt={book.name}
                className='border aspect-[3/4] object-cover flex-1 w-full'
              />

              <div className='flex flex-col gap-1 basis-1/2 w-full flex-1'>
                <Rating
                  style={{ maxWidth: 100 }}
                  value={5}
                  readOnly
                  className='mb-2'
                />

                <ul className='flex-col flex gap-1'>
                  <li className='flex'>
                    <span className='flex basis-1/4'>ISBN</span>
                    <span className='mx-2'>:</span>
                    <span className='flex flex-1'>{book.isbn}</span>
                  </li>
                  <Separator />
                  <li className='flex'>
                    <span className='flex basis-1/4'>Pengarang</span>
                    <span className='mx-2'>:</span>
                    <span className='flex flex-1'>{book.author}</span>
                  </li>
                  <Separator />
                  <li className='flex'>
                    <span className='flex basis-1/4'>Editor</span>
                    <span className='mx-2'>:</span>
                    <span className='flex flex-1'>{book.editor}</span>
                  </li>
                  <Separator />
                  <li className='flex'>
                    <span className='flex basis-1/4'>Penerbit</span>
                    <span className='mx-2'>:</span>
                    <span className='flex flex-1'>{book.publisher}</span>
                  </li>
                  <Separator />
                  <li className='flex'>
                    <span className='flex basis-1/4'>Kategori</span>
                    <span className='mx-2'>:</span>
                    <span className='flex flex-1'>{book.category_name}</span>
                  </li>
                  <Separator />
                  <li className='flex'>
                    <span className='flex basis-1/4'>Stok</span>
                    <span className='mx-2'>:</span>
                    <span className='flex flex-1'>{book.stock}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className='mt-4'>
              <span className='font-bold'>Ulasan</span>

              <div className='mt-2'>
                {[1].map((_, i) => (
                  <>
                    <div key={i} className='flex'>
                      <div className='flex flex-1 flex-col'>
                        <span>Ngeri ges 🔥</span>
                        <span className='text-xs text-gray-400'>
                          Muhammad Bhaska
                        </span>
                      </div>

                      <Rating style={{ maxWidth: 100 }} value={3.5} readOnly />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
