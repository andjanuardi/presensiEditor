"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearchengin } from "react-icons/fa6";

export default function Laporan() {
  const [dataTable, setDataTable] = useState([]);
  const [dataPerhitungan, setPerhitungan] = useState([]);
  const [daftarSKPK, setDaftarSKPK] = useState([]);
  const [daftarPegawai, setDaftarPegawai] = useState([]);
  const [selSatker, setSelSatker] = useState("");
  const [selPeriode, setSelPeriode] = useState("");
  const [selPegawai, setSelPegawai] = useState("");

  const getDataLaporan = async () => {
    const data = (
      await axios.post("/api/laporan", { selSatker, selPeriode, selPegawai })
    ).data;
    if (data.status) {
      setDataTable(data.data.table);
      setPerhitungan(data.data.rekap);
      setDaftarSKPK(data.daftarSKPK);
      setSelSatker(data.default.satker);
      setSelPeriode(data.default.periode);
      setSelPegawai(data.default.uuid);
      getDataPegawai(data.default.satker, data.default.periode);
    }
  };

  async function getDataPegawai(satker, periode) {
    try {
      const { data } = await axios.post("/api/daftarPegawai", {
        satker,
        periode,
      });
      if (data.status) {
        setDaftarPegawai(data.data);
      }
    } catch (error) {
      return;
    }
  }

  async function bersihkan() {
    const res = [];
    dataTable
      .filter(
        (data) =>
          data[9] === "T-KET" || data[9] === "T-MSK" || data[9] === "T-PLG"
      )
      .map((data) => {
        const [year, month, day] = data[2].split("-");
        const formattedDate = `${day}-${month}-${year}`;
        const isFriday = new Date(formattedDate).getDay() === 5;

        res.push({
          satker: selSatker,
          pegawai: daftarPegawai.find((data) => data.uuid === selPegawai) || {},
          tanggal: data[2],
          masuk: `07:${Math.floor(Math.random() * 25) + 35}`, // Angka acak antara 35-59
          pulang: isFriday
            ? `17:0${Math.floor(Math.random() * 10)}` // Angka acak antara 0-9
            : `16:${Math.floor(Math.random() * 29) + 31}`, // Angka acak antara 31-59
        });
      });

    res.forEach(async (item, index) => {
      try {
        await axios.post("/api/manual", { item });
        if (res.length === index + 1) {
          getDataLaporan();
        }
      } catch (error) {
        return;
      }
    });
    // res.map(async (data) => {
    //   await axios.post("/api/manual", { data });
    // });
  }

  useEffect(() => {
    setDataTable([]);
    setPerhitungan([]);
    if (selSatker.length > 0 || selPeriode.length > 0) {
      getDataPegawai(selSatker, selPeriode);
    }
  }, [selSatker, selPeriode]);

  useEffect(() => {
    getDataLaporan();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="font-black">REKAPITULASI PERORANGAN</h1>
      </div>
      <div className="border flex items-center rounded-lg pl-3">
        <span className="whitespace-nowrap">SKPD :</span>
        <select
          className="select w-full"
          value={selSatker}
          onChange={(e) => setSelSatker(e.currentTarget.value)}
        >
          {daftarSKPK.map((data, key) => (
            <option key={key} value={data.value}>
              {data.text}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3">
        <div className="border rounded-lg pl-3 ">
          Periode :
          <input
            className="input"
            lang="id"
            type="month"
            value={selPeriode}
            onChange={(e) => setSelPeriode(e.currentTarget.value)}
          />
        </div>
        <div className="border flex items-center rounded-lg pl-3 flex-1">
          <span className="whitespace-nowrap">NAMA :</span>
          <select
            className="select w-full"
            value={selPegawai}
            onChange={(e) => setSelPegawai(e.currentTarget.value)}
          >
            <option>--Pilih--</option>
            {daftarPegawai.map((data, key) => (
              <option key={key} value={data.uuid}>
                {data.nama}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-circle btn-outline"
          onClick={() => getDataLaporan()}
        >
          <FaSearchengin />
        </button>
      </div>
      <button className="btn" onClick={() => bersihkan()}>
        Gasken :)
      </button>
      <table className="table table-xs">
        <thead>
          <tr>
            <th rowSpan="2">NO.</th>
            <th rowSpan="2">HARI</th>
            <th rowSpan="2">TANGGAL</th>
            <th rowSpan="2">MASUK</th>
            <th colSpan="2">TELAT MASUK</th>
            <th rowSpan="2">PULANG</th>
            <th colSpan="2">CEPAT PULANG</th>
            <th rowSpan="2">KET</th>
          </tr>
          <tr>
            <th>Jam</th>
            <th>Menit</th>
            <th>Jam</th>
            <th>Menit</th>
          </tr>
        </thead>
        <tbody>
          {dataTable.map((data, key) => (
            <tr key={key}>
              {data.map((item, itemKey) => (
                <td className={itemKey === 0 ? "w-0" : ""} key={itemKey}>
                  {item}
                </td>
              ))}
            </tr>
          ))}
          {!dataTable.length && (
            <tr>
              <td>Tidak Ada Data</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <h1 className="font-black">PERHITUNGAN</h1>
        <table className="table table-xs">
          <tbody>
            {dataPerhitungan.map((data, key) => (
              <tr key={key}>
                {data.map((item, itemKey) => (
                  <td key={itemKey}>{item}</td>
                ))}
              </tr>
            ))}
            {!dataPerhitungan.length && (
              <tr>
                <td>Tidak Ada Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
