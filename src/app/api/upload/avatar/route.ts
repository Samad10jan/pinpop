import cloudinary from "@/src/lib/services/cloudinary";
import { NextResponse } from "next/server";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const POST = async (req: Request) => {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No file" }, { status: 400 });
    
    if (file.size > MAX_SIZE)
      return NextResponse.json(
        { error: "File must be less than 10MB" },
        { status: 400 }
      );
    
      if (!["image/jpeg", "image/png"].includes(file.type)) return NextResponse.json({ error: "Only images allowed" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "fixel/avatars",
          resource_type: "image"
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      ).end(buffer);
    });
    // return NextResponse.json(uploadResult );

    return NextResponse.json({ url: uploadResult.secure_url });

  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
