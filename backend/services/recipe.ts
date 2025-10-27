import { pool } from "../connect";

// Get all recipes with reactions for a specific user
const getAll = async (
  filters: string[],
  values: any[],
  userId: number,
  limit: number,
  offset: number
) => {
  // build the shared FROM+JOIN+WHERE part
  let query = `
    FROM recipe r
    LEFT JOIN reactions re
      ON r.id = re.recipe_id AND re.user_id = ?
  `;

  if (filters.length) {
    query += " WHERE " + filters.join(" AND ");
  }

  const totalRecipes = `SELECT COUNT(DISTINCT r.id) AS total ${query}`;
  const [countRows] = await pool.query(totalRecipes, [userId, ...values]);
  const total = (countRows as any)[0]?.total ?? 0;

  // 2) fetch paginated rows
  const dataSql = `
    SELECT
      r.id AS recipe_id,
      r.title,
      r.instruction,
      r.ingredient,
      r.image,
      r.category,
      re.reaction,
      re.user_id AS reacted_user_id,
      re.created_at AS reaction_created_at,
      re.updated_at AS reaction_updated_at
    ${query}
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(dataSql, [userId, ...values, limit, offset]);

  return { total, rows };
};

// Get single recipe with reaction of a specific user
const getSingle = async (id: number, userId: number) => {
  const sql = `
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.instruction,
      r.ingredient,
      r.image,
      r.category,
      re.reaction,
      re.user_id AS reacted_user_id,
      re.created_at AS reaction_created_at,
      re.updated_at AS reaction_updated_at
    FROM recipe r
    LEFT JOIN reactions re 
      ON r.id = re.recipe_id AND re.user_id = ?
    WHERE r.id = ?
  `;

  const [rows] = await pool.query(sql, [userId, id]);
  return (rows as any)[0];
};

const createSingle = async (
  title: string,
  ingredient: string,
  instruction: string,
  category: string,
  userId: number,
  imageUrl: string | null
) => {
  const [result] = await pool.query(
    "INSERT INTO recipe ( user_id, title, ingredient, instruction, category, image) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, title, ingredient, instruction, category, imageUrl]
  );

  return result;
};

const updateSingle = async (
  id: string,
  title: string,
  ingredient: string,
  instruction: string,
  category: string,
  userId: number,
  imageUrl: string | null
) => {
  const [result] = await pool.query(
    "UPDATE recipe SET title = ?, ingredient = ?, instruction = ?, category = ?, image = ? WHERE id = ? AND user_id = ?",
    [title, ingredient, instruction, category, imageUrl, id, userId]
  );

  return result;
};

const deleteSingle = async (id: string, userId: number) => {
  const [result] = await pool.query("DELETE FROM recipe WHERE id = ? AND user_id = ?", [
    id,
    userId,
  ]);

  return result;
};

const recipeReaction = async (reaction: string, recipeId: string, userId: string) => {
  const [result] = await pool.query(
    `INSERT INTO reactions (reaction, recipe_id, user_id) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         reaction = VALUES(reaction), 
         updated_at = CURRENT_TIMESTAMP`,
    [reaction, recipeId, userId]
  );
  return result;
};

export const recipeService = {
  getAll,
  getSingle,
  createSingle,
  updateSingle,
  deleteSingle,
  recipeReaction,
};
