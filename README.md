# web-kit

Librairie web réutilisable d'iaba pour monter des sites de génération de leads à haut niveau de design, vite et de manière répétable. Chaque nouveau site (un marché, une verticale) se compose à partir de ces briques: on swappe la marque et les visuels, le niveau reste.

## Structure

```
motion/tokens.css   couleurs, fontes, rythme, garde-fous accessibilité (on swappe la marque ici)
motion/engine.js    moteur motion: Lenis (smooth scroll) + GSAP ScrollTrigger, piloté par attributs data
assets/             visuels partagés
index.html          page démo du kit (montre le vocabulaire d'effets)
blocks/             blocs validés, autoportants
  hero-slider.html    hero plein écran, slider de segment qui pilote le grade + le storytelling
  triangle-duel.html  triangle de sécurité interactif + duel comparatif animé
examples/
  patrimlia-home.html page d'accueil complète (beta Patrimlia), exemple d'assemblage
```

## Le moteur, piloté par attributs (aucun JS à écrire par page)

Charger dans la page, dans cet ordre, puis `motion/engine.js`:

```html
<link rel="stylesheet" href="motion/tokens.css">
<!-- ... contenu ... -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="motion/engine.js"></script>
```

Attributs disponibles sur n'importe quel élément:

| attribut | effet |
|---|---|
| `data-reveal="0.1"` | apparition fade + montée au scroll (délai optionnel en s) |
| `data-reveal-group` | apparition en cascade des enfants directs |
| `data-parallax="0.2"` | parallaxe vertical (force 0 à 1) |
| `data-tilt="7"` | inclinaison 3D au survol (pointeur) |
| `data-count="1000000"` (+ `data-euro`) | compteur animé à l'entrée |
| `data-pin` sur une `<section>` | section figée + scrub de la timeline interne (la signature) |

Signature pin: dans la section `data-pin`, `[data-pin-num]` reçoit le capital animé, `[data-pin-bar]` la barre, `[data-pin-peak]` le visuel qui monte.

## Garde-fous intégrés

- `prefers-reduced-motion` respecté (tout devient fixe et visible).
- fallback si le JS ou GSAP ne charge pas: le contenu reste visible (progressive enhancement).
- animations sur `transform` et `opacity` uniquement (fluide, pas de jank).

## Déploiement

Les blocs se compilent en widgets HTML autoportants, intégrables dans Elementor (WordPress) ou servis en statique. GSAP est gratuit (y compris ScrollTrigger), Lenis est open source.
