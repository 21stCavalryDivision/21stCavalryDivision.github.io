import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  "assets",
  "screenshots"
);

const OUTPUT_FILE = path.join(
  process.cwd(),
  "assets",
  "screenshots.json"
);

const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif"
]);

const preferredOrder = [
  "Unitmax.png",
  "Aviation.png",
  "TrainingShot.png",
  "Armor.png",
  "Training.png",
  "Arty.png",
  "SRTraining.png",
  "BradleyFire.png",
  "GunRun.png",
  "LilBirdFire.png"
];

const customTitles = {
  "Unitmax.png": "Operation Photo",
  "Aviation.png": "Aviation",
  "TrainingShot.png": "Ground Operations",
  "Armor.png": "Armor Operations",
  "Training.png": "Unit Training",
  "Arty.png": "Artillery Support",
  "SRTraining.png": "Small Unit Training",
  "BradleyFire.png": "Bradley Live Fire",
  "GunRun.png": "Aviation Gun Run",
  "LilBirdFire.png": "Little Bird Fire Mission"
};

const customSubtitles = {
  "Unitmax.png": "21st Cavalry Division",
  "Aviation.png": "Air Cavalry Operations",
  "TrainingShot.png": "Maneuver Element",
  "Armor.png": "Mounted Element",
  "Training.png": "Readiness & Qualification",
  "Arty.png": "Combined Arms Fires",
  "SRTraining.png": "Team & Squad Tactics",
  "BradleyFire.png": "Armor Gunnery",
  "GunRun.png": "Air Support",
  "LilBirdFire.png": "Aviation Detachment"
};

function makeTitle(filename) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");

  return withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, character =>
      character.toUpperCase()
    );
}

const entries = await readdir(
  SCREENSHOT_DIR,
  {
    withFileTypes: true
  }
);

let files = entries
  .filter(entry => entry.isFile())
  .map(entry => entry.name)
  .filter(filename =>
    ALLOWED_EXTENSIONS.has(
      path.extname(filename).toLowerCase()
    )
  );

files.sort((a, b) => {
  const aIndex = preferredOrder.indexOf(a);
  const bIndex = preferredOrder.indexOf(b);

  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }

  if (aIndex !== -1) {
    return -1;
  }

  if (bIndex !== -1) {
    return 1;
  }

  return a.localeCompare(
    b,
    undefined,
    {
      numeric: true,
      sensitivity: "base"
    }
  );
});

const manifest = files.map(filename => {
  const title =
    customTitles[filename] ||
    makeTitle(filename);

  return {
    file: filename,
    src: `assets/screenshots/${encodeURIComponent(filename)}`,
    title,
    subtitle:
      customSubtitles[filename] ||
      "21st Cavalry Division",
    alt: `21st Cavalry Division ${title}`,
    caption: title
  };
});

await writeFile(
  OUTPUT_FILE,
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

console.log(
  `Media gallery updated: ${manifest.length} image(s).`
);

console.log(
  `Manifest written to: ${OUTPUT_FILE}`
);
