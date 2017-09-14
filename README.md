# Welcome
To see the final product, visit [nvioli.github.io](https://nvioli.github.io).

# Other Versions
There are several other versions containing pieces of the complete functionality, and requiring less code, so that the underlying principles might be more easily understood.

| Name | Description | URLs |
| ---- | ----------- | ---- |
| Complete demo | The complete implementation | Live demo:https://nvioli.github.io <br/> code:https://github.com/nvioli/variations/tree/master/src |
| Audio test | A small test showing how to load and play audio samples | Live demo:https://nvioli.github.io/audiotest.html <br/> code:https://github.com/nvioli/variations/tree/master/src/audiotest |
| Background | A fullscreen version of the visualization only. Click to begin, click again to stop. (May be clipped depending on device / browser dimensions.) | Live demo:https://nvioli.github.io/background.html <br/> code:https://github.com/nvioli/variations/tree/master/src/background/ |
| Draw Notes | Introduction visualization showing generation of the notes, but not playing the entire piece | Live demo:https://nvioli.github.io/drawNotes.html <br/> code:https://github.com/nvioli/variations/tree/master/src/drawNotes/ |
| Repeat | The complete implementation without intro material; auto-refreshes | Live demo:https://nvioli.github.io/repeat.html <br/> code:https://github.com/nvioli/variations/tree/master/src/repeat/ |

# Running locally
## Building and running the local server
```bash
$ git clone https://github.com/nvioli/variations.git
$ cd variations
$ npm install
$ npm run dev
```
This builds the contents of the app into the `dist` directory, starts a local webserver, and starts a watch task which will re-build the app when you change any file in the `src` directory. Visit http://localhost:8080 (or any of the pages listed above) to see the piece.

## Hosting audio files locally
By default, the audio files are all loaded from Nick's github pages demo. If you want to serve them locally (which is much faster!), download the [Sonatina Symphonic Orchestra sample library](http://sso.mattiaswestlund.net/download.html) and extract in to the Samples directory, then change the `localSampleLibrary` variable in each of the `audioUtils.js` files to `true`.

# Related
* [John Cage](http://johncage.org/)
* [p5.js](https://p5js.org/)
* [Variations I on Wikipedia](https://en.wikipedia.org/wiki/Variations_(Cage))
* Inspired by [Javascript Systems Music by Tero Parviainen](http://teropa.info/blog/2016/07/28/javascript-systems-music.html)
* [John Cage on "I've Got a Secret"](https://www.youtube.com/watch?v=gXOIkT1-QWY) (not directly related to this piece, but one of my favorite videos of Cage)
