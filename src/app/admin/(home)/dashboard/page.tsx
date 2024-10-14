'use client'
import Cookies from "js-cookie";

export default function Dashboard() {
  const token = Cookies.get("adminToken");
  console.log(token);
  return (
    <>
      <h1>{token}</h1>;
    </>
  );
}
