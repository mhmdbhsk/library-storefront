'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from './ui/card';
import Image from 'next/image';

export default function BookCard({ book }: { book: any }) {
  return (
    <Card
      key={book.isbn}
      className={cn(
        'w-full h-full shadow-none aspect-square hover:scale-[1.02] cursor-pointer bg-white transition-all duration-200 hover:bg-gray-100 active:scale-[0.99] border-gray-200'
      )}
    >
      <CardHeader className='gap-2 p-4'>
        <h1 className='font-bold line-clamp-2'>{book.name}</h1>
        <Image
          src={`${book.img_photo.preview}`}
          width={329}
          height={500}
          alt={book.name}
          className='border aspect-[3/4] object-cover mt-6 w-full'
        />
      </CardHeader>
      <CardContent className='text-xs text-gray-500 p-4 pt-0'>
        <p>
          {book.author} • {book.category_name}
        </p>
        <p className='mt-2'></p>
      </CardContent>
    </Card>
  );
}
