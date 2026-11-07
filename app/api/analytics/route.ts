export async function POST(request: Request): Promise<Response> {
  await request.json().catch(() => null)
  return new Response(null, { status: 204 })
}
