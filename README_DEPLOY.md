1) Crée un nouveau site sur Netlify -> drag & drop du dossier contenant ces fichiers.
2) Dans Site settings > Build & Deploy > Environment, ajoute :
   - NETLIFY_TOKEN = (ton personal access token)  -> utilisé par les fonctions (SECURE)
   - SITE_ID = 68ae6ed558338b00088302f7
3) Déploie. L'admin utilisera les fonctions (recommandé) — si tu veux tester vite sans config, tu peux cocher "mode direct" dans admin.html et coller ton token dans le champ (attention à la sécurité).
4) Vérifie dans Netlify > Forms que le formulaire `eds-contact` apparaît.

Astuce: ne laisse jamais ton token personnel dans un fichier public. Utilise les variables d'environnement Netlify (recommandé).
