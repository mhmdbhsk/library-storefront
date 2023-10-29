'use client';

import { set, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const loginSchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const registerSchema = yup
  .object()
  .shape({
    user_email: yup.string().required(),
    user_password: yup.string().required(),
    user_name: yup.string().required(),
    address: yup.string().required(),
    city: yup.string().required(),
    phone: yup.string().required(),
    identity_number: yup.string().required(),
  })
  .required();

export default function AuthDialog() {
  const [formState, setFormState] = useState<'login' | 'register'>('login');
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

  const handleRegisterSuccess = (state: boolean) => {
    console.log('state', state);
    setRegisterSuccess(state);
    handleFormState('login');
  };

  const handleFormState = (state: 'login' | 'register') => setFormState(state);

  return (
    <div>
      <Dialog onOpenChange={() => setFormState('login')}>
        <DialogTrigger asChild>
          <Button variant='outline'>Masuk</Button>
        </DialogTrigger>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            {formState === 'login' ? (
              <>
                <DialogTitle>Masuk</DialogTitle>
                <DialogDescription>Masuk untuk melanjutkan</DialogDescription>
                <DialogDescription>
                  {registerSuccess && (
                    <Alert className='my-3'>
                      <AlertTitle className='mt-1'>
                        Pendaftaran Sukses
                      </AlertTitle>
                      <AlertDescription className='text-xs mt-2'>
                        Pendaftaran berhasil, silahkan masuk untuk melanjutkan
                      </AlertDescription>
                    </Alert>
                  )}
                  <LoginForm />

                  <div className='mt-4 text-center'>
                    <span className='text-xs'>
                      Belum punya akun?{' '}
                      <button
                        className='text-blue-500'
                        onClick={() => handleFormState('register')}
                      >
                        Daftar
                      </button>
                    </span>
                  </div>
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Daftar</DialogTitle>
                <DialogDescription>
                  Daftar untuk mendaftar sebagai anggota
                </DialogDescription>
                <DialogDescription>
                  <RegisterForm onRegisterSuccess={handleRegisterSuccess} />

                  <div className='mt-4 text-center'>
                    <span className='text-xs'>
                      Sudah punya akun?{' '}
                      <button
                        className='text-blue-500'
                        onClick={() => handleFormState('login')}
                      >
                        Masuk
                      </button>
                    </span>
                  </div>
                </DialogDescription>
              </>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({ resolver: yupResolver(loginSchema) });
  const {
    formState: { isValid },
  } = form;

  const router = useRouter();

  async function onSubmit(values: Record<string, string>) {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        {
          email: values['email'],
          password: values['password'],
        }
      );

      if (res.data) {
        setCookie('auth', res.data.data);
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message);
      form.setError('email', { message: 'Email atau password salah' });
      form.setError('password', { message: 'Email atau password salah' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <FormControl>
                <Input
                  id='email'
                  type='email'
                  placeholder='Masukkan email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <FormControl>
                <Input
                  id='password'
                  type='password'
                  placeholder='Masukkan password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={!isValid}
          loading={loading}
        >
          Masuk
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm({
  onRegisterSuccess,
}: {
  onRegisterSuccess: (state: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const form = useForm({ resolver: yupResolver(registerSchema) });
  const {
    formState: { isValid },
  } = form;

  const router = useRouter();

  async function handleUpload(e: any) {
    setLoading(true);
    const file = e.target.files[0];

    const data = new FormData();

    data.append('img_identity_photo', file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/upload`,
        data
      );

      if (res.data) {
        set(form.getValues(), 'img_identity_photo', res.data.data);
      }

      setImage(res.data.data);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: Record<string, string>) {
    setLoading(true);

    try {
      const data = {
        user_email: values['user_email'],
        user_password: values['user_password'],
        user_name: values['user_name'],
        address: values['address'],
        phone_number: values['phone_number'],
        img_identity_photo: image,
        identity_number: values['identity_number'],
        city: values['city'],
        phone: values['phone'],
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/member/create`,
        data
      );

      onRegisterSuccess(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      setImage(null);
      onRegisterSuccess(true);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='identity_number'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='identity_number'>Nomor Identitas</FormLabel>
              <FormControl>
                <Input
                  id='identity_number'
                  type='string'
                  placeholder='Masukkan nama'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='user_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='user_name'>Nama</FormLabel>
              <FormControl>
                <Input
                  id='user_name'
                  type='string'
                  placeholder='Masukkan nama'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='address'>Alamat</FormLabel>
              <FormControl>
                <Input
                  id='address'
                  type='string'
                  placeholder='Masukkan alamat'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='city'>Kota</FormLabel>
              <FormControl>
                <Input
                  id='city'
                  type='string'
                  placeholder='Masukkan kota'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='phone'>Nomor Telepon</FormLabel>
              <FormControl>
                <Input
                  id='phone'
                  type='string'
                  placeholder='Masukkan nomor telepon'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='user_email'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <FormControl>
                <Input
                  id='email'
                  type='email'
                  placeholder='Masukkan email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='user_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <FormControl>
                <Input
                  id='password'
                  type='password'
                  placeholder='Masukkan password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel htmlFor='password'>Foto Profil</FormLabel>
          <FormControl>
            <Input
              id='img_identity_photo'
              type='file'
              placeholder='Masukkan file'
              onChange={handleUpload}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button
          type='submit'
          className='w-full'
          disabled={!isValid || !image}
          loading={loading}
        >
          Masuk
        </Button>
      </form>
    </Form>
  );
}
