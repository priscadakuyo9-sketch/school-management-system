# 🎓 EduManage - Système de Gestion Scolaire Global

Bienvenue dans votre nouvelle solution centralisée pour gérer votre établissement scolaire (Primaire, Collège, Lycée ou Université).

Ce projet est une solution **Full-Stack** complète comprenant :
1.  **Backend (API)** : Node.js, Express, Prisma & PostgreSQL.
2.  **Frontend (Dashboard Web)** : React, Vite & Tailwind CSS.
3.  **App Mobile (Élèves/Parents)** : React Native & Expo.

---

## 🚀 Guide de Démarrage Rapide

### 1. Pré-requis (Base de données)
Vous devez disposer d'une base de données **PostgreSQL**.
*   Éditez le fichier `backend/.env`.
*   Remplacez `DATABASE_URL` par votre lien de connexion réel.

### 2. Lancement du Serveur Backend (API)
Le backend gère l'authentification (JWT), les élèves, les professeurs et la finance.
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
*Le serveur démarrera sur `http://localhost:5000`.*

### 3. Lancement du Dashboard Web (Administrateur)
Interface premium pour la gestion quotidienne.
```bash
cd frontend
npm install
npm run dev
```
*L'interface sera accessible sur `http://localhost:5173`. Connectez-vous avec n'importe quel email pour la simulation.*

### 4. Lancement de l'Application Mobile
Pour que les parents et élèves suivent les notes et absences.
```bash
cd mobile
npm install
npx expo start
```
*Utilisez l'application **Expo Go** sur votre téléphone pour scanner le QR Code qui apparaîtra.*

---

## 📋 Fonctionnalités Prêtes
- **Authentification Premium** : Écran de connexion moderne sur Web et Mobile.
- **Gestion Élèves** : Liste complète avec statuts dynamiques et recherche.
- **Finances** : Suivi du CA, des impayés et historique des paiements.
- **Académique** : Emplois du temps hebdomadaires et fiches professeurs.
- **Planning** : Vue chronologique des cours par salle.

## 🛠️ Technologies utilisées
- **Frontend** : React, TailwindCSS, Lucide-React.
- **Backend** : Node.js, Prisma ORM, JWT, Bcrypt.
- **Database** : PostgreSQL.
- **Mobile** : React Native (Expo).

---
*Développé avec excellence pour une gestion scolaire sans faille.*
