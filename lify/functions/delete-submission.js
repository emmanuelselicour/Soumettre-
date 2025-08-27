// netlify/functions/delete-submission.js
import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const token = process.env.NETLIFY_API_TOKEN || "nfp_Vi9ecVV6LHeewxV2W1pQAZCYGGmU2rSHac32";
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
    return { statusCode: 204, body: "" };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: e.message };
  }
};
