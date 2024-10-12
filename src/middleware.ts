
import {NextResponse } from "next/server"


export default function middleware() {
    console.log("middleware")
    return NextResponse.next()
}

