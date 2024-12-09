import axios from "axios";
import * as cheerio from "cheerio";
import { cookies } from "next/headers";

export async function POST(req) {
  const request = await req.json();

  let res = {};
  let zarc_csrf = "";
  let cookie = "";

  try {
    for (let index = 0; index < 2; index++) {
      var options = {
        method: "POST",
        url: "https://presensi.simeuluekab.go.id/auth/login/",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookie,
        },
        data: {
          username: request.username,
          password: request.password,
          zarc_csrf: zarc_csrf,
        },
      };
      await axios.request(options).then(async (e) => {
        if (e.data.success) {
          const profil = await getProfil(cookie, zarc_csrf);
          res = {
            status: true,
            token: cookie,
            profil: profil,
            message: "berhasil login",
          };
        } else {
          zarc_csrf = e.data.zarc_csrf;
          cookie = e.headers["set-cookie"];
          res = { status: false, token: e.data, message: "kesalahan login" };
        }
      });
    }
  } catch (error) {
    res = { status: false, token: null, message: "error" };
  }
  return Response.json(res);
}

async function getProfil(token, zarc_csrf) {
  const cookieStore = await cookies();
  let ret = {};
  try {
    await axios
      .get("https://presensi.simeuluekab.go.id/manage/", {
        headers: {
          Accept: "*/*",
          Cookie: token,
        },
      })
      .then((e) => {
        const $ = cheerio.load(e.data);
        const username = $("div.user-name").first().text();
        const email = $("div.user-info").first().text();
        const level = $("div.header-info-content strong").first().text();

        ret = {
          username: username,
          email: email,
          level: level,
          token: token,
          zarc_csrf: zarc_csrf,
        };
        cookieStore.set("login", JSON.stringify(ret));
      });
  } catch (error) {
    ret = {};
  }

  return ret;
}
