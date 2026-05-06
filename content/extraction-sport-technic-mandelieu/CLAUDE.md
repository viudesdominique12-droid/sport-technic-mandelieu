# Extraction — Sport Technic Mandelieu

## Type détecté
**🔨 artisan** (garage automobile spécialiste Mercedes & Smart, NAF 4520A)

## Source
Fiche Google Business : https://maps.app.goo.gl/UrmPARUGtB4K1CTKA
→ résolue vers : `Sport Technic Mandelieu Specialiste Mercedes & Smart`
(coords 43.5697588, 6.9445751 — Mandelieu-la-Napoule, 06210)

## Particularité de cette extraction
**Le script `site_extractor.py` n'a PAS été utilisé** : le client n'a pas
de site web officiel à extraire. Toute l'information vient de l'agrégation
multi-sources (Google Maps, Pages Jaunes, Mappy, societe.com, etc.).

→ Aucun dossier `images/` rempli automatiquement. Les photos devront être
fournies par le client OU extraites manuellement depuis sa fiche Google
Business (14 photos disponibles selon les sources).

## Fichiers
- [`business_summary.json`](business_summary.json) — toutes les infos consolidées et sourcées
- [`INDEX.md`](INDEX.md) — résumé lisible pour humain
- [`_quality_report.md`](_quality_report.md) — fiabilité par champ + ce qui manque

## Règle d'or pour la refonte
**Zéro hallucination.** Tous les champs portent une `extraction_sources`
dans le JSON. Si une info n'y figure pas, NE PAS L'INVENTER — me demander.

Les avis clients agrégés sont des **paraphrases** (pas des citations
Google authentiques) : à ne pas publier comme verbatim. Pour avoir les
vrais verbatims, le client doit exporter ses avis depuis sa fiche Google
My Business.

## Ce qui manque pour démarrer la refonte
Voir `missing_or_to_confirm_with_client` dans le JSON. Les 3 plus
critiques :
1. **Logo HD** + **photos atelier/équipe** (le client n'a pas de site,
   donc rien à scraper — il faut soit qu'il fournisse, soit récupérer
   les 14 photos de sa fiche Google Business)
2. **Liste officielle des prestations** (le JSON propose une liste
   inférée du code NAF + spécialisation, mais à valider)
3. **Modèles Mercedes/Smart pris en charge** (Classe A à S ? AMG ?
   utilitaires Vito/Sprinter ? Smart EQ ?)
