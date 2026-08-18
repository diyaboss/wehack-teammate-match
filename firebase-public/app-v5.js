(() => {
  "use strict";

  const routine = [5, 44, 78, 112, 22, 91, 60];
  let finalPayload = "";
  
  const decDust = document.querySelector(".decorative-dust");
  const normalBg = document.querySelector(".normal-background");
  const taxDoc = document.querySelector("#tax-document");
  let currentIdx = 0;

  let audioCtx = null;
  const playTwinkle = async () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") await audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc['fre' + 'quency'].setValueAtTime(1200, audioCtx.currentTime);
      osc['fre' + 'quency'].exponentialRampToValueAtTime(2400, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  const fragment = document.createDocumentFragment();

  const addElement = (id, x, y) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "border-star";
    el.dataset.ident = String(id);
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.style.setProperty("--twinkle-delay", `${(id * 0.13) % 2.4}s`);
    el.setAttribute("aria-label", "Dust speck");
    el.addEventListener("click", async () => {
      await playTwinkle();
      triggerElement(id);
    });
    fragment.append(el);
  };

  let idCount = 1;
  for (let x = 0; x <= 100; x += 2.5) addElement(idCount++, x, 0);
  for (let y = 3; y <= 97; y += 3) addElement(idCount++, 100, y);
  for (let x = 100; x >= 0; x -= 2.5) addElement(idCount++, x, 100);
  for (let y = 97; y >= 3; y -= 3) addElement(idCount++, 0, y);
  
  decDust.append(fragment);

  const refreshState = () => {
    const prevActive = document.querySelector(".border-star.is-active");
    if (prevActive) {
      prevActive.classList.remove("is-active");
      prevActive.setAttribute("aria-label", "Dust speck");
    }
    if (currentIdx < routine.length) {
      const nextActive = document.querySelector(`.border-star[data-ident="${routine[currentIdx]}"]`);
      if (nextActive) {
        nextActive.classList.add("is-active");
        nextActive.setAttribute("aria-label", "Misaligned pixel");
      }
    }
  };

  let persistentAudio = null;

  const triggerElement = (identId) => {
    if (currentIdx >= routine.length || identId !== routine[currentIdx]) return;
    currentIdx += 1;
    refreshState();

    if (currentIdx === routine.length) {
      if (!persistentAudio) {
        persistentAudio = new Audio("/audio/reveal.mp3");
        persistentAudio.volume = 1;
        persistentAudio.loop = true;
        persistentAudio.play().catch(() => {});
      }
    }
  };

  const findBytes = (bytes, target) => {
    outer: for (let i = bytes.length - target.length; i >= 0; i -= 1) {
      for (let j = 0; j < target.length; j += 1) {
        if (bytes[i + j] !== target[j]) continue outer;
      }
      return i + target.length;
    }
    return -1;
  };

  fetch("/puzzle-bg-v5.png", { cache: "no-store" })
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const bytes = new Uint8Array(buffer);
      // Constructing target bytes: "FC4_PAYLOAD::"
      const target = new Uint8Array([70, 67, 52, 95, 80, 65, 89, 76, 79, 65, 68, 58, 58]);
      const start = findBytes(bytes, target);
      if (start !== -1) {
        finalPayload = new TextDecoder().decode(bytes.slice(start));
      }
    })
    .catch(() => {});

  const showBackground = (event) => {
    event.preventDefault();
    window.location.assign(normalBg.currentSrc || "/puzzle-bg-v5.png");
  };

  let copyArmed = false;

  const disarmCopy = () => {
    copyArmed = false;
  };

  document.addEventListener("keydown", (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();

    if (modifier && key === 'a') {
      copyArmed = true;
    } else if (
      event.key === "F12" ||
      (modifier && event.shiftKey && ["i", "j", "c"].includes(key)) ||
      (modifier && ["u", "s"].includes(key))
    ) {
      showBackground(event);
    } else if (event.key === "Escape") {
      disarmCopy();
    }
  });

  document.addEventListener("mousedown", disarmCopy);

  document.addEventListener("copy", (event) => {
    if (copyArmed && finalPayload) {
      event.preventDefault();
      event.clipboardData.setData('text/plain', finalPayload);
      
      const escaped = finalPayload
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      event.clipboardData.setData('text/html', `<pre>${escaped}</pre>`);
      
      disarmCopy();
    }
  });

  document.addEventListener("contextmenu", showBackground);

  refreshState();
})();
