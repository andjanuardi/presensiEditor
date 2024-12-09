"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHouse, FaKey, FaPen, FaPrint, FaUser } from "react-icons/fa6";
import { MdMenu } from "react-icons/md";
export default function Navbar() {
  const [activeLogin, setActiveLogin] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const { data } = await axios.post("/api/auth", {
        username: formData.get("username"),
        password: formData.get("password"),
      });

      if (data) {
        alert("Selamat Datang");
        document.location.reload();
      }
    } catch {
      alert("Opps Terjadi Kesalahan");
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");

      if (data) {
        alert("Berhasil Logout");
        document.location.reload();
      }
    } catch {
      alert("Opps Terjadi Kesalahan");
    }
  };

  const getLoginData = async () => {
    try {
      const { data } = await axios.get("/api/auth/status");
      setActiveLogin(data);
    } catch {
      alert("Gagal mendapatkan data login");
    }
  };

  useEffect(() => {
    getLoginData();
  }, []);
  return (
    <div className="navbar bg-neutral text-neutral-content rounded-lg shadow-xl pr-5">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-neutral lg:hidden">
            <MdMenu />
          </div>
          <Menu
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          />
        </div>
        <a className="btn btn-ghost text-xl">PRESENSI EDITOR</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <Menu className="menu menu-horizontal px-1" />
      </div>
      <div className="navbar-end">
        {!activeLogin.status && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm">
              <FaKey /> Login
            </div>
            <form
              onSubmit={handleLogin}
              tabIndex={0}
              className="menu  dropdown-content rounded-box z-[1] p-5 shadow bg-white text-black flex flex-col gap-2 mt-2"
            >
              <div className="text-lg font-black text-center">LOGIN</div>
              <label className="input input-bordered flex items-center gap-2">
                <FaUser />
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  name="username"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <FaKey />
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  name="password"
                />
              </label>
              <button type="submit" className="btn">
                Login
              </button>
            </form>
          </div>
        )}
        {activeLogin.status && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm">
              <FaUser /> {activeLogin.data.username}
            </div>
            <div
              tabIndex={0}
              className="menu  dropdown-content rounded-box z-[1] shadow bg-white text-black flex flex-col gap-2 mt-2"
            >
              <button
                type="submit"
                className="btn"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Menu({ className }) {
  const listMenu = [
    {
      label: "Profil",
      link: "#",
      icon: <FaHouse />,
    },
    {
      label: "Manual",
      link: "#",
      icon: <FaPen />,
    },
    {
      label: "Laporan",
      link: "/laporan",
      icon: <FaPrint />,
    },
  ];
  return (
    <ul className={`${className} gap-2`}>
      {listMenu.map((item, key) => (
        <li key={key}>
          <Link
            href={item.link}
            className="hover:bg-base-300 text-black lg:text-white  lg:hover:bg-base-100 hover:text-black"
          >
            {item.icon} {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
