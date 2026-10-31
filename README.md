# SAV – Fiche d'enregistrement des Bacheliers

Application mobile **hors ligne** (Android et iPhone). Les données restent dans le téléphone.
Mise en ligne gratuite sur GitHub → vous obtenez **un lien** à envoyer aux gens.

## Comment l'application s'installe (important)

- Un fichier APK ne s'installe **pas** sur iPhone, et l'App Store exige un Mac + 99 $/an.
- Solution retenue : **application web installable (PWA)**. On ouvre le lien, on appuie sur « Installer » / « Sur l'écran d'accueil » → l'icône **SAV** apparaît et l'application marche **sans internet**. Même méthode sur Android et iPhone, gratuite.
- Un vrai fichier APK Android est possible en option (étape 9).

---

## 1. Installer les 3 outils (une seule fois, sur l'ordinateur)

1. **Node.js** : aller sur https://nodejs.org → bouton vert **LTS** → ouvrir le fichier téléchargé → **Next** partout → **Install**.
2. **Git** : aller sur https://git-scm.com/downloads → télécharger pour votre système → **Next** partout (laisser les options par défaut) → **Install**.
3. **Compte GitHub** : https://github.com → **Sign up** → créer le compte → confirmer l'e-mail. Notez votre **nom d'utilisateur** (ex : `drkouassi`).

**Redémarrez l'ordinateur** (sinon VS Code ne verra pas les outils).

## 2. Ouvrir le projet dans VS Code

1. Décompresser le fichier `sav-bacheliers.zip` (clic droit → Extraire tout). Mettre le dossier `sav-bacheliers` dans **Documents**.
2. VS Code → menu **Fichier** → **Ouvrir un dossier…** → choisir `sav-bacheliers` → **Sélectionner un dossier** → « Oui, je fais confiance ».
3. Ouvrir le terminal : menu **Terminal** → **Nouveau terminal**. Une zone apparaît en bas : c'est là qu'on tape les commandes.
4. Vérifier : taper `node -v` puis Entrée → un numéro s'affiche (ex : `v22.1.0`). Taper `git --version` puis Entrée → un numéro s'affiche.

> **Erreur rouge « l'exécution de scripts est désactivée »** (Windows) : dans la barre du terminal, cliquer sur la petite flèche **v** à côté du **+** → choisir **Command Prompt**, puis recommencer.

## 3. Installer et tester sur l'ordinateur

Dans le terminal, taper (une commande à la fois, Entrée après chacune) :

```
npm install
```
Attendre 2 à 5 minutes (internet nécessaire). Des messages « warn » sont normaux. Seul un message qui commence par « npm error » est un problème.

```
npm run dev
```
Un lien `http://localhost:5173` s'affiche. **Ctrl + clic** dessus : l'application s'ouvre dans le navigateur. Tester : ajouter un bachelier, graphique, exports.
Pour arrêter : cliquer dans le terminal puis **Ctrl + C**.

Vérification finale avant la mise en ligne :
```
npm run build
```
Doit se terminer par `✓ built in …`. Sinon, copiez-moi le message d'erreur.

## 4. Envoyer le projet sur GitHub

### 4.1 Créer le dépôt (la « boîte » en ligne)
1. Sur https://github.com, connecté : cliquer **+** (en haut à droite) → **New repository**.
2. **Repository name** : `sav-bacheliers` (minuscules, exactement).
3. Cocher **Public** (obligatoire pour le lien gratuit).
4. **Ne rien cocher** d'autre (ni README, ni .gitignore, ni licence).
5. Cliquer **Create repository**.

> Public = le code est visible, **pas les données** des bacheliers (elles restent dans chaque téléphone).

### 4.2 Envoyer les fichiers
Dans le terminal de VS Code, taper ces commandes **une par une**.
Remplacer `VOTRE-NOM` par votre nom d'utilisateur GitHub, et le nom/e-mail par les vôtres :

```
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
git init
git add .
git commit -m "Première version"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM/sav-bacheliers.git
git push -u origin main
```

À la dernière commande, une fenêtre de connexion GitHub s'ouvre : **Sign in with your browser** → **Authorize**. Revenir dans VS Code : l'envoi se termine.
Actualiser la page du dépôt sur GitHub : les fichiers sont là.

## 5. Activer le site (obtenir le lien)

1. Sur GitHub, dans votre dépôt : **Settings** (onglet en haut) → **Pages** (menu à gauche).
2. Section **Build and deployment** → **Source** : choisir **GitHub Actions**.
3. Onglet **Actions** (en haut). Une ligne « Publier le site sur GitHub Pages » est en cours (point orange).
   - **Si elle est en rouge ✗** (arrive quand l'étape 2 est faite après l'envoi) : cliquer sur la ligne → **Re-run all jobs**.
4. Attendre le **✓ vert** (2 à 3 minutes).

