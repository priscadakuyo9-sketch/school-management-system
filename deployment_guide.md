# 🚀 Guide Déploiement EduManage (Mise en Ligne)

Votre établissement est prêt à passer au niveau mondial ! Ce guide vous explique comment héberger chaque partie de votre projet gratuitement (ou à faible coût) de manière professionnelle.

---

## 1️⃣ Étape 1 : La Base de Données (Supabase)
Le backend a besoin d'une base de données PostgreSQL accessible sur le web.
1. Allez sur **[Supabase.com](https://supabase.com/)** et créez un projet.
2. Allez dans **Project Settings > Database** et copiez votre **Connection String (URI)**.
3. Gardez-la de côté pour l'étape suivante.

---

## 2️⃣ Étape 2 : Le Backend (Hébergement de l'API)
Pour que votre serveur réponde aux requêtes 24h/24, utilisez **[Render.com](https://render.com/)** ou **Railway.app**.
1. Créez un compte sur Render.
2. Liez votre compte GitHub/GitLab et importez le dossier `backend`.
3. Configurez les variables d'environnement (**Environment Variables**) sur Render :
   * `DATABASE_URL` : (Celle copiée de Supabase)
   * `JWT_SECRET` : (Une chaîne de caractères longue et aléatoire)
   * `PORT` : 10000 (Render le gère automatiquement)
4. **Commandes de lancement** : 
   * Build Command : `npm install && npm run build`
   * Start Command : `npm start`
5. Une fois déployé, copiez votre URL (ex: `https://edumanage-api.onrender.com/`).

---

## 3️⃣ Étape 3 : Le Dashboard Web (Frontend sur Vercel)
Pour que votre tableau de bord soit ultra-rapide.
1. Allez sur **[Vercel.com](https://vercel.com/)**.
2. Importez le dossier `frontend`.
3. Ajoutez une variable d'environnement (**Environment Variables**) lors du déploiement :
   * `VITE_API_URL` : (L'URL de votre backend Render suivie de `/api`)
   * *Exemple : `https://edumanage-api.onrender.com/api`*
4. Cliquez sur **Deploy**. C'est fait ! Votre dashboard est en ligne.

---

## 4️⃣ Étape 4 : L'Application Mobile (EAS Build)
Pour créer et distribuer votre application iOS et Android.
1. Allez dans le dossier `mobile`.
2. Installez le CLI de build d'Expo :
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. Configurez le projet pour le build :
   ```bash
   eas build:configure
   ```
4. Lancez le build pour générer un lien d'installation (APK pour Android) :
   ```bash
   eas build --platform android --profile preview
   ```
5. Distribuez le lien généré à vos élèves et parents !

---

### ✅ Checklist Finale de Sécurité
* [ ] Votre `JWT_SECRET` est complexe et tenu secret.
* [ ] Vous n'avez pas poussé vos fichiers `.env` sur un repo public (GitHub).
* [ ] Vos instances de base de données (Supabase) utilisent des mots de passe robustes.

**Félicitations ! Vous avez maintenant un établissement scolaire entièrement numérisé et accessible partout dans le monde.** 🌍🎒🎓
