import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();

  try {
    // Ambil cookie login
    const loginCookie = cookieStore.get("login");
    if (!loginCookie) {
      return NextResponse.json({
        status: false,
        message: "Login cookie not found",
        data: [],
      });
    }

    const data = JSON.parse(loginCookie.value);

    // Panggil API eksternal
    const response = await axios.get(
      "https://presensi.simeuluekab.go.id/manage/jamkerja/jsondata/?draw=1&start=0&length=0",
      {
        headers: {
          Accept: "*/*",
          Cookie: data.token,
        },
      }
    );

    // Cek hasil dari API
    if (response.data.draw === 1) {
      return NextResponse.json({ status: true, data: data });
    } else {
      return NextResponse.json({
        status: false,
        message: "Invalid draw data",
        data: [],
      });
    }
  } catch (error) {
    // Tangani error
    console.error("Error:", error);
    return NextResponse.json({
      status: false,
      message: "An error occurred",
      data: [],
    });
  }
}
