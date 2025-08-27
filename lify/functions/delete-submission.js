// Supprime une soumission par ID
import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const token = process.env.NETLIFY_API_TOKEN;
    if (!token) return { statusCode: 500, body: "NETLIFY_API_TOKEN missing" };

    const id = (event.queryStringParameters || {}).id;
    if (!id) return { statusCode: 400, body: "Missing id" };

    const del = await fetch(`https://api.netlify.com/api/v1/submissions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!del.ok) {
      const txt = await del.text();
      throw new Error("Delete failed: " + txt);
    }
    return { statusCode: 204 };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: e.message };
  }
};
