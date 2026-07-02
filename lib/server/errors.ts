import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Centralized error → JSON response mapping for all route handlers. */
export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    const first = error.issues[0];
    const message = first ? `${first.message}` : 'Invalid request.';
    return NextResponse.json({ message, issues: error.issues }, { status: 400 });
  }

  console.error('Unhandled API error:', error);
  return NextResponse.json({ message: 'Something went wrong on the server.' }, { status: 500 });
}
