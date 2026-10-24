/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​‌​‌​​‌​​‌​​‌‌​​‌​​‌​​‌​​​​​‌‌​‌​‌​​‌​‌‌​‌​‌​​​​‌​​‌‌​​‌‌‌​‌‌‌​​‌‌​‌​​​‌‌​​​‌‌​​‌‌​‌​​​‌​​​‌‌‌​​‌​​​‌‌​‌​‌​​‌‌​‌​​​‌‌​​‌​‌​‌​​‌​​​​‌‌​‌​​​​​‌‌​​‌​​‌‌​‌‌‌‌​​‌‌​​​​​​‌‌‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.5I2H5-BgsF3Dr54eHh2o08
 */

/* The hobby page, as data.
 *
 * REVISION 7 rebuilt this from the ground up on instruction, and what
 * it removed matters as much as what it added.
 *
 * GONE: completion. Every earlier version of this file was organised
 * around having FINISHED things — "Finished, not sampled", a completed
 * board, a separate "played but not finished" list, a note explaining
 * the difference. All of it is removed. The brief is now simply: if it
 * is in the library and has been opened, it is on the page.
 *
 * GONE: comparison and hours. No playtime, no bar chart, no
 * most-played ranking, no counts per genre set against each other, no
 * perfect-game percentages, no achievement totals. A hobby is not a
 * scoreboard, and the moment a number appears next to a game the page
 * invites a comparison nobody asked for.
 *
 * WHAT ORGANISES IT NOW: genre. One axis, fifteen segments, every game
 * in exactly one of them.
 *
 * WHY THE GENRES ARE HAND-ASSIGNED. Steam's own `genres` field was
 * fetched and is unusable for this: 121 of these games come back
 * "Action", 95 "Adventure", 58 "Indie", and there is NO puzzle genre
 * at all — so Portal, The Room, Superliminal and Viewfinder arrive
 * labelled "Adventure" or "Casual". Steam's genres are storefront
 * shelves, not descriptions. Since the owner specifically asked for
 * the puzzle and detective games to be visible, that data could not
 * deliver the one thing the page is for.
 *
 * Puzzle and Detective lead the list. Not because they are the
 * biggest segments — Action-adventure is three times the size — but
 * because they are the ones the owner named, twice, as what he
 * actually likes: games that make you think and solve something.
 *
 * SOURCES, and why two are needed. The list is the union of the
 * author's own supplied list and his Steam library, because neither
 * is a superset of the other. Steam holds games the supplied list
 * omitted; the supplied list holds console-only titles Steam has
 * never seen — God of War II, Spider-Man (2002), GTA Liberty City
 * Stories, Ghost of Tsushima, the Last of Us pair. 219 games after
 * de-duplication.
 *
 * Read from the Steam Web API on 2026-10-24: 205 owned, 169 opened at
 * least once, 36 never launched. The 36 are not listed — "in my
 * library and I have opened it" was the stated bar, and an unopened
 * game clears no bar at all. Six entries were dropped as not being
 * games: Crosshair X, Wallpaper Engine, Aimlabs, Reflex, Lossless
 * Scaling and Soundpad. Crosshair X alone had 133 hours on it, which
 * is exactly why a playtime threshold is a bad filter and a judgement
 * about what counts as a game is a good one.
 *
 * One correction worth recording: an earlier pass expanded the
 * author's "S.P.L.I.T" to "Split Fiction", reasoning from a showcase
 * appearance. The full library shows BOTH `s.p.l.i.t` and `Split
 * Fiction` as separate titles he has played. The expansion was wrong
 * and both are listed. */

export type GameGenre = {
  id: string;
  genre: string;
  titles: string[];
};

