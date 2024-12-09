import axios from "axios";
import * as cheerio from "cheerio";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
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
    const getDataLaporan = await axios.get(
      "https://presensi.simeuluekab.go.id/manage/rekap/perorangan/",
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: data.token,
        },
      }
    );

    const dataLaporan = cheerio.load(getDataLaporan.data);
    const uuid = request.selPegawai || dataLaporan("#asn_uuid").val();
    const satker = request.selSatker || dataLaporan("#pil_satker").val();

    var daftarSKPK = [];
    dataLaporan("#pil_satker").each((id, elem) => {
      const options = dataLaporan(elem).find("option");
      const option = options.map((i, item) => ({
        value: dataLaporan(item).val(),
        text: dataLaporan(item).text(),
      }));
      daftarSKPK = option.get();
    });

    const periode =
      request.selPeriode.length > 1
        ? request.selPeriode
        : `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    // Tanggal awal bulan
    const date = new Date(periode);
    const awal = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-01`;

    // Tanggal akhir bulan
    const akhir = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}`;

    const getDetailLaporan = await axios.get(
      `https://presensi.simeuluekab.go.id/manage/rekap/perorangan/pdf/${satker}/${uuid}/${awal}/${akhir}`,
      {
        headers: {
          Accept: "*/*",
          Cookie: data.token,
        },
      }
    );

    const detailLaporan = cheerio.load(getDetailLaporan.data);

    const dataTable = [];
    detailLaporan("table.data tr").each((id, elem) => {
      const cells = detailLaporan(elem).find("td");
      if (cells.length > 0) {
        const rowData = cells
          .map((i, cell) => detailLaporan(cell).text().trim())
          .get(); // Mengubah hasil map menjadi array
        dataTable.push(rowData);
      }
    });

    const dataRekap = [];

    detailLaporan("table.ringkasan tr").each((id, elem) => {
      const cells = detailLaporan(elem).find("td");
      if (id > 0) {
        const rowData = cells
          .map((i, cell) => detailLaporan(cell).text().trim())
          .get(); // Mengubah hasil map menjadi array
        dataRekap.push(rowData);
      }
    });

    return NextResponse.json({
      status: true,
      default: {
        uuid: uuid,
        satker: satker,
        periode: periode,
      },
      data: { table: dataTable, rekap: dataRekap },
      daftarSKPK: daftarSKPK,
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
