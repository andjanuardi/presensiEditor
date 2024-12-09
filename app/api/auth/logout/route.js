import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  try {
    cookieStore.delete("login");
    return Response.json(true);
  } catch (error) {
    return Response.json(false);
  }
}
