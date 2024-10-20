'use client'
import Cookies from "js-cookie";

export default function Dashboard() {
  const token = Cookies.get("adminToken");
  const refreshToken = Cookies.get("adminRefreshToken");
  console.log(token);
  return (
    <>
      <h1>{token}</h1>;
      <h2 className="italic text-red-600">{refreshToken}</h2>
    </>
  );
}
