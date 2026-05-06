# Sport Technic Mandelieu

Site one-page pour **Sport Technic Mandelieu**, garage indépendant spécialiste Mercedes-Benz & Smart à Mandelieu-la-Napoule (06210). En activité depuis 2009, dirigé par Milos & Stéphanie Miletic.

📍 21 Avenue Jean Mermoz, 06210 Mandelieu-la-Napoule · 📞 04 93 47 22 98

---

## Stack

Site statique (zéro build), HTML + CSS + JS vanilla, [GSAP](https://gsap.com/) et [Lenis](https://lenis.darkroom.engineering/) chargés via CDN.

- **Desktop** : hero cinématique avec vidéo en scroll-binding (la vidéo joue image par image en suivant le scroll, façon Apple).
- **Mobile** : vidéo allégée (720p, 2,3 MB) en boucle de fond + narration de texte en 3 paliers déclenchée par le scroll.
- Animations de reveal via IntersectionObserver, smooth scroll Lenis, custom cursor, magnetic buttons, compteurs animés, rail d'avis Google.

## Lancer en local

```bash
python3 serve.py
# → http://127.0.0.1:5173
```

⚠️ Le serveur `python -m http.server` standard **ne fonctionne pas** car il ne supporte pas les `Range requests` HTTP, indispensables au scrubbing vidéo. `serve.py` les implémente.

## Structure

```
.
├── site/                                    ← le site déployé
│   ├── index.html
│   ├── styles/main.css
│   ├── scripts/main.js
│   └── assets/
│       ├── hero.mp4                         ← desktop (1080p, 30 MB)
│       ├── hero-mobile.mp4                  ← mobile (720p, 2,3 MB)
│       └── poster.jpg
│
├── content/extraction-sport-technic-mandelieu/   ← données sourcées
│   ├── business_summary.json                ← single source of truth
│   ├── INDEX.md                             ← fiche lisible
│   ├── _quality_report.md                   ← fiabilité par champ
│   └── CLAUDE.md
│
├── serve.py                                 ← serveur dev avec HTTP Range
└── .claude/launch.json                      ← config preview
```

## Données

Toutes les infos affichées sur le site proviennent de `content/extraction-sport-technic-mandelieu/business_summary.json`, lui-même bâti à partir d'une agrégation multi-sources (Google Maps, Pages Jaunes, Mappy, societe.com, Bottin, etc.). Chaque champ porte une `extraction_sources` qui trace son origine.

**Aucune information n'est inventée.** Les avis affichés sont des paraphrases représentatives — chaque card renvoie vers la fiche Google Maps pour les vrais verbatims.

## Déploiement

Site statique — déployable n'importe où qui supporte les `Range requests` HTTP : GitHub Pages, Vercel, Netlify, OVH, Apache, Nginx, Cloudflare Pages…

---

© SPORT TECHNIC MANDELIEU — SAS au capital de 10 000 € · SIRET 511 667 206 00011 · RCS Cannes · NAF 4520A
