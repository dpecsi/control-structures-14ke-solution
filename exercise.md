# JSX gyakorló feladat — „🎬 Filmajánló"

## A feladat célja

A JSX-ben használható elágazások és ciklusok gyakorlása egyetlen, rövid oldalon. A feladat végére
mind a hat technikát használni fogod, amit a demó bemutat:

| Technika               | Hol használod majd?                         |
| ---------------------- | ------------------------------------------- |
| `if` a `return` előtt  | a köszöntő szöveg összeállítása             |
| ternáris operátor      | a bejelentkezés állapota és a gomb felirata |
| `&&`                   | a kedvelések számának megjelenítése         |
| `map()`                | a filmek listája                            |
| `for` a `return` előtt | a kiválasztott film csillagai               |
| `\|\|` és `??`         | a hiányzó filmleírás pótlása                |

Segédlet: `JSX-CONTROL-STRUCTURES.md`.

## Játékszabályok

**Használható:**

- egyetlen fájl: `app/page.tsx`, a legelső sorában `"use client";`
- a `useState` hook
- Tailwind CSS osztályok
- a **daisyUI** kész osztályai (`btn`, `btn-primary`, `btn-outline`, …) — már be van kötve az
  `app/globals.css`-ben, a gomboknál ezzel sokkal gyorsabb a formázás

**Nem használható (nem kell hozzá):**

- `useEffect`, `useRef`, `useContext`, Zustand vagy bármilyen globális store
- külön komponensekre bontás (szándékosan maradjon egy fájlban)
- backend, API route, adatbázis

## A kész alkalmazás felépítése

Egy középre igazított kártyán, egymás alatt:

1. **Fejléc:** „🎬 Filmajánló" cím, alatta a köszöntés.
2. **Bejelentkezés:** az állapot szövege és egy gomb, aminek a felirata is az állapottól függ.
3. **Filmlista:** a filmek kattintható kártyákként, a kiválasztott kiemelve.
4. **Részletek:** a kiválasztott film címe, éve, csillagai és leírása. Ha nincs kiválasztott film,
   egy „Válassz egy filmet!" szöveg.
5. **Kedvelés:** egy gomb, és mellette a kedvelések száma — de csak ha már van legalább egy.

## Adatok

Ez **konstans**, nem állapot — a komponens **fölött** definiáld. A tömb elemeinek a típusát is
add meg közvetlenül a tömb fölött, és használd is (`const MOVIES: Movie[] = [...]`):

```tsx
type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  description: string | null; // lehet null is, ezért nem elég a "string"!
};

const MOVIES: Movie[] = [
  {
    id: 1,
    title: "A Gyűrűk Ura",
    year: 2001,
    rating: 5,
    description: "Egy hobbit és a Gyűrű hosszú útja Mordorba.",
  },
  { id: 2, title: "Mátrix", year: 1999, rating: 4, description: "" },
  { id: 3, title: "Csillagok között", year: 2014, rating: 5, description: null },
  { id: 4, title: "Hupikék törpikék", year: 2011, rating: 2, description: "Törpikék New Yorkban." },
];
```

> **Miért érdemes típust írni?** A `Movie[]` típusmegadással a szerkesztő azonnal szól, ha
> elgépelsz egy mezőnevet vagy kihagysz egyet a tömbben, és a `movie.` után fel is kínálja a
> mezőket. A `description` típusa `string | null`, mert a 3. filmnél `null` szerepel — enélkül a
> TypeScript hibát jelezne.
>
> Figyeld meg: a 2. film leírása **üres szöveg** (`""`), a 3. filmé pedig `null`. A 6. lépésben
> pont ezen a két filmen fog látszani a `||` és a `??` közötti különbség.

---

## 1. lépés — Előkészítés és állapotok

Töröld ki az `app/page.tsx` tartalmát, és hozz létre egy `HomePage` komponenst `"use client";`
direktívával. Vedd fel a `Movie` típust és a `MOVIES` konstanst a komponens fölé, majd készítsd el
az állapotokat:

- `isLoggedIn` — logikai, kezdőértéke `false`
- `selectedId` — a kiválasztott film azonosítója, kezdőértéke `null`
- `likes` — szám, kezdőértéke `0`

