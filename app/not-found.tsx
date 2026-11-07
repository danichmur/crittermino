import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl" aria-hidden="true">
        🐭
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold">That page wandered off</h1>
      <Link href="/" className="mt-4 font-semibold text-[#E84B7F] underline-offset-4 hover:underline">
        Back to the puzzle
      </Link>
    </main>
  )
}
