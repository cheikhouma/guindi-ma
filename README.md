#  Plateforme de Gestion des Établissements Scolaires

Une application web moderne pour la gestion et la recherche d'établissements scolaires au Sénégal, développée avec React, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### **Carte Interactive**
- Affichage des écoles sur une carte interactive (Leaflet/OpenStreetMap)
- Marqueurs colorés selon le niveau d'enseignement :
  - 🟡 **Jaune** : Écoles primaires
  - 🔴 **Rouge** : Collèges (secondaire)
  - 🟢 **Vert** : Lycées
- Filtres avancés par région, niveau, nombre d'étudiants, etc.

###  **Système d'Authentification**
- Connexion et inscription utilisateur
- Gestion des rôles (utilisateur/admin)
- Persistance des sessions

###  **Espace Utilisateur**
- Recherche et filtrage d'écoles
- Ajout d'écoles aux favoris
- Consultation des détails des établissements
- Chat intégré

###  **Espace Administrateur**
- Tableau de bord avec statistiques
- Ajout d'écoles avec géolocalisation
- Modification des informations existantes
- Gestion des images et infrastructures

###  **Interface Moderne**
- Design responsive et accessible
- Thème jaune/rouge/vert cohérent
- Animations et transitions fluides
- Support mobile optimisé

## 🚀 Installation et Lancement

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd project-java
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```

### 4. Ouvrir l'application
L'application sera accessible à l'adresse : **http://localhost:5173**

##  Structure du Projet

```
src/
├── components/
│   ├── Admin/           # Pages d'administration
│   ├── Auth/            # Pages de connexion/inscription
│   ├── Chat/            # Système de chat
│   ├── Favorites/       # Gestion des favoris
│   ├── Home/            # Page d'accueil
│   ├── Layout/          # Composants de mise en page
│   ├── Map/             # Carte interactive
│   ├── Search/          # Recherche d'écoles
│   └── School/          # Détails des écoles
├── data/
│   └── mockData.ts      # Données de test
├── hooks/
│   ├── useAuth.ts       # Gestion de l'authentification
│   └── useNavigation.ts # Navigation personnalisée
├── types/
│   └── index.ts         # Définitions TypeScript
└── App.tsx              # Composant principal
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes

### Cartographie
- **Leaflet** - Carte interactive
- **React-Leaflet** - Intégration React
- **OpenStreetMap** - Tiles de carte

### Gestion d'État
- **React Hooks** - État local
- **LocalStorage** - Persistance des données

## 👥 Comptes de Test

### Utilisateur Standard
- **Email** : `user@example.com`
- **Mot de passe** : `password123`

### Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`

## 🎯 Fonctionnalités Principales

### 🔍 Recherche et Filtrage
- Recherche par nom d'établissement
- Filtres par région, niveau, type
- Tri par note, nombre d'étudiants
- Recherche géolocalisée

### 📍 Géolocalisation
- Demande de permission de localisation
- Sélection manuelle sur la carte
- Coordonnées automatiques
- Marqueurs visuels distincts

### 💾 Gestion des Données
- Données mockées pour le développement
- Structure prête pour API backend
- Validation des formulaires
- Gestion des images

## 🎨 Thème et Design

### Palette de Couleurs
- **Jaune** (`#eab308`) : Écoles primaires
- **Rouge** (`#ef4444`) : Collèges
- **Vert** (`#10b981`) : Lycées
- **Bleu** (`#3b82f6`) : Interface admin

### Composants UI
- Design moderne avec gradients
- Animations et transitions
- Responsive design
- Accessibilité optimisée

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Build
npm run build        # Crée la version de production
npm run preview      # Prévisualise la version de production

# Linting
npm run lint         # Vérifie le code avec ESLint
npm run lint:fix     # Corrige automatiquement les erreurs

# Type checking
npm run type-check   # Vérifie les types TypeScript
```

## 📱 Compatibilité

- ✅ **Desktop** : Chrome, Firefox, Safari, Edge
- ✅ **Mobile** : iOS Safari, Chrome Mobile
- ✅ **Tablette** : iPad, Android

## 🚨 Fonctionnalités Avancées

### Carte Interactive
- Zoom et déplacement fluides
- Clustering des marqueurs
- Popups informatifs
- Géolocalisation automatique

### Système d'Authentification
- Gestion des sessions
- Protection des routes
- Rôles utilisateur/admin
- Persistance des données

### Interface Admin
- Dashboard avec statistiques
- Formulaires de création/édition
- Upload d'images
- Validation en temps réel

## 🔮 Évolutions Futures

- [ ] Intégration API backend
- [ ] Base de données MongoDB/PostgreSQL
- [ ] Système de notifications
- [ ] Export PDF des informations
- [ ] Application mobile (React Native)
- [ ] Système de commentaires et avis
- [ ] Intégration paiements
- [ ] Analytics et reporting

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation technique

---

**Développé avec ❤️ pour l'éducation au Sénégal** 