export const BY_GENRE: GameGenre[] = [
  {
    id: "puzzle",
    genre: "Puzzle",
    titles: [
      "Draw the Road",
      "Grapples Galore",
      "HOLE",
      "Human Fall Flat",
      "MECCHA CHAMELEON",
      "Pico Park",
      "Portal",
      "Portal 2",
      "s.p.l.i.t",
      "Scene Investigators",
      "Superliminal",
      "The Exit 8",
      "The Farmer Was Replaced",
      "The Room",
      "The Room 4: Old Sins",
      "The Room Three",
      "The Room Two",
      "Unheard",
      "Viewfinder",
      "Zup! Z",
    ],
  },
  {
    id: "detective-mystery",
    genre: "Detective & mystery",
    titles: [
      "Sherlock Holmes Chapter One",
      "Sherlock Holmes The Awakened",
      "Sherlock Holmes: Crimes and Punishments",
      "Sherlock Holmes: The Devil's Daughter",
      "The Guest",
      "The Painscreek Killings",
      "Thief of Thieves: Season One",
    ],
  },
  {
    id: "action-adventure-open-world",
    genre: "Action-adventure & open world",
    titles: [
      "Assassin's Creed Black Flag",
      "Assassin's Creed Brotherhood",
      "Assassin's Creed II",
      "Assassin's Creed Mirage",
      "Assassin's Creed Odyssey",
      "Assassin's Creed Origins",
      "Assassin's Creed Revelations",
      "Assassin's Creed Rogue",
      "Assassin's Creed Shadows",
      "Assassin's Creed Syndicate",
      "Assassin's Creed Valhalla",
      "Atomic Heart",
      "Batman: Arkham Asylum",
      "Batman: Arkham City",
      "Batman: Arkham Knight",
      "Batman: Arkham Origins",
      "Days Gone",
      "Deadpool",
      "Dying Light",
      "Dying Light 2",
      "Dying Light: The Beast",
      "Ghost of Tsushima",
      "God of War 2018",
      "God of War II",
      "God of War Ragnarök",
      "Grand Theft Auto I",
      "Grand Theft Auto II",
      "Grand Theft Auto IV",
      "Grand Theft Auto Liberty City Stories",
      "Grand Theft Auto V",
      "Guardians of the Galaxy",
      "Just Cause 2",
      "Just Cause 3",
      "Just Cause 4",
      "Mafia",
      "Mafia II",
      "Mafia III",
      "Mafia: The Old Country",
      "Middle-earth: Shadow of Mordor",
      "Middle-earth: Shadow of War",
      "Red Dead Redemption 2",
      "Remember Me",
      "Rise of the Tomb Raider",
      "Ruiner",
      "Shadow of the Tomb Raider",
      "Sleeping Dogs",
      "Spider-Man 2002",
      "Spider-Man 2007",
      "Spider-Man Miles Morales",
      "Spider-Man Shattered Dimensions",
      "Star Wars Jedi: Fallen Order",
      "Star Wars Jedi: Survivor",
      "The Last of Us Part I",
      "The Last of Us Part II",
      "Tomb Raider",
      "Total Overdose",
      "Uncharted 4",
      "Uncharted The Lost Legacy",
      "Watch Dogs",
      "Watch Dogs 2",
    ],
  },
  {
    id: "shooters",
    genre: "Shooters",
    titles: [
      "007 First Light",
      "Apex Legends",
      "ARC Raiders",
      "Battlefield 6",
      "Black Mesa",
      "Call of Duty: Modern Warfare",
      "Call of Duty: Modern Warfare 2",
      "Call of Duty: Modern Warfare 3",
      "Call of Juarez Gunslinger",
      "Counter-Strike 2",
      "Crime Boss: Rockay City",
      "Crysis 2 Remastered",
      "Crysis 3 Remastered",
      "Crysis Remastered",
      "Delta Force",
      "DOOM",
      "DOOM 64",
      "DOOM Eternal",
      "Far Cry 4",
      "Far Cry 5",
      "Hard Reset",
      "Killing Floor",
      "Killing Floor 2",
      "Marvel Rivals",
      "Prey",
      "PUBG: Battlegrounds",
      "RoboCop: Rogue City",
      "Severed Steel",
      "Spectre Divide",
      "THE FINALS",
      "Titanfall 2",
    ],
  },
  {
    id: "narrative-walking-sims",
    genre: "Narrative & walking sims",
    titles: [
      "Alan Wake",
      "Beyond: Two Souls",
      "Control",
      "Detroit: Become Human",
      "Dispatch",
      "Fahrenheit: Indigo Prophecy Remastered",
      "Firewatch",
      "Gone Home",
      "Heavy Rain",
      "Outer Wilds",
      "Quantum Break",
      "Subnautica",
      "The Stanley Parable",
      "The Walking Dead",
      "Virginia",
      "What Remains of Edith Finch",
    ],
  },
  {
    id: "horror",
    genre: "Horror",
    titles: [
      "Amnesia: The Dark Descent",
      "Backrooms",
      "Backrooms: Escape Together",
      "Buckshot Roulette",
      "Dead Space",
      "Deceit",
      "Escape the Backrooms",
      "Evil Dead",
      "Ghostwire: Tokyo",
      "Gravewood High",
      "Helltaker",
      "Lethal Company",
      "Little Nightmares II",
      "Panicore",
      "Phasmophobia",
      "R.E.P.O.",
      "SOMA",
      "Supermarket Together",
      "The Callisto Protocol",
      "The Outlast Trials",
    ],
  },
  {
    id: "racing-driving",
    genre: "Racing & driving",
    titles: [
      "ACE COMBAT 7: Skies Unknown",
      "American Truck Simulator",
      "Asphalt Legends",
      "Assetto Corsa",
      "Assetto Corsa Competizione",
      "DCS World",
      "DiRT Rally 2.0",
      "Euro Truck Simulator 2",
      "F1 25",
      "Forza Horizon 4",
      "iRacing",
      "Need for Speed Heat",
      "Need for Speed Hot Pursuit",
      "Need for Speed Most Wanted",
      "Need for Speed Most Wanted (2005)",
      "Need for Speed Payback",
      "The Crew 2",
    ],
  },
  {
    id: "platformer-metroidvania",
    genre: "Platformer & metroidvania",
    titles: [
      "Ghostrunner",
      "Ghostrunner 2",
      "GRIS",
      "Hades",
      "Hollow Knight",
      "Mirror's Edge Catalyst",
      "Morbid Metal",
      "Stick Fight: The Game",
      "Stick It to the Man",
      "Stick It to the Stickman",
      "Ultimate Chicken Horse",
    ],
  },
  {
    id: "rpg",
    genre: "RPG",
    titles: [
      "Cyberpunk 2077",
      "Hogwarts Legacy",
      "Kingdom Come: Deliverance",
      "Mass Effect",
      "Project Zomboid",
      "Skyrim",
      "The Witcher 2: Assassins of Kings",
      "The Witcher 3: Wild Hunt",
      "Where Winds Meet",
    ],
  },
  {
    id: "soulslike-action-combat",
    genre: "Soulslike & action-combat",
    titles: [
      "Black Myth: Wukong",
      "Devil May Cry 5",
      "Devil May Cry DmC",
      "Sekiro: Shadows Die Twice",
      "Sifu",
    ],
  },
  {
    id: "co-op-party",
    genre: "Co-op & party",
    titles: [
      "A Way Out",
      "Among Us",
      "Chained Together",
      "Garry's Mod",
      "Goose Goose Duck",
      "It Takes Two",
      "Mage Arena",
      "Pixel Gun 3D: PC Edition",
      "Rocket League",
      "Split Fiction",
    ],
  },
  {
    id: "stealth",
    genre: "Stealth",
    titles: [
      "Hitman",
      "Hitman 2",
      "Hitman 3",
      "Metal Gear Solid V: The Phantom Pain",
      "The Saboteur",
    ],
  },
  {
    id: "fighting",
    genre: "Fighting",
    titles: [
      "Injustice",
      "Injustice 2",
      "Mortal Kombat 11",
      "MultiVersus",
    ],
  },
  {
    id: "simulation-sandbox",
    genre: "Simulation & sandbox",
    titles: [
      "Arma 3",
      "GeoGuessr",
    ],
  },
  {
    id: "sports",
    genre: "Sports",
    titles: [
      "EA Sports FC 25",
      "Golf With Your Friends",
    ],
  },
];

