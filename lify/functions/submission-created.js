// Trigger: form submission created
// File name must be submission-created.js for Netlify background event
import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || "{}"); // event.payload in older runtimes
    // Compat: parfois c'est event.body, parfois event.Records… selon runtime
    const data = payload?.data || {};
    const nom = data.nom || "";
    const prenom = data.prenom || "";
    const numero = data.numero || "";
    const email = data.email || "";

    if (!email) return { statusCode: 200, body: "No email provided, skip." };

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@example.com";
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY missing: skip email.");
      return { statusCode: 200, body: "No RESEND_API_KEY, email skipped" };
    }

    const subject = "Merci pour votre soumission ✅";
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
        <h2>Merci ${prenom ? prenom : ""} ${nom ? nom : ""} !</h2>
        <p>Nous avons bien reçu votre soumission pour le Programme Employeurs.</p>
        <p><strong>Récapitulatif</strong></p>
        <ul>
          <li>Nom: ${nom}</li>
          <li>Prénom: ${prenom}</li>
          <li>Numéro: ${numero}</li>
          <li>E-mail: ${email}</li>
        </ul>
        <p>Nous vous recontacterons très prochainement.</p>
      </div>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `Programme Employeurs <${FROM_EMAIL}>`,
        to: [email],
        subject,
        html
      })
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("Resend failed:", t);
      return { statusCode: 500, body: t };
    }
    return { statusCode: 200, body: "Email sent" };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: e.message };
  }
};
