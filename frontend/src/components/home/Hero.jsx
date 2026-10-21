import { useState } from "react";
import { siteImageUrl } from "../../api/images";

const heroSrc = siteImageUrl("hero.jpg");

// Wide banner photo with the site title over it. Until hero.jpg exists, a soft palette gradient stands in.
export default function Hero() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="relative isolate overflow-hidden rounded-3xl shadow-cozy">
      {imageFailed ? (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-pine-700 via-pine-600 to-berry-600"
        />
      ) : (
        <img
          src={heroSrc}
          alt=""
          onError={() => setImageFailed(true)}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      {/* Darkens the bottom of the photo so the text stays readable */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/70 via-ink-900/25 to-transparent" />

      <div className="flex aspect-[4/3] flex-col justify-end p-6 sm:aspect-[21/9] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-frost-200">Welcome in</p>
        <h1 className="mt-2 max-w-2xl text-4xl text-frost-50 sm:text-5xl">Readings Pattern</h1>
        <p className="mt-3 max-w-xl text-frost-100 sm:text-lg">
          Honest reviews and quiet recommendations, one good book at a time.
        </p>
      </div>
    </section>
  );
}
