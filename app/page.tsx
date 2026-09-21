"use client";

import { useState } from "react";

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

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [likes, setLikes] = useState<number>(0);

  let greeting = "Jelentkezz be az ajánlóhoz!";
  if (isLoggedIn) {
    greeting = "Üdv újra itt! Íme a filmajánló.";
  }

  const selectedMovie = MOVIES.find((movie) => movie.id === selectedId);

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

  return (
    <main className="flex min-h-screen items-start justify-center bg-gray-200">
      {/* ablak */}
      <div className="m-4 w-full max-w-lg space-y-5 rounded-xl bg-white p-4 shadow-xl">
        {/* cím és üdvözlés */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">🎬 Filmajánló</h1>
          <p>{greeting}</p>
        </div>
        {/* bejelentkezés */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
          <p>Állapot: {isLoggedIn ? "bejelentkezve ✅" : "kijelentkezve ⛔"}</p>
          <button className="btn btn-primary" onClick={() => setIsLoggedIn((prev) => !prev)}>
            {isLoggedIn ? "Kijelentkezés" : "Bejelentkezés"}
          </button>
        </div>
        {/* film kiválasztása */}
        <div className="grid gap-3 sm:grid-cols-2">
          {MOVIES.map((movie) => (
            <button
              className={`btn ${movie.id == selectedId ? "btn-primary" : "btn-outline"}`}
              key={movie.id}
              onClick={() => setSelectedId(movie.id)}
            >
              {movie.title} ({movie.year})
            </button>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-xl">
          {selectedMovie == null ? (
             <p>Válassz egy filmet!</p>
          ) : (
            <>
              <h2 className="text-xl font-bold">{selectedMovie.title} ({selectedMovie.year})</h2>
              <p>{stars}</p>
              <div className="font-mono">
                <p>|| → {selectedMovie.description || "Nincs leírás. (||)"}</p>
                <p>?? → {selectedMovie.description ?? "Nincs leírás. (??)"}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
