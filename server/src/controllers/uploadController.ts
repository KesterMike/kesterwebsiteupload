// controllers/media.controller.ts
import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import Media from "../models/media.model";
import { unlinkSync } from "fs";

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const { title, description, tags, category, problem, solution, link } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded." });
    }

    // ✅ Fix tag formatting
    let formattedTags: string[] = [];
    if (typeof tags === "string") {
      formattedTags = tags.split(",").map((tag: string) => tag.trim());
    } else if (Array.isArray(tags)) {
      formattedTags = tags;
    }

    const uploadResults = await Promise.all(
      files.map((file) => cloudinary.uploader.upload(file.path, { folder: "media-uploads" }))
    );
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const newMedia = await Media.create({
      title,
      description,
      tags: formattedTags,
      category,
      problem,
      solution,
      link,
      images: imageUrls,
    });

    res.status(201).json({ message: "Upload successful!", data: newMedia });

  } catch (error: any) {
    console.error("UPLOAD ERROR:", error.message); // ✅ log actual reason
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ✅ GET SINGLE UPLOAD
export const getSingleUpload = async (req: Request, res: Response) => {
  try {
    const upload = await Media.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found." });
    }
    res.json({ data: upload });
  } catch (error) {
    res.status(500).json({ message: "Error fetching upload.", error });
  }
};

// ✅ DELETE UPLOAD
export const deleteUpload = async (req: Request, res: Response) => {
  try {
    const upload = await Media.findByIdAndDelete(req.params.id);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    // Optional: delete Cloudinary images here using public_id if stored
    res.json({ message: "Upload deleted", data: upload });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ EDIT UPLOAD
export const editUpload = async (req: Request, res: Response) => {
  try {
    const { title, description, category, problem, solution, link, tags } = req.body;
    const existingImages = req.body.existingImages || [];
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    let allImages: string[] = [];

    // Add retained existing images
    if (typeof existingImages === "string") {
      allImages = [existingImages];
    } else if (Array.isArray(existingImages)) {
      allImages = [...existingImages];
    }

    // Upload new images to Cloudinary
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "media-uploads" })
        )
      );
      const newUrls = uploadResults.map((res) => res.secure_url);
      allImages.push(...newUrls);
    }

    const updated = await Media.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        tags: parsedTags,
        problem,
        solution,
        link,
        images: allImages,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Upload not found" });
    }

    res.json({ message: "Upload updated", updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update upload", error });
  }
};