**Votre lien :**
```
https://VOTRE-NOM.github.io/sav-bacheliers/
```
(nom d'utilisateur en minuscules). Ouvrez-le sur l'ordinateur pour vérifier.

## 6. Installer l'application sur le téléphone

**Ouvrir le lien avec internet, une première fois.** Attendre que la page s'affiche entièrement.

**Android (Chrome)**
1. Ouvrir le lien dans **Chrome**.
2. Menu **⋮** (3 points en haut à droite) → **Installer l'application** (ou **Ajouter à l'écran d'accueil**) → **Installer**.
3. L'icône **SAV** est sur l'écran d'accueil.

**iPhone (Safari obligatoire, pas Chrome)**
1. Ouvrir le lien dans **Safari**.
2. Bouton **Partager** (carré avec une flèche vers le haut, en bas) → faire défiler → **Sur l'écran d'accueil** → **Ajouter**.
3. L'icône **SAV** est sur l'écran d'accueil. **Toujours ouvrir l'application depuis cette icône.**

Test hors ligne : activer le mode avion → ouvrir SAV depuis l'icône → ça marche.

## 7. Envoyer le lien aux gens

Copier le lien de l'étape 5 et l'envoyer par WhatsApp, SMS ou e-mail. Chaque personne l'ouvre et l'installe (étape 6).

**Chaque téléphone a ses propres données.** Le lien partage l'application, pas les listes de bacheliers.

## 8. Mettre à jour l'application plus tard

Après toute modification des fichiers, dans le terminal :
```
git add .
git commit -m "Description de la modification"
git push
```
Le site se met à jour tout seul en 2–3 minutes (voir l'onglet **Actions**). Sur les téléphones : ouvrir l'application avec internet, la fermer complètement, la rouvrir (2 fois si besoin).

## 9. (Option) Fichier APK Android

1. Aller sur https://www.pwabuilder.com → coller votre lien (étape 5) → **Start**.
2. **Package for stores** → **Android** → **Generate Package** → télécharger le `.zip` → à l'intérieur : le fichier `.apk`.
3. Envoyer l'APK par WhatsApp. Sur le téléphone : l'ouvrir → autoriser « Installer des applications inconnues » → Installer.

Pas d'équivalent gratuit pour iPhone : utiliser l'étape 6.

---

## Sauvegarde des données (à faire régulièrement)

Onglet **Export** → **Sauvegarder** : crée un fichier `.json`. Gardez-le (WhatsApp, e-mail, Drive).
**Restaurer** : même écran, choisir le fichier. Sert aussi à copier les données vers un autre téléphone.

Si le téléphone est réinitialisé, ou si le navigateur/l'application est désinstallé(e), les données sont perdues sans sauvegarde. Sur iPhone, utiliser l'icône de l'écran d'accueil (sinon Safari peut effacer les données après 7 jours sans visite).

## Problèmes fréquents

| Problème | Solution |
|---|---|
| `npm` ou `git` « n'est pas reconnu » | Redémarrer l'ordinateur, rouvrir VS Code. Sinon réinstaller l'outil (étape 1). |
| `git push` : authentification refusée | Relancer la commande, choisir **Sign in with your browser**. |
| `git push` : « remote origin already exists » | Taper `git remote remove origin` puis refaire la ligne `git remote add origin …`. |
| Lien GitHub : page « 404 » | Étape 5 : vérifier **Source = GitHub Actions**, attendre le ✓ vert (onglet Actions). |
| Lien : page blanche | Le dépôt doit s'appeler exactement `sav-bacheliers`. Sinon, le lien est `https://VOTRE-NOM.github.io/NOM-DU-DEPOT/`. |
| Onglet Actions en rouge ✗ | Cliquer la ligne → lire l'erreur → me l'envoyer. Si « Pages not enabled » : étape 5, puis **Re-run all jobs**. |
| Export PDF/Word/PPT ne marche pas | La toute première fois, internet est nécessaire (téléchargement du module). Ensuite c'est hors ligne. |
| iPhone : l'export ouvre une fenêtre de partage | Normal : choisir **Enregistrer dans Fichiers** ou une application. |
| Mise à jour pas visible sur le téléphone | Ouvrir avec internet, fermer complètement l'application, rouvrir. |

## Ce qui a été corrigé

- **Code cassé (erreurs de compilation)** : paramètres manquants dans `export.ts`, `storage.ts`, `ExportPanel.tsx`, `StudentForm.tsx` (`data: AppConfig`).
- **Fichiers manquants ajoutés** : `main.tsx`, `vite.config.ts`, `tsconfig.json`, icônes, déploiement automatique GitHub.
- **Installable + hors ligne** : manifeste et service worker (PWA) ; icône SAV.
- **Icône du navigateur** : lien cassé dans `index.html` corrigé.
- **Word** : vrai fichier `.docx` (avant : HTML renommé en `.doc`).
- **PowerPoint** : vrai fichier `.pptx` (avant : HTML renommé en `.ppt`, illisible dans PowerPoint).
- **Excel** : statistiques en nombres (avant : texte), largeurs de colonnes, nom de feuille sécurisé.
- **CSV Access** : champs contenant `;` ou guillemets protégés (avant : colonnes décalées).
- **iPhone** : l'export passe par la feuille de partage (les téléchargements directs y sont peu fiables).
- **Graphique** : net sur écran de téléphone, défilement quand il y a beaucoup de bacheliers, étiquette « Moy » plus coupée.
- **Formulaire** : le champ Points peut être vidé ; valeur limitée à 0–1000 ; espaces inutiles supprimés.
- **Données** : validation au chargement (fichier corrompu = pas de plantage), stockage persistant demandé, **sauvegarde/restauration JSON** ajoutée.
- **Recherche** : inclut aussi CGQ/CGV ; message « Aucun résultat » distinct.
- **Écrans à encoche** : marges de sécurité haut/bas ; champs en 16 px (évite le zoom automatique iPhone).
- Dépendances inutilisées supprimées (Supabase, dnd-kit, etc.) : application plus légère.

## Structure du projet

```
sav-bacheliers/
├─ README.md                  ← ce guide
├─ package.json               ← liste des outils utilisés
├─ vite.config.ts             ← configuration + mode hors ligne
├─ index.html                 ← page d'entrée
├─ public/                    ← icônes de l'application
├─ .github/workflows/deploy.yml ← publication automatique sur GitHub
└─ src/
   ├─ main.tsx, App.tsx, types.ts, index.css
   ├─ components/ StudentForm, StudentTable, ChartView, ExportPanel
   └─ utils/ storage.ts (données), export.ts (PDF, Excel, Word, PPT, CSV, JSON)
```