/* The three he keeps coming back to.
 *
 * Called out above the genre list rather than left to be found inside
 * it, because a favourite is a different kind of fact from a library
 * entry: the list says what he has played, this says what he chooses.
 * All three are also unfinishable — competitive and sim racing have no
 * ending to reach — so they would be the three rows in the list where
 * "played" means something different from everywhere else.
 *
 * No hours, no ranking, no order of preference. The brief for this
 * page was no comparison, and three favourites with numbers against
 * them is a comparison with extra steps. */
export type Favourite = {
  id: string;
  title: string;
  /** What it is, in two or three words. Not a review. */
  kind: string;
};

export const FAVOURITES: Favourite[] = [
  { id: "iracing", title: "iRacing", kind: "Sim racing" },
  { id: "the-finals", title: "THE FINALS", kind: "Shooter · Destruction" },
  { id: "valorant", title: "VALORANT", kind: "Tactical shooter" },
];

/** Every game on the page, counted off the segments. */
export const GAME_COUNT = BY_GENRE.reduce(
  (sum, g) => sum + g.titles.length,
  0
);

/* The other hobbies. The page is "Hobby", not "Games" — the owner
   describes himself as someone who paints and does digital art as
   well, and a page that lists 219 games under that title while
   mentioning neither is a page with the wrong name.
 *
 * Kept as three short cards rather than prose: they are facts about a
 * person, not a portfolio of work, and there is no gallery behind them
 * to link to. If artwork is ever added, these become the entry points
 * to it. */
