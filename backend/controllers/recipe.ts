import { type Request, type Response } from "express";
import { recipeService } from "../services/recipe";
import { ApiError, serializeError } from "../utils/error";
import { deleteFromS3, getKeyFromUrl } from "../utils/s3Client";
import { handleFileUpload } from "../utils/files";

const getAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const allowedColumns = ["category", "title", "reaction"];
    const queryParams = req.query;

    const filters: string[] = [];
    const values: any[] = [];

    // filtration based on query params and allowed columns only
    Object.entries(queryParams).forEach(([key, value]) => {
      if (allowedColumns.includes(key) && value) {
        if (key === "title") {
          filters.push(`r.${key} LIKE ?`);
          const val = Array.isArray(value) ? value[0] : value;
          values.push(`%${String(val)}%`);
        } else if (key === "reaction") {
          filters.push(`re.${key} = ?`);
          values.push(value);
        } else {
          filters.push(`r.${key} = ?`);
          values.push(value);
        }
      }
    });

    const page = parseInt(queryParams.page as string) || 1;
    const limit = parseInt(queryParams.limit as string) || 8;
    const offset = (page - 1) * limit;

    const { total, rows: recipes } = await recipeService.getAll(
      filters,
      values,
      userId,
      limit,
      offset
    );
    res.status(200).json({
      page,
      limit,
      total,
      recipes,
    });
  } catch (error: any) {
    await serializeError(res, error);
  }
};

const getSingle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userId = (req as any).user.userId;
    const recipe = await recipeService.getSingle(Number(id), userId);
    if (!recipe) {
      throw new ApiError("Recipe not found", 404);
    }
    res.status(200).json({ recipe });
  } catch (error: any) {
    await serializeError(res, error);
  }
};

const create = async (req: Request, res: Response) => {
  const { title, ingredient, instruction, category } = req.body ?? {};

  try {
    if (!title || !ingredient || !instruction || !category) {
      throw new ApiError("All fields are required", 400);
    }

    let imageUrl: string | null = null;

    if (req.file) {
      imageUrl = await handleFileUpload(req.file);
    }

    const recipe = await recipeService.createSingle(
      title,
      ingredient,
      instruction,
      category,
      (req as any).user.userId,
      imageUrl
    );

    return res.status(201).json({
      message: "Recipe created",
      recipeId: (recipe as any).insertId,
    });
  } catch (error: any) {
    await serializeError(res, error);
  }
};

const update = async (req: Request, res: Response) => {
  const { title, ingredient, instruction, category } = req.body;
  const { id } = req.params;

  try {
    if (!id) throw new ApiError("Recipe ID is required", 400);
    if (!title || !ingredient || !instruction || !category) {
      throw new ApiError("All fields are required", 400);
    }

    const userId = (req as any).user.userId;

    const existing = await recipeService.getSingle(Number(id), userId);
    let imageUrl: string | null = null;

    if (req.file) {
      imageUrl = await handleFileUpload(req.file);

      // delete old S3 object if exists
      if (existing?.image) {
        const oldKey = getKeyFromUrl(existing.image);
        if (oldKey) {
          try {
            await deleteFromS3(oldKey);
          } catch (e) {
            console.warn("Failed to delete old s3 object", e);
          }
        }
      }
    }

    const recipe = await recipeService.updateSingle(
      id,
      title,
      ingredient,
      instruction,
      category,
      userId,
      imageUrl
    );

    if ((recipe as any).affectedRows === 0) {
      throw new ApiError("Recipe not found or unauthorized", 404);
    }

    res.status(200).json({ message: "Recipe updated" });
  } catch (error: any) {
    await serializeError(res, error);
  }
};
const deleteSingle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new ApiError("Recipe ID is required", 400);
    }

    const rows = await recipeService.deleteSingle(id);

    if ((rows as any).affectedRows === 0) {
      throw new ApiError("Recipe not found or unauthorized", 404);
    }

    res.status(200).json({ message: "Recipe deleted" });
  } catch (error: any) {
    await serializeError(res, error);
  }
};

// New controller for handling reactions

const createReaction = async (req: Request, res: Response) => {
  try {
    const { reaction } = req.body ?? {};
    const recipeId = req.params.id; // recipe id from route
    const userId = (req as any).user?.userId;

    if (!reaction) {
      throw new ApiError("Reaction is required", 400);
    }

    if (!userId) {
      throw new ApiError("Unauthorized: user not logged in", 401);
    }

    if (!["like", "dislike"].includes(reaction)) {
      throw new ApiError("Invalid reaction type", 400);
    }

    const result = await recipeService.recipeReaction(reaction, recipeId, (req as any).user.userId);

    return res.status(201).json({
      message: "Reaction saved successfully",
      affectedRows: (result as any).affectedRows,
    });
  } catch (error: any) {
    await serializeError(res, error);
  }
};

export const recipeController = {
  getAll,
  getSingle,
  create,
  update,
  deleteSingle,
  createReaction,
};
