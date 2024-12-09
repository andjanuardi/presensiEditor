import axios from "axios";
import * as cheerio from "cheerio";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { item: request } = await req.json();
  const satker = request.satker;
  const id = request.pegawai.id;
  const nip = request.pegawai.nip;
  const nama = request.pegawai.nama;
  const tanggal = request.tanggal;
  const masuk = request.masuk;
  const pulang = request.pulang;
  const keterangan = "-";
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

    const encodedParams = new URLSearchParams();
    encodedParams.set("asn_id", id);
    encodedParams.set("nip", nip);
    encodedParams.set("nama", nama);
    encodedParams.set("tanggal", tanggal);
    encodedParams.set("masuk", masuk);
    encodedParams.set("pulang", pulang);
    encodedParams.set("keterangan", keterangan);
    encodedParams.set("zarc_csrf", data.zarc_csrf);

    const body = {
      method: "POST",
      url: `https://presensi.simeuluekab.go.id/manage/manual/save/${satker}/`,
      data: encodedParams,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: data.token,
      },
    };

    console.log(body);

    // Panggil API eksternal
    const proses = await axios.request(body);

    if (proses.status) {
      return NextResponse.json({
        status: true,
        data: proses.data,
      });
    } else {
      return NextResponse.json({
        status: false,
        data: proses.data,
      });
    }
    // return NextResponse.json({
    //   status: true,
    // });
  } catch (error) {
    // Tangani error
    console.error("Error:", error);
    return NextResponse.json({
      status: false,
      message: "An error occurred : " + error,
    });
  }
}
