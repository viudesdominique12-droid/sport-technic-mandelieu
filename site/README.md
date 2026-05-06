# Sport Technic Mandelieu — site

Site one-page pour le garage **Sport Technic Mandelieu**, spécialiste indépendant Mercedes-Benz & Smart à Mandelieu-la-Napoule.

## Lancer en local

Le site a besoin d'un serveur HTTP qui supporte **HTTP Range requests** (pour le scrubbing vidéo). Le `python -m http.server` standard NE FONCTIONNE PAS — utiliser le serveur fourni :

```bash
cd "Sport Technic Mandelieu Specialiste Mercedes & Smart"
python3 serve.py
# → http://127.0.0.1:5173
```

## Stack

- HTML statique, CSS pur, JS vanilla (zéro build).
- [GSAP](https://gsap.com/) + [Lenis](https://lenis.darkroom.engineering/) chargés via CDN pour le smooth-scroll.
- Vidéo `assets/hero.mp4` jouée par scroll (currentTime piloté par `getBoundingClientRect`).
- Animations de reveal via IntersectionObserver (robuste, pas de dépendance scroll).

## Structure

```
site/
├── index.html             ← page principale
├── styles/main.css        ← stylesheet
├── scripts/main.js        ← interactions
└── assets/
    ├── hero.mp4           ← vidéo cinématique scroll-bound
    └── poster.jpg         ← frame de fallback
```

## Sections

1. **Hero scroll-bound** — la vidéo joue en suivant le scroll, avec 3 paliers de texte révélés par paliers de progression.
2. **Marquee** — bandeau défilant.
3. **Manifeste** — texte d'intro animé mot-par-mot + signature légale.
4. **Spécialités** — 2 cards Mercedes / Smart.
5. **Atelier** — 4 étapes de prise en charge + grille de services.
6. **Stats** — 4 compteurs animés (16 ans, 344+ avis, 4,8/5, 2 marques).
7. **Avis** — rail horizontal de 7 reviews, chacune cliquable vers la fiche Google Maps.
8. **Contact** — téléphone, mail, adresse, horaires (statut "ouvert maintenant" calculé en JS), iframe Google Maps.
9. **Footer** — navigation + mentions légales (SIRET, RCS, dirigeants).

## Données

Toutes les infos affichées proviennent de l'extraction multi-sources (`../content/extraction-sport-technic-mandelieu/business_summary.json`). Aucune n'est inventée. Les champs à valider avec le client sont listés dans `missing_or_to_confirm_with_client` du JSON.

Les avis affichés sont des **paraphrases représentatives** des thèmes récurrents — pas des verbatims authentiques. Les vrais avis sont consultables en cliquant n'importe quelle card → ouvre la fiche Google Business.
