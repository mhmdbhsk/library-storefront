'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DetailBookDialog from '@/components/detail-book-dialog';

export default function Home() {
  const [searchType, setSearchType] = useState('name');
  const [books, setBooks] = useState([]);

  const { data: booksList, isLoading: booksListLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () =>
      await axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/book/list`)
        .then((res) => {
          setBooks(res.data.data);
          return res.data.data;
        }),
  });

  const booksFilter = (e: any) => {
    const keyword = e.target.value;

    const filteredBooks = booksList?.filter((book: any) => {
      return book[searchType].toLowerCase().includes(keyword.toLowerCase());
    });

    setBooks(filteredBooks);
  };

  return (
    <div>
      <div className='mb-8 flex gap-4'>
        <Input onChange={booksFilter} placeholder='Masukkan kata kunci' />

        <Select onValueChange={setSearchType} value={searchType}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Pilih tipe' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='name'>Judul</SelectItem>
              <SelectItem value='category_name'>Kategori</SelectItem>
              <SelectItem value='author'>Pengarang</SelectItem>
              <SelectItem value='publisher'>Penerbit</SelectItem>
              <SelectItem value='isbn'>ISBN</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {booksListLoading && <p>Memuat...</p>}

      {books.length === 0 && !booksListLoading ? (
        <p className='w-full text-center flex justify-center'>
          Tidak ada buku yang ditemukan.
        </p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {books?.map((book: any) => (
            <DetailBookDialog book={book} key={book.id} />
          ))}
        </div>
      )}
    </div>
  );
}
