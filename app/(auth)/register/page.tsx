'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, register } from '@/store/authSlice';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { submitting, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const displayError = localError || error;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError('');

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      router.replace('/tasks');
    }
  };

  const clearErrors = () => {
    setLocalError('');
    if (error) dispatch(clearAuthError());
  };

  const fields = [
    { id: 'name', label: 'Name', type: 'text', value: name, set: setName, placeholder: 'Alex Kim', autoComplete: 'name' },
    { id: 'email', label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com', autoComplete: 'email' },
    { id: 'password', label: 'Password', type: 'password', value: password, set: setPassword, placeholder: 'At least 8 characters', autoComplete: 'new-password' },
    { id: 'confirm', label: 'Confirm password', type: 'password', value: confirm, set: setConfirm, placeholder: 'Repeat your password', autoComplete: 'new-password' },
  ];

  return (
    <AuthCard>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-[#f2f6fb]">Create your account</h1>
      <p className="mt-1.5 text-sm text-on-surface-variant">Join the workspace and start organizing tasks.</p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label htmlFor={field.id} className="ml-0.5 block text-[13px] font-medium text-on-surface-variant">
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              required
              autoComplete={field.autoComplete}
              value={field.value}
              onChange={(event) => {
                clearErrors();
                field.set(event.target.value);
              }}
              placeholder={field.placeholder}
              className="glass-input"
            />
          </div>
        ))}

        {displayError && (
          <p
            role="alert"
            className="flex items-center gap-2 rounded-[11px] border border-error/30 bg-error/10 px-3.5 py-2.5 text-[13px] text-[#ff9c9c]"
          >
            <svg width="13" height="13" viewBox="0 0 12 12" className="shrink-0" aria-hidden>
              <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6 3.4 V6.6 M6 8.2 v0.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {displayError}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-7 text-center text-xs text-on-surface-variant">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
