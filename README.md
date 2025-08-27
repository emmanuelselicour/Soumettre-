# True-Manno • Booster de vues WhatsApp

Projet prêt pour **Netlify** avec **Netlify Forms** (formulaire “inscriptions”), **admin** pour lister/rechercher/exporter/supprimer, et **merci** pour bloquer la page de succès par défaut.

## DÉPLOIEMENT
1. Créez un nouveau site Netlify (ou glissez-déposez le dossier).
2. Vérifiez que **Netlify Forms** détecte le formulaire “inscriptions” (après le premier envoi).
3. Dans l’admin (admin.html), les données sont lues via **API Netlify** (token exposé côté client).

> ⚠️ **SÉCURITÉ** : votre token API et mot de passe admin se trouvent côté client (visibles). Pour sécuriser:
> - Utilisez des **Netlify Functions** comme proxy (stockez le token en variable d’environnement).
> - Ajoutez une auth (Netlify Identity) pour l’admin.
> - Changez souvent le token si vous le laissez en frontal.

### Variables intégrées (démo)
- `SITE_ID = 68ae6ed558338b00088302f7`
- `NETLIFY_TOKEN = nfp_15mLDnoA46wB94Bk8CP1irt7rHD2tYya7f29`
- `ADMIN_PASSWORD = 04004749`

## FONCTIONNALITÉS
- UI moderne (Tailwind CDN), fond animé **9 bulbes/sec**.
- Formulaire: Nom/Prénom/Numéro WhatsApp + **upload multiple** (CSV/VCF/Excel/Images).
- **Redirection** vers `thank-you.html` pour éviter la page de remerciement par défaut.
- **Détection de doublon** de numéro via API Netlify (avant envoi).
- **Admin**: recherche (nom/prénom/numéro), numérotation des lignes, export **CSV** & **vCard (.vcf)**, suppression unitaire et globale avec **confirmation par mot de passe**, affichage des pièces jointes.
- **Open Graph** pour un joli aperçu (WhatsApp broadcast).

## REMARQUES
- La suppression et la liste utilisent l’API Netlify (CORS/Tokens requis). S’il y a des erreurs CORS, passez par une **Function** (proxy).
