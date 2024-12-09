import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
  const satker = request.satker;
  const periode = request.periode;

  const date = new Date(periode);
  // Tanggal awal bulan
  const awal = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`;

  // Tanggal akhir bulan
  const akhir = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}`;

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
    const getDaftarPegawai = await axios.get(
      `https://presensi.simeuluekab.go.id/manage/rekap/perorangan/asndata?draw=1&start=0&length=10000&satker_uuid=${satker}&mulai=${awal}&selesai=${akhir}`,
      {
        headers: {
          Accept: "*/*",
          Cookie: data.token,
        },
      }
    );

    const { data: dataPegawai } = getDaftarPegawai.data;

    const pegawaiData = dataPegawai.map((row) => {
      const link = row[row.length - 1]; // Ambil elemen terakhir (tag <a>)

      // Ambil atribut data-asn_uuid dan data-nama menggunakan regex
      const id = link.match(/data-asn_id="([^"]+)"/)?.[1] || "";
      const uuid = link.match(/data-asn_uuid="([^"]+)"/)?.[1] || "";
      const nip = row[2];
      const nama = link.match(/data-nama="([^"]+)"/)?.[1] || "";
      return { id, uuid, nip, nama };
    });

    return NextResponse.json({
      status: true,
      data: pegawaiData,
    });
  } catch (error) {
    // Tangani error
    console.error("Error:", error);
    return NextResponse.json({
      status: false,
      message: "An error occurred : " + error,
      data: [],
    });
  }
}
