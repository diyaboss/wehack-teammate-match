# Frequency Cipher

A Firebase Hosting-ready puzzle page reconstructed from `fcipher4`.

## Add the final audio

Place the mashup at:

`firebase-public/audio/reveal.mp3`

The seventh correct blue-star click plays it with `volume = 1`.

## Deploy to Firebase

1. Copy `.firebaserc.example` to `.firebaserc`.
2. Replace `YOUR_FIREBASE_PROJECT_ID` with the Firebase project ID.
3. Run `npx firebase-tools login`.
4. Run `npx firebase-tools deploy --only hosting`.

## Puzzle mechanics

- The visible puzzle is a single PNG.
- Ctrl+A followed by copy returns the top cipher, all clue lines, and the
  6,800-letter hidden block in that order.
- F12, common DevTools shortcuts, and right-click redirect to the black puzzle
  PNG.
- All border stars twinkle. The currently valid star twinkles blue.
- Laptop and desktop screens use a dedicated full-screen 16:9 composition;
  portrait screens automatically use the portrait composition.
- The animated star field is fixed 10 pixels from the actual viewport edges,
  independent of the puzzle image ratio.
- The valid seven-star path is defined in `firebase-public/app.js`.

Browser security note: anything delivered to a participant's browser can
ultimately be recovered by a sufficiently determined participant. These
measures hide the payload from casual DOM inspection; they cannot make
client-delivered data cryptographically inaccessible.
