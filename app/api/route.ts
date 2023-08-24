import { NextResponse } from "next/server";

export async function GET() {


  // const res = await fetch(url, {
  //   method,
  //   body: JSON.stringify(data),
  //   headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Content-Type': 'application/json',
  //   },
  // });

  // const r = await res.json()

  return NextResponse.json({ msg: 'get' })

}

export async function POST(request: Request) {
  const {
    url,
    method,
    data
  } = await request.json();

  const res = await fetch(url, {
    method,
    ...(data ? { body: JSON.stringify(data)} : {}),
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
  });

  const r = await res.json()

  return NextResponse.json(r)

}