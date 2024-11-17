import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function GET(request: NextRequest) {
    try {
        // Get list of all files in the group
        const files = await pinata.files.list().group("0193394e-b683-7aee-af8a-2807cd0d92db");

        // Create signed URLs for each file
        const receiptsWithUrls = await Promise.all(
            files.files.map(async (file) => {
                const url = await pinata.gateways.createSignedURL({
                    cid: file.cid,
                    expires: 3600,
                });
                return {
                    ...file,
                    url
                };
            })
        );

        return NextResponse.json(receiptsWithUrls, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}