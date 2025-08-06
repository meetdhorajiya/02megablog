// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({
            message: "Logout successful",
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}