Indítsd a fejlesztői szervert: `npm run dev` → http://localhost:8080

## 2. lépés — Köszöntés `if`-fel, a `return` előtt

A JSX-be nem írhatunk `if` utasítást, ezért a döntést előre meghozzuk, és az eredményt egy
változóba tesszük:

```jsx
let greeting = "Jelentkezz be az ajánlóhoz!";
if (isLoggedIn) {
  greeting = "Üdv újra itt! Íme a filmajánló.";
}
```

A `return`-ben már csak ki kell írni: `{greeting}`.

## 3. lépés — Bejelentkezés a ternáris operátorral

Írd ki az állapotot és készíts egy gombot. **Mindkettő** a ternáris operátort használja:

```
<p>Állapot: {isLoggedIn ? "bejelentkezve ✅" : "kijelentkezve ⛔"}</p>
<button onClick={() => setIsLoggedIn((prev) => !prev)}>
  {isLoggedIn ? "Kijelentkezés" : "Bejelentkezés"}
</button>
```

A ternáris operátor a JSX-beli `if-else`: azért állhat a kapcsos zárójelek között, mert
**kifejezés** (van értéke), nem utasítás.

## 4. lépés — A filmek listája `map()`-pel

A `MOVIES` tömbön `.map()`-pel készíts egy-egy kattintható kártyát (`<button>`), amin a film címe
és éve látszik. Kattintásra állítsd be a `selectedId`-t.

```
{MOVIES.map((movie) => (
  <button key={movie.id} onClick={() => setSelectedId(movie.id)}>
    {movie.title} ({movie.year})
  </button>
))}
```

A `key` prop **kötelező**, és legyen egyedi — itt a film `id`-ja. Az indexet ne használd hozzá.

A kiválasztott film objektumát **származtatott értékként** keresd ki, ne tedd külön állapotba:

```jsx
const selectedMovie = MOVIES.find((movie) => movie.id === selectedId);
```

## 5. lépés — Csillagok `for` ciklussal, a `return` előtt

A JSX-be `for` ciklust sem írhatunk, ezért az elemeket előre legyártjuk egy tömbbe:

```jsx
const stars = [];
if (selectedMovie) {
  for (let i = 1; i <= selectedMovie.rating; i++) {
    stars.push(
      <span key={i} className="text-2xl text-yellow-500">
        ★
      </span>,
    );
  }
}
```

A `return`-ben már csak „kiírjuk" a tömböt: `{stars}`. A `key` itt is kötelező!

A részletek blokkban ternáris operátorral döntsd el, mi jelenjen meg:

- ha van kiválasztott film → a címe, éve, a csillagai és a leírása,
- ha nincs → „Válassz egy filmet!" szöveg.

## 6. lépés — A hiányzó leírás pótlása: `||` és `??`

A kiválasztott film leírását írd ki **kétszer**, hogy látszódjon a különbség:

```
<p>|| → {selectedMovie.description || "Nincs leírás. (||)"}</p>
<p>?? → {selectedMovie.description ?? "Nincs leírás. (??)"}</p>
```

Kattints végig a filmeken, és figyeld meg:

| Film             | `description` | `\|\|`          | `??`            |
| ---------------- | ------------- | --------------- | --------------- |
| A Gyűrűk Ura     | szöveg        | a leírás        | a leírás        |
| Mátrix           | `""`          | **a pótszöveg** | **üres marad!** |
| Csillagok között | `null`        | a pótszöveg     | a pótszöveg     |

A `||` **minden** hamis értéket lecserél (`""`, `0`, `false`, `null`, `undefined`), a `??`
**csak** a `null`-t és az `undefined`-ot.

Segítségként írd ki a nyers értéket is: `{JSON.stringify(selectedMovie.description)}` — így az
üres szöveg (`""`) és a `null` is látszik.

## 7. lépés — Kedvelés `&&`-del

Készíts egy „👍 Tetszik" gombot, ami növeli a `likes` állapotot. A kedvelések számát **csak akkor**
írd ki, ha már van legalább egy:

```
{likes > 0 && <p>{likes} ember kedvelte.</p>}
```

