import { useState } from "react";
import { siteImageUrl } from "../../api/images";

const profileSrc = siteImageUrl("profileCat.jpg");

// Placeholder copy: replace with the real introduction.
const paragraphs = [
  "Hi, I'm the reader behind Readings Pattern. I'm happiest with a warm drink, a soft blanket, and a story I can't put down.",
  "Here I share honest thoughts on the books I read, from the ones that stayed with me for weeks to the ones that weren't quite for me, so you can find your next favorite.",
];

export default function AboutMe() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section aria-labelledby="about-heading" className="card grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[3fr_2fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-berry-600">About me</p>
        <h2 id="about-heading" className="mt-1 text-3xl text-ink-900">A little about the reader</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-ink-700">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-xs">
        {imageFailed ? (
          <div
            aria-hidden
            className="flex aspect-[3/4] w-full items-center justify-center rounded-[2rem] bg-gradient-to-br from-frost-200 to-ember-100 text-6xl"
          >
            📚
          </div>
        ) : (
          <img
            src={profileSrc}
            alt="Portrait of the reviewer"
            onError={() => setImageFailed(true)}
            className="aspect-[3/4] w-full rounded-[2rem] object-cover shadow-cozy ring-4 ring-frost-50"
          />
        )}
      </div>
    </section>
  );
}