export type Pursuit = {
  id: string;
  title: string;
  body: string;
  icon: string;
};

export const PURSUITS: Pursuit[] = [
  {
    id: "painting",
    title: "Painting",
    body: "On paper and canvas, away from a screen — which is most of the appeal after a day spent looking at one.",
    icon: "layers",
  },
  {
    id: "digital-art",
    title: "Digital art",
    body: "The same instinct with an undo button. Mostly figures and hard-edged graphic work rather than painting imitated digitally.",
    icon: "code",
  },
  {
    id: "puzzles",
    title: "Puzzles",
    body: "The reason the first two segments below are puzzle and detective games. Perspective tricks, locked rooms, a case with enough evidence to actually solve it.",
    icon: "key",
  },
];

export const GAMING_COPY = {
  eyebrow: "Hobby",
  heading: "Off the clock",
  metaTitle: "Hobby — games, painting and puzzles",
  metaDescription:
    "What I do away from work: painting, digital art, puzzle and detective games, and a library of 219 games grouped by genre.",
  /* The introduction the owner asked for, in his own order: gaming
     first, then the other pursuits, then the thing that ties them
     together. No claim about finishing anything. */
  body: "I love gaming. Not one genre either — the list below runs from Assassin's Creed to truck simulators. Away from a screen I paint, and on one I do digital art. The games I come back to most are the ones that make you think: the Sherlock Holmes run, locked-room puzzles, and the perspective games like Viewfinder where the trick IS the mechanic.",
  librarySubhead: "Everything I have played, by genre",
  libraryNote:
    "Every game here is one I own and have actually opened — console titles included, which is why some of these are not on Steam at all. No completion percentages: this is a list of what I play, not a scoreboard.",
  pursuitsSubhead: "Away from the screen",
  favouritesSubhead: "The ones I keep coming back to",
} as const;