> ⚠️ **Próbáld ki a leggyakoribb JSX-hibát!** Írd át egy percre `{likes && <p>...</p>}` alakra, és
> nézd meg, mi jelenik meg, amíg a `likes` értéke `0`. A `0` hamis érték, ezért a `&&` **őt** adja
> vissza — a React pedig a számokat kiírja, így egy csupasz `0` jelenik meg a képernyőn. Ezért
> kell mindig **logikai** feltételt írni: `likes > 0 &&`.

---

## Tailwind formázási feladatok

### T1. Gombok daisyUI-jal, kiválasztott film kiemelése

A gombokat ne „kézzel" formázd Tailwind-osztályokból, hanem használd a daisyUI kész
`btn` osztályait — így egy-két szó elég a hosszú osztálylista helyett:

| Gomb                      | Osztályok         |
| ------------------------- | ----------------- |
| Bejelentkezés             | `btn btn-primary` |
| 👍 Tetszik                | `btn btn-outline` |
| filmkártya (kiválasztott) | `btn btn-primary` |
| filmkártya (többi)        | `btn btn-outline` |

A filmkártyák mobilon 1, kis képernyőtől (`sm:`) 2 oszlopban jelenjenek meg
(`grid grid-cols-1 sm:grid-cols-2 gap-2`), a feliratuk pedig balra igazítva (`justify-start`).
A kiválasztott állapotot itt is **ternáris operátorral** döntsd el:

```
className={`btn justify-start ${movie.id === selectedId ? "btn-primary" : "btn-outline"}`}
```

### T2. Részletek és üres állapot

A részletek blokk legyen lekerekített, halvány hátterű doboz belső margóval
(`rounded-2xl bg-gray-50 p-4`), a film címe kiemelve (`text-xl font-bold`). A „Válassz egy
filmet!" szöveg legyen szürke és dőlt (`text-gray-400 italic`).

---

## Ellenőrző lista

- [ ] Nincs `if` vagy `for` a JSX-ben — mindkettő a `return` **előtt** fut le.
- [ ] A ternáris operátor két helyen is szerepel (állapot szövege, gomb felirata).
- [ ] A `&&` bal oldalán **logikai** feltétel áll (`likes > 0`), nem a szám maga.
- [ ] Minden `.map()`-nél és a csillagoknál is van egyedi `key`.
- [ ] A kiválasztott film származtatott érték (`find()`), nem külön állapot.
- [ ] A leírásnál látszik a `||` és a `??` közötti különbség.
- [ ] A `MOVIES` tömb a saját típusával (`Movie[]`) van deklarálva.
- [ ] A gombok daisyUI osztályokat (`btn`, `btn-primary`, `btn-outline`) használnak.
- [ ] A T1–T2 formázási feladatok elkészültek.

## Gyakori hibák

1. **`if` vagy `for` a JSX-ben.** `{if (x) ...}` szintaktikai hiba — a döntést vidd a `return` elé,
   vagy használj `? :`-t, `&&`-et, `map()`-et.
2. **A `0` kiíródik.** `{likes && ...}` helyett `{likes > 0 && ...}`.
3. **Hiányzó `key`.** A `map()`-nél és a `for` ciklusban gyártott elemeknél is kötelező.
4. **Objektum kiírása.** A `{selectedMovie}` hibát okoz — a React nem tud objektumot
   megjeleníteni. Írd ki a mezőit (`{selectedMovie.title}`), vagy használd a
   `{JSON.stringify(...)}` alakot.
5. **Függvény meghívása átadás helyett.** `onClick={setSelectedId(movie.id)}` azonnal lefut
   rendereléskor — helyesen `onClick={() => setSelectedId(movie.id)}`.

## Bónusz (opcionális)

- **Üres csillagok:** a `for` ciklus 5-ig menjen, és a `rating` fölötti csillagok legyenek
  halványszürkék (`★★★☆☆` hatás) — egy ternáris operátorral a ciklus belsejében.
- **Csak bejelentkezve:** a filmlista csak bejelentkezett állapotban látszódjon (`&&`), egyébként
  egy „Jelentkezz be a filmek megtekintéséhez!" szöveg jelenjen meg.
