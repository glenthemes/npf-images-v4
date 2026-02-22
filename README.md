![Banner titled "NPF Images Fix (v4.0)" with a subtitle that reads "written by @glenthemes". What follows is a comparison of two screenshots of an example post displaying how the same post looks before and after the NPF images v4 fix has been applied. The post is by user glen-px which consists of three images laid out in a single row, each consisting of different heights; the first is portrait, the second is landscape, and the third is square. In the first screenshot, the user header appears first, followed by the photoset that has been vertically stretched to take on the height of the tallest image in that row, followed by the caption text. In the second screenshot, the photoset appears first, significantly shorter in height as it takes the height of the shortest column in that row , mimicking that of the Tumblr dashboard. Underneath the photoset sits the user header, then the caption text. A brown arrow points from the first screenshot to the second one.](https://glenthemes.github.io/npf-images-v4/imgs/v4-banner-r.png)

###### ✦ Written by **@⁠glenthemes** [2026]<br/>✦ **Last updated:** 2026/02/21 9:47PM [PST]

A plugin that cleans up the appearance of NPF images on Tumblr themes, allowing them to mimic the appearance of legacy photo posts. Only applies to Tumblr themes, *not* the Tumblr dashboard.

This fix attempts to be a one-size-fits-all solution, but likely needs HTML and [Tumblr docs](https://www.tumblr.com/docs/en/custom_themes) knowledge to make it work as intended, as the markup/structure of every theme will be different depending on how the theme maker set it up.

---

#### Table of Contents:
- 💭 [What is NPF?](#what-is-npf)
- ✨ [Features](#features)
- 👁️ [Demos + Previews](#%EF%B8%8Fdemos--previews)
- 🚀 [How to install](#how-to-install)
- 📝 [Further notes](#further-notes)
- 💖 [Attribution](#attribution)
- 🙋 [Questions?](#questions)

---

### 💭 What is NPF?

**NPF** stands for "Neue Post Format". Prior to 2020, users could create posts of a primary post type (namingly text, photo, quote, link, chat, video, questions). In recent years, Tumblr introduced NPF as the *only* available post type (in other words, everything becomes a text post), despite their post editor showing [the illusion of different post types](https://64.media.tumblr.com/04bb89bf6cc73fdd7d9c72eae7556d6d/729acb0793aed17b-11/s2048x3072/18843b843d894421ca0cf878803da9b2691c4a16.pnj). As such, all images uploaded via Tumblr mobile have turned into NPF images. NPF images can also refer to images between paragraphs ([inline images](https://glen-test.tumblr.com/tagged/npf-inline)).

Although NPF has been in the works [as early as 2018](https://engineering.tumblr.com/post/179080448939/new-public-api-and-neue-post-format-documentation), its support on custom themes has been lackluster. While the [documentation on the `{NPF}` variable](https://github.com/tumblr/docs/blob/master/npf-spec.md) is extensive, creating themes this way is vastly different from [Tumblr's "blocks" system](https://www.tumblr.com/docs/en/custom_themes) and even the [default Tumblr theme](https://www.tumblr.com/theme/37310) does not use the `{NPF}` variable. Furthermore, it's impossible to swap out `{block:Text}` for `{NPF}` directly in hopes of fixing the visual inconsistencies.

---

### ✨ Features:
- Turns images HD if available
- Prevents images from stretching / overflowing
- Custom photoset spacing
- Custom caption spacing
- Improved lightbox functionality
- Supports legacy blockquote captions, [unnested captions](https://neothm.com/post/148902138319), and modern captions
- Adds media types to each NPF instance (including [multimedia](https://glen-test.tumblr.com/tagged/multimedia) posts)
- Automatic [infinite scroll](https://infinite-scroll.com) support
- [optional] Reassigns post type from `text` to its intended type (e.g. `photo`, `video`, or `multimedia`)
- [optional] Moves main photoset to the top of the post if they were meant to look like legacy photo posts:
    - Removes the blockquote border from the main photoset (if applicable)
    - Adds original poster's username if the original post does not come with a caption (e.g.: `(Source: glen_px)`)
- [optional] Custom actions/functions you can perform after the fix executes (e.g. fading in posts)

---

### 👁️ Demos + Previews:

| Captions type | Demo | Code |
| --- | --- | --- |
| Legacy blockquote captions | [view](https://glenthemes.github.io/npf-images-v4/demos/legacy-captions.html) | [example theme code](https://glenthemes.github.io/npf-images-v4/demos/code/legacy-captions.txt) |
| [Unnested captions](https://neothm.com/post/148902138319) by neothm & magnusthemes | [view](https://glenthemes.github.io/npf-images-v4/demos/unnested-captions.html) | [example theme code](https://glenthemes.github.io/npf-images-v4/demos/code/unnested-captions.txt) |
| Modern captions | [view](https://glenthemes.github.io/npf-images-v4/demos/modern-captions.html) | [example theme code](https://glenthemes.github.io/npf-images-v4/demos/code/modern-captions.txt) |

Please note that the theme codes provided above only render text posts (i.e. excludes all other legacy post types) as the purpose is to aid you in finding your selectors and identifying your theme's markup.

---

### 🚀 How to install:

Before we begin, please familiarize yourself with the Tumblr HTML editor's search tool, which can be accessed by clicking anywhere in your theme code and pressing `Ctrl+F` (`CMD+F` for Mac), or like so:

![Screenshot of the searchbar function in Tumblr's HTML editor. To access it, click the gear icon at the top of the screen, then click "Find and replace".](https://64.media.tumblr.com/7a1bd6138693791db27e0b4bdc5b4cea/729acb0793aed17b-a8/s640x960/987744757235b2ad54fc2d2b0128851cc5a4ee60.pnj)

#### Step 1: Add the essentials:

Paste the following **above** `</head>` in your theme code:
```html
<!--  NPF images fix v4.0 by glenthemes [2026]  --->
<!--     github.com/glenthemes/npf-images-v4     -->
<link href="//glenthemes.github.io/npf-images-v4/core.css" rel="stylesheet">
<script src="//glenthemes.github.io/npf-images-v4/main.js"></script>
<style npf-v4-settings>
:root {
    --NPF-Text-Container:".caption";
    --NPF-Reblogs-Selector:".tumblr_parent";
    --NPF-Move-To-Top:"yes";
    --NPF-Captionless-Add-Source:"yes";
    --NPF-Change-Post-Type:"yes";
    --NPF-Caption-Spacing:1em;
    --NPF-Images-Spacing:4px;
}
</style>
<script>NPFv4()</script>
```

☝️ You can also try putting it just **above** `</body>` if it doesn't seem to do anything!

#### Step 2: Enable high-quality images on posts:

Type `{block:Posts` (starts with a curly bracket but doesn't end with one) into the searchbar to see if it exists. You can use the accompanying arrow keys to check if there's more than one result:

![Screenshot of a term typed into the searchbar; at the right side are up and down arrows to aid you with jumping to the next search result.](https://64.media.tumblr.com/9b879fa4f1381fb73fc6f9d49e4f2a89/729acb0793aed17b-e0/s1280x1920/5d969563470f6b972f9a3ce45c73bc5ac8087126.pnj)

If you see `{block:PostSummary}` or `{block:Post1}`, ignore them and keep searching.

Stop when you arrive at the line where you should see `<div class="posts">` (or similar) on the next line:
```html
{block:Posts}
<div class="posts">
```

Replace that `{block:Posts` line with the following:
```html
{block:Posts inlineMediaWidth="1280" inlineNestedMediaWidth="1280"}
```

#### Step 3: Add `post-type="{PostType}"` to your posts:

Under the `{block:Posts ...}` line that you just added should be the HTML that renders your posts. Add `post-type="{PostType}"` at the end (just before the closing pointy bracket) like so:
```html
<div class="posts" post-type="{PostType}">
```

If you're not sure which line to put it on, use the one with `{PostID}` if it has one.

#### Step 4: Configure your NPF options:

Go back to the batch of code you paste from **Step 1**; specifically this section:
```html
<style npf-v4-settings>
:root {
    --NPF-Text-Container:".caption"; /* text caption selector */
    --NPF-Reblogs-Selector:".tumblr_parent"; /* reblogs selector */
    --NPF-Move-To-Top:"yes"; /* moves first photoset to top of post */
    --NPF-Captionless-Add-Source:"yes"; /* adds "(Source: BLOG-NAME)" on posts without caption text */
    --NPF-Change-Post-Type:"yes"; /* updates NPF posts to their intended post type */
    --NPF-Caption-Spacing:1em; /* spacing between first photoset and its caption */
    --NPF-Images-Spacing:4px; /* spacing between NPF media */
}
</style>
```

#### Options overview:

| Variable name | Description | Accepted values
| --- | --- | --- |
| `--NPF-Text-Container` | The CSS selector name for your **text posts' captions**.<br/>Typically the first element that sits under `{block:Text}`. | CSS selector names only, wrapped in quotes.<br/><br/>Common text container selector names are `".text-block"`, `".caption"`, `".tcaption"`, `".capt"`, `".cpt"`, `".text"`, `".txt"`, `".tex"`. |
| `--NPF-Reblogs-Selector` | The CSS selector name for each of your **text post's reblogs**.<br/><br/>Using [this post](https://tumblr.com/devsmaycry/186738981199) as an example, `@claude-money`'s post is one reblog, and `@odetocody`'s post is another reblog.<br/><br/>Typically the first element that sits under `{block:Text}`. | CSS selector names only, wrapped in quotes.<br/><br/>Common reblogs selector names are `".tumblr_parent"`, `".comment_container"`, `".comment"`, `".reblog-wrap"` |
| `--NPF-Move-To-Top` | [Optional] Moves the first photoset to the top of the post. | `"yes"` or `"no"` |
| `--NPF-Captionless-Add-Source` | [Optional] Adds `(Source: BLOG-NAME)` on posts without caption text.<br/><br/>💡 **Only works if `--NPF-Move-To-Top` is set to `"yes"`**. | `"yes"` or `"no"` |
| `--NPF-Change-Post-Type` | [Optional] Changes NPF posts from `text` type to their intended post type (e.g. `photo`, `video`, `multimedia`). Applies to your posts selector.<br/><br/>Adds a `.previously-npf` class to it.<br/><br/>💡 **Only works if `--NPF-Move-To-Top` is set to `"yes"`**. | `"yes"` or `"no"` |
| `--NPF-Caption-Spacing` | The spacing between the first photoset and the caption text.<br/><br/>💡 **Only works if `--NPF-Move-To-Top` is set to `"yes"`**. | Any valid size value in CSS (e.g. `14px`, `1em`) |
| `--NPF-Images-Spacing` | The spacing between NPF images (and other media). | Any valid size value in CSS (e.g. `4px`, `10px`) |

- Please do not remove any semi-colons, and do not leave any quotes unclosed.
- If you have trouble pinpointing the selectors for your text container and reblogs, you can leave them blank, like so:
```html
<style npf-v4-settings>
:root {
    --NPF-Text-Container:""; /* text caption selector */
    --NPF-Reblogs-Selector:""; /* reblogs selector */

    /* ...rest of the options */
}
</style>
```

<details>
<summary>Expand for tips on finding your selectors!</summary>
<br>

**Key points:**  
- Both `--NPF-Text-Container` and `--NPF-Reblogs-Selector` can be found under `{block:Text}` in your theme code, where NPF posts are rendered.
- The line of HTML immediately below `{block:Text}` is usually the `--NPF-Text-Container`.
- If `{block:Reblogs}` exists, the line below it is usually the `--NPF-Reblogs-Selector`.
- If `{block:Reblogs}` *does not* exist, leave `--NPF-Reblogs-Selector` blank.

**Legacy captions: structure example A:** (typically found on older themes):
```html
{block:Text}
    {block:Title}<h2>{Title}</h2>{/block:Title}
    <div class="caption">{Body}</div>
{/block:Text}
```

☝️ In the above example:
- Since `{block:Reblogs}` doesn't exist, leave `--NPF-Reblogs-Selector` blank.
- The `--NPF-Text-Container` is `.caption`.

**Legacy captions: structure example B:** (typically found on older themes):
```html
{block:Text}
    <div class="text">
        {block:Title}<h2>{Title}</h2>{/block:Title}
        <div class="caption">{Body}</div>
    </div>
{/block:Text}
```

☝️ In the above example:
- Since `{block:Reblogs}` doesn't exist, leave `--NPF-Reblogs-Selector` blank.
- The `--NPF-Text-Container` can be either `.text` or `.caption`; either should work.

**Legacy captions: structure example C:** (typically found on older themes):
```html
{block:Text}
    {block:Title}<h2>{Title}</h2>{/block:Title}

    <div class="text">
        <div class="caption">{Body}</div>
    </div>
{/block:Text}
```

☝️ In the above example:
- Since `{block:Reblogs}` doesn't exist, leave `--NPF-Reblogs-Selector` blank.
- The `--NPF-Text-Container` can be either `.text` or `.caption`; either should work.

**Modern captions: structure example A:** (typically found on newer themes):
```html
{block:Text}
    <div class="caption">
        {block:Title}<h2>{Title}</h2>{/block:Title}

        {block:NotReblog}
        <div class="comment">{Body}</div>
        {/block:NotReblog}

        {block:RebloggedFrom}
        {block:Reblogs}
        <div class="comment">{Body}</div>
        {/block:Reblogs}
        {/block:RebloggedFrom}
    </div>
{/block:Text}
```

☝️ In the above example:
- `{block:Reblogs}` exists; the `--NPF-Reblogs-Selector` is `.comment`.
- The `--NPF-Text-Container` is `.caption`.

**Modern captions: structure example B:** (typically found on newer themes):
```html
{block:Text}
    <div class="caption">
        {block:Title}<h2>{Title}</h2>{/block:Title}

        {block:NotReblog}
        <div class="comment_container">
            <div class="comment-header"> ... </div>
            <div class="comment">{Body}</div>
        </div>
        {/block:NotReblog}

        {block:RebloggedFrom}
        {block:Reblogs}
        <div class="comment_container">
            <div class="comment-header"> ... </div>
            <div class="comment">{Body}</div>
        </div>      
        {/block:Reblogs}
        {/block:RebloggedFrom}
    </div>
{/block:Text}
```

☝️ In the above example:
- `{block:Reblogs}` exists; the `--NPF-Reblogs-Selector` is `.comment_container`.
- The `--NPF-Text-Container` is `.caption`.

**Modern captions: structure example C:** (typically found on newer themes):
```html
{block:Text}
    {block:Title}<h2>{Title}</h2>{/block:Title}

    {block:NotReblog}
    <div class="caption">
        <div class="comment">{Body}</div>
    </div>
    {/block:NotReblog}

    {block:RebloggedFrom}
    {block:Reblogs}
    <div class="caption">
        <div class="comment">{Body}</div>
    </div>
    {/block:Reblogs}
    {/block:RebloggedFrom}
{/block:Text}
```

☝️ In the above example:
- `{block:Reblogs}` exists; the `--NPF-Reblogs-Selector` can be either `.caption` or `.comment`; either should work.
- The `--NPF-Text-Container` does not exist, leave it blank.

</details>

---

### 📝 Further notes:

💡 If you're using [unnested captions by neothm & magnusthemes](https://neothm.com/post/148902138319), please make sure that the NPF v4 scripts ***after*** the unnest script, and do not change the name of `.tumblr_parent`!

💡 If you've set `--NPF-Move-To-Top` to `"yes"` but the photoset still isn't repositioning itself, make sure the `{Body}` segment in your text block is wrapped in a div or similar:

**Example, not wrapped ❌:**
```html
<div class="reblogs">
    <span class="username">username text</span>
    {Body}
</div>
```

**Example, wrapped ✅:**
```html
<div class="reblogs">
    <span class="username">username text</span>
    <div>{Body}</div>
</div>
```

💡 If you wish to perform further actions (i.e. JavaScript functions) after the fix has executed, go to this line:
```html
<script>NPFv4()</script>
```

...and modify it like so (and insert the functions/actions you wish to do):
```html
<script>
    NPFv4(posts => {
        posts?.forEach(post => {
            console.log(`This NPF post is now a ${ post.getAttribute("post-type") } post!`) // console logs e.g. "This NPF post is now a photo post!"
        })
    })
</script>
```

---

### 💖 Attribution:

For Tumblr theme *users*:
> The credit is already present in the essential NPF scripts pasted; no further attribution is required.

For Tumblr theme *makers*:
> You are welcome to use this fix in both free and premium themes; in your credits list or page, please include a [link to this repository](https://github.com/glenthemes/npf-images-v4) or [my Tumblr blog](https://glenthemes.tumblr.com).

---

### 🙋 Questions?

If you run into any issues or need help with installing this fix, please reach out to me via my [Discord](https://discord.gg/RcMKnwz).

Checklist of thing to include when asking for help:
- A link to your blog, e.g. `https://glen-px.tumblr.com`
- Clarify which theme you are using, and by whom
- Send your **full** theme code (tutorial: [glenthemes.notion.site/dpaste-tutorial](https://glenthemes.notion.site/dpaste-tutorial))!

---

If you made it this far, thank you!  
Please consider [sending me a donation](https://ko-fi.com/glenthemes) if you found this fix useful! It helps me out a lot 💖

🌟 HT ⋆ glenthemes
