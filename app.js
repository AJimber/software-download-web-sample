const RELEASES_URL = "./data/releases.json";

const latestWindows = document.getElementById("latest-windows");
const latestMacos = document.getElementById("latest-macos");
const latestVersion = document.getElementById("latest-version");
const currentVersion = document.getElementById("current-version");
const currentDate = document.getElementById("current-date");
const currentPlatforms = document.getElementById("current-platforms");
const releasesList = document.getElementById("releases-list");
const releaseTemplate = document.getElementById("release-template");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

function setDisabledLink(element, label) {
  element.removeAttribute("href");
  element.classList.add("is-disabled");
  element.setAttribute("aria-disabled", "true");
  element.textContent = label;
}

function configureLink(element, url, label) {
  if (!url) {
    setDisabledLink(element, `${label} unavailable`);
    return;
  }

  element.href = url;
  element.textContent = label;
}

function getPlatforms(release) {
  return [
    release.downloads.windows ? "Windows" : null,
    release.downloads.macos ? "macOS" : null
  ].filter(Boolean);
}

function renderLatestRelease(release) {
  const platforms = getPlatforms(release);

  currentVersion.textContent = release.version;
  currentDate.textContent = dateFormatter.format(new Date(release.date));
  currentPlatforms.textContent = platforms.length ? platforms.join(" + ") : "No links";
  latestVersion.textContent = `Latest published version: ${release.version}`;

  configureLink(
    latestWindows,
    release.downloads.windows,
    `Download ${release.version} for Windows`
  );
  configureLink(
    latestMacos,
    release.downloads.macos,
    `Download ${release.version} for macOS`
  );
}

function renderReleaseCard(release) {
  const fragment = releaseTemplate.content.cloneNode(true);
  const releaseVersionElement = fragment.querySelector(".release-version");
  const releaseDateElement = fragment.querySelector(".release-date");
  const releaseNotesElement = fragment.querySelector(".release-notes");
  const windowsLink = fragment.querySelector(".windows-link");
  const macosLink = fragment.querySelector(".macos-link");

  releaseVersionElement.textContent = release.version;
  releaseDateElement.textContent = dateFormatter.format(new Date(release.date));

  release.notes.forEach((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    releaseNotesElement.appendChild(item);
  });

  configureLink(windowsLink, release.downloads.windows, "Windows");
  configureLink(macosLink, release.downloads.macos, "macOS");

  releasesList.appendChild(fragment);
}

async function loadReleases() {
  try {
    const response = await fetch(RELEASES_URL);

    if (!response.ok) {
      throw new Error(`Could not load ${RELEASES_URL}`);
    }

    const { releases } = await response.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      throw new Error("No releases configured.");
    }

    renderLatestRelease(releases[0]);
    releases.forEach(renderReleaseCard);
  } catch (error) {
    latestVersion.textContent =
      "Could not load the download history. Check data/releases.json.";
    currentVersion.textContent = "--";
    currentDate.textContent = "--";
    currentPlatforms.textContent = "--";
    setDisabledLink(latestWindows, "Windows unavailable");
    setDisabledLink(latestMacos, "macOS unavailable");
    releasesList.innerHTML =
      '<p class="latest-version">No releases available yet.</p>';
    console.error(error);
  }
}

loadReleases();
