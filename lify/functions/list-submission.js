// Liste toutes les soumissions du formulaire "employeur-inscription"
import fetch from "node-fetch";

export const handler = async () => {
  try {
    const token = process.env.NETLIFY_API_TOKEN;
    const siteId = process.env.SITE_ID;
    if (!token || !siteId) {
      return { statusCode: 500, body: JSON.stringify({ error: "Env NETLIFY_API_TOKEN or SITE_ID missing" }) };
    }

    // 1) Récupérer les formulaires du site
    const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!formsRes.ok) throw new Error("Cannot fetch forms");
    const forms = await formsRes.json();
    const form = forms.find(f => f.name === "employeur-inscription");
    if (!form) return { statusCode: 200, body: JSON.stringify({ items: [] }) };

    // 2) Récupérer les soumissions de ce formulaire
    const subsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!subsRes.ok) throw new Error("Cannot fetch submissions");
    const subs = await subsRes.json();

    // Normaliser datamap
    const items = subs.map(s => ({
      id: s.id,
      created_at: s.created_at,
      data: {
        nom: s.data?.nom || "",
        prenom: s.data?.prenom || "",
        numero: s.data?.numero || "",
        email: s.data?.email || "",
        photo: s.data?.photo || ""
      },
      files: s.files || {}
    }));

    return { statusCode: 200, body: JSON.stringify({ items }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
