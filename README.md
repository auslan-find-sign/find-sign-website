# Find Sign Website (2022 rebuild)

Original find-sign (sign-search repo) was a totally nuts mess of code that was almost impossible to maintain and easy to get lost in. 2022 has been a time for cleaning up that mess, which has included a total, gradual rewrite of everything. This project is a from scratch rewrite of the web searching UI in SvelteKit. It does not include anything to do with building data that this reads and searches.

## Requirements

1. The website needs a precomputed vector dataset, that translates written words in to a word2vec type of vector space. Auslan Find Sign uses Facebook/Meta's FastText common-crawl english. This is converted to a compact sharded format using [find-sign-vectors-builder](https://github.com/auslan-find-sign/find-sign-vectors-builder) which creates the needed output that can be served on any static http server. The path to this output needs to be configured in `/.env` - take a look at `example.env` to see how this file is made. `find-sign-vector-builder` has instructions on usage, and fasttext provides premade data for almost every popular written language on earth.
2. The website needs a search index. This is currently being built with legacy code from the old project. TODO: reimplement a cleaner search index builder.
3. If you want the discord bot, you'll need to register a dev account on discord, make a bot, and provide the needed secrets in your .env file. the endpoint url to use is `https://yoursite/discord/interactions`. You'll also need to manually visit `/discord/setup` with curl or a web browser to get find-sign-website to upload the discord slash commands to their systems. Consider curling this url as part of your deployment cycle.

## TODO List:

 - Implement new search index format, and make a builder
 - Admin WebUI where manual results corrections can be nicely entered?
 - Privacy preserving analytics?

## I want to contribute data, how can I best make it accessible to find sign?

Anything Facebook/Meta makes is hell, and youtube is only a slightly lesser hell. The very best thing you can do to fill my life with joy, is publish your video files as static files on a web server you control, along with a search-data.json file. YAML is also acceptable.

`search-data` is find sign's native format for representing data that goes in to the search index. Your videos can be in any format, as they will be transcoded before being presented to users. If you're recording videos from scratch, 16:9 horizontal looks great on this site.

### `search-data` format:

your search data should be a JSON object in which each key/property name is a string which uniquely represents that sign and will not change when you add or remove data. It should ideally be fairly short and work well in a URL, like "forever-1". The value of these properties should be as such:

```json
{
  "title": "Any plain text title that should show as a clickable heading in the search result",
  "words": ["list", "of", "words"],
  "body": "a string description of your video, which may include\na few different\nlines",
  "link": "https://link-to-root.tld/some/section/specific/entry.html",
  "nav": [
    ["Site Name", "https://link-to-root.tld/"],
    ["Subsection name", "https://link-to-root.tld/some/section"],
    ["Specific Page", "https://link-to-root.tld/some/section/specific/entry.html"]
  ],
  "tags": ["list", "of", "hashtags"],
  "media": [
    { "method": "fetch", "url": "https://media.your-site.tld/path/to/whatever.mp4", "version": "version-1" }
  ],
  "author": {
    "name": "Person's Name",
    "link": "https://your-site.tld/user/profile",
    "avatar": "https://your-site.tld/user/profile/avatar.jpeg"
  }
}
```

You can, if you choose, omit `title`, in which case it will be `words` joined with commas. `words` are always the searchable thing, and must be provided. words list will be transformed in to word vectors and compared against user's search terms to rank results, so it's content should usually be quite similar to the title string. Words should not include punctuation like `.` or `,` or quote marks.

Newlines are rendered correctly in body text, and in the future markdown maybe supported there, but html never will.

`link` specifies where the user is sent when they click the title or videos. If omitted, find-sign will link to it's own permalink page about the entry.

`nav` if provided, will cause a breadcrumbs-like link under the title to be rendered, which looks nicer for users. It's a great place to put some branding, and should reflect the structure of your site. If it's missing, `link` will be used, and if that's missing, a find-sign permalink will be used by default.

`tags` is optional, and can be provided as a list of hashtags. Each string must not contain whitespace. It should only contain characters that are easy to type like a-z0-9 and may also use `.`, and `-` seperators. No other punctuation may be present and the strings should not begin with a `#`.

`media` must be present, and must be an array of Media Elements (see below).

`author` isn't currently used, but maybe in the future to provide a little profile link.

### Media Elements

Media elements are an object, with `method` set to `"fetch"` and `url` set to either a relative or absolute https/http url that directly points to a video file (like .mp4, mkv, etc). If a relative path is provided it will be understood as relative to where you host your search-data.json, like how `<a>` links in html work.

You may also add a `version` property to this object, with any string value which will change when you modify your media (like a hash of the file's contents, or a file last modified date). If you don't provide a `version` find-sign will not normally redownload your videos so changes wont be detected for a long time.

You may also provide a `clipping` property, which is an object containing optional `start` and `end` properties. If start is specified, it must be a number, which is how many seconds find-sign should skip in to the start of the video before transcoding, clipping off that many seconds from the beginning. If end is specified, it is how many seconds deep in to the video the clip should include. if both are provided, end must be a larger number than start. Start defaults to 0 and end defaults to the intrinsic duration of the video file.

If you have a video that contains several signs, you can reference the same video url in multiple search-data entries, and use clipping to control which section of the video is presented to the user. You could also use it to skip past intro logos or exclude end credits from the loop seen on find-sign.