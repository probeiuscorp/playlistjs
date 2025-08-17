# playlistjs
> Make dynamic playlists with TypeScript.

### Find YouTube videos
Find some YouTube videos and copy their video ID's from the URL.
```javascript
// youtube.com/watch?v=dQw4w9WgXcQ
const neverGonnaGiveYouUp = 'dQw4w9WgXcQ'
// youtube.com/watch?v=yPYZpwSpKmA
const togetherForever = 'yPYZpwSpKmA'
```

### Create a playlist
```javascript
Playlist.yield('Rick Astley', [
  neverGonnaGiveYouUp,
  togetherForever,
]);
```

### Any iterable will do
```javascript
Playlist.yield('Never gonna be done', function*() {
  while(true) {
    yield neverGonnaGiveYouUp;
  }
});
```

### Upgrade your playlist to Git
Once you want
 - version control,
 - manual testing,
 - automated testing, or
 - your own IDE setup,

your workspace can be upgraded to a Git repository:

1. In playlistjs, download your existing workspace as a tar file
2. Clone playlistjs template Git workspace

`$ git clone https://github.com/probeiuscorp/playlistjs-sample.git playlist`

3. Extract tar into clone, then commit and push to any Git hosting provider
4. In playlistjs, select "Convert to Git repository"
5. Enter clone-worthy URL of hosted Git repository

![Get hosted repository URL](https://github.com/probeiuscorp/playlistjs/assets/70288813/e93b87b2-864b-483c-a958-af15ea86c991)


