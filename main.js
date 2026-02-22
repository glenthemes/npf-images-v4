/*-------------------------------------------------------------------

    NPF images fix v4.0 by @glenthemes [2026]
    github.com/glenthemes/npf-images-v4
    
    [#] Last updated: 2026-02-21 12:08AM [PST]
    [#] Changelog: github.com/glenthemes/npf-images-v4/changes.md
      
-------------------------------------------------------------------*/

window.NPFv4 = (action) => {
  let vpw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  let posts_str = "[post-type]:not(.npf-loaded)" // all posts
  let text_posts_str = "[post-type='text']:not(.npf-loaded)" // all TEXT posts

  function onReady(e){"loading"===document.readyState?document.addEventListener("DOMContentLoaded",e):e()}

  function VAR(e){let t=getComputedStyle(document.documentElement).getPropertyValue(e).trim().replace(/^['"]|['"]$/g,"");return""===t?void 0:t}
  
  let run = (action) => {
    /*+++++++ GET OPTIONS +++++++*/
    function getOpts() {
      return {
        textBlock: VAR("--NPF-Text-Container") ?? "",
        reblogs: VAR("--NPF-Reblogs-Selector") ?? "",
        moveToTop: VAR("--NPF-Move-To-Top") ?? "no",
        addSource: VAR("--NPF-Captionless-Add-Source") ?? "yes",
        changePostType: VAR("--NPF-Change-Post-Type") ?? "no"
      };
    }

    let opts = getOpts()

    /*+++++++++ FUNCS +++++++++*/
    // [func] wrap siblings (e.g. .npf_row + .npf_row)
    function wrapSiblings(e,l,t,s){let a=[],i=e.querySelectorAll(`:scope > ${l}`),n=0,c=i.length;i?.forEach(e=>{if(!e.previousElementSibling?.matches(l)){let i=document.createElement(t.tag);if(Array.isArray(t.className))for(let o of t.className)i.classList.add(o);else i.classList.add(t.className);e.before(i);let r=i.nextElementSibling;for(r&&(!r||r.matches(l))||i.remove(),r&&a.push(i);r&&r.matches(l);)i.append(r),r=i.nextElementSibling}++n===c&&s&&"function"==typeof s&&s(a)})}

    // [func] check if selectors exist (i.e. text block, reblogs)
    function selExists(sel){return sel!==""&&document.querySelector(sel)!==null}

    // [func] make column (.npf_col)
    function makeCol(e,action){let r=document.createElement("div");if(r.classList.add("npf_col"),!e||!e.wrap)return r;e.wrap.before(r),r.append(e.wrap),action?.(r)}

    // [func] make .tmblr-full
    function makeTmblrFull(e,action){let r=document.createElement("div");if(r.classList.add("tmblr-full"),!e||!e.wrap)return r;e.wrap.before(r),r.append(e.wrap),action?.(r)}

    // [func] wrap npf media
    // A. wraps media in .tmblr-full if it isn't already wrapped in one
    // B. wraps .tmblr-full in .npf_row (with its media type), or adds media type to said row if it alr exists
    function npfMediaWrap(l,t){let e=t.addType,s;!l.matches(".tmblr-full")&&l.closest(".tmblr-full")?s=l.closest(".tmblr-full"):l.matches(".tmblr-full")||l.closest(".tmblr-full")?s=l:makeTmblrFull({wrap:l},l=>{s=l}),s.closest(".npf_row")||makeRow({wrap:s,addType:e})}

    // [func] make row (.npf_row) (+ optionally add media type)
    function makeRow(a,e){let d=document.createElement("div");if(d.classList.add("npf_row"),a&&a.addType){if(Array.isArray(a.addType))for(let p of a.addType)d.classList.add(`npf_${p}`);else d.classList.add(`npf_${a.addType}`)}if(!a||!a.wrap)return d;a.wrap.before(d),d.append(a.wrap),e?.(d)}

    // [func] reassign post type
    function reassignPostType(post,npf_inst){
      if(post && npf_inst && opts.changePostType && (opts.changePostType == "yes" || opts.changePostType === true)){
        let classes = npf_inst.getAttribute("class")
        post.setAttribute("post-type",
          classes.indexOf("npf_photo") > -1 ? "photo" :
          classes.indexOf("npf_audio") > -1 ? "audio" :
          classes.indexOf("npf_video") > -1 ? "video" :
          classes.indexOf("npf_multimedia") > -1 ? "multimedia" : "text"
        )
        post.classList.add("previously-npf")
      }
    }

    // [func] aspect-ratio support (if not, use padded box)
    function rowHeights(){
      let supportsAR = "aspect-ratio" in document.documentElement.style
      if(supportsAR){
        npfRowHeightAR?.()
      } else {
        npfRowPaddedBoxHeight?.()
      }
    }

    // [func] use aspect-ratio for npf row height
    function npfRowHeightAR(){
      document.querySelectorAll(".npf_photo_row:not(.npf-loaded [data-npf-row-ready]):has(.npf_col + .npf_col)")?.forEach(row => {
        let ratiosEachRow = []; // decimal
        let aspectRatiosEachRow = []; // e.g. 16/9
        
        let colSelector = ".npf_col:not(.npf_col .npf_col)"
        row.querySelectorAll(colSelector)?.forEach(col => {
          // can be either:
          // #1 [data-big-photo-width]
          // #2 [data-orig-width] <-- existence first noticed: 2025/04/12
          let pic = col.querySelector("[data-big-photo-width][data-big-photo-height]") || col.querySelector("[data-orig-width][data-orig-height]");
          if(pic){
            let picDataString;
            if(pic.matches("[data-big-photo-width][data-big-photo-height]")){
              picDataString = "big-photo"
            } else if(pic.matches("[data-orig-width][data-orig-height]")){
              picDataString = "orig"
            }
            
            if(pic && pic.getAttribute(`data-${picDataString}-width`).trim() !== "" && pic.getAttribute(`data-${picDataString}-height`).trim() !== ""){
              let w = Number(pic.getAttribute(`data-${picDataString}-width`));
              let h = Number(pic.getAttribute(`data-${picDataString}-height`));
              if(isNaN(w) || isNaN(h)){
                return;
              } else {
                ratiosEachRow.push(w/h) // decimal
                aspectRatiosEachRow.push(`${w}/${h}`) // e.g. 16/9
              }
            }
          }
        })//end col each

        if(ratiosEachRow.length == row.querySelectorAll(colSelector).length){
          let shortest = Math.max(...ratiosEachRow);
          let indexOfShortest = ratiosEachRow.findIndex(x => x === shortest)
          let shortestAspectRatio = aspectRatiosEachRow[indexOfShortest]
          row.querySelectorAll(colSelector)?.forEach(col => col.style.aspectRatio = shortestAspectRatio)
          
          row.dataset.npfRowReady = ""
        }
      })//end row each
    }//end npfRowHeightAR

    // [func] use padded box for npf row height
    function npfRowPaddedBoxHeight(){
      document.querySelectorAll(".npf_photo_row[columns]:not(.npf-loaded [data-npf-row-ready], [columns='1'], [columns=''], [columns='0'])")?.forEach(row => {
        let colsNum = row.querySelectorAll(":scope > .npf_col").length
        
        // natural dimensions (original dimensions)
        let NATURAL_WIDTHS = [];
        let NATURAL_HEIGHTS = [];
        
        // collect ratios (w/h)
        let NATURAL_RATIOS = [];
        
        // height after img confirmed loaded
        row.querySelectorAll(":scope > .npf_col img:first-of-type")?.forEach(img => {
          let w,h,r;
          
          // image already loaded, get dims
          if(img.complete){
            w = img.naturalWidth;
            h = img.naturalHeight;
            r = w/h;
            
            addDims(w,h,r);
          }
          
          // image NOT YET loaded, use load evt, then get dims
          else {
            img.addEventListener("load", e => {
              w = e.target.naturalWidth;
              h = e.target.naturalHeight;
              r = w/h;
              
              addDims(w,h,r);
            })
          }
          
          // do stuff with the dims
          function addDims(w,h,r){
            NATURAL_WIDTHS.push(w);
            NATURAL_HEIGHTS.push(h);        
            NATURAL_RATIOS.push(r)
            
            // should only trigger once per row
            if(NATURAL_WIDTHS.length == colsNum){
              // ratios: higher number = shorter
              let shortest_val = Math.max(...NATURAL_RATIOS);
              let shortest_dex = NATURAL_RATIOS.findIndex(x => x == shortest_val);
              
              // using pic index, retrieve that img's dimensions
              let sw = NATURAL_WIDTHS[shortest_dex];
              let sh = NATURAL_HEIGHTS[shortest_dex];
              
              // get the % for padded box
              let sp = sh/sw * 100;

              row.style.setProperty("--npf-img-pct",`${sp}%`);
              row.dataset.npfHeight = ""
              row.dataset.npfRowReady = ""
            }//end: collected all dims of imgs in that row
          }//end addDims()
          
        })//end img each
        
      })//end row each
    }//end: npfRowPaddedBoxHeight

    /*+++++++++ ACTUAL NPF V4 +++++++++*/
    // check if user has added post-type="{PostType}" to their posts sel
    // if not, show a small popup reminder
    if(!document.querySelector("[post-type='text']") && document.querySelector(`script[src*="assets.tumblr.com/assets/scripts/customize"]`) && !document.getElementById("npf-v4-reminder")){
      let bar = document.createElement("div")
      bar.id = "npf-v4-reminder"
      bar.innerHTML = `<b>NPF v4</b> warning: <code>post-type="{PostType}"</code> does not appear to be present in your theme. <a href="https://github.com/glenthemes/npf-images-v4?tab=readme-ov-file#step-3-add-post-typeposttype-to-your-posts" target="_blank">Please add it to your posts selector</a> to get it working!`
      if(!document.querySelector(`link[href*="//assets.tumblr.com/fonts/favorit/stylesheet.css"][rel="stylesheet"]`)){
        let s = document.createElement("link")
        s.href = `https://assets.tumblr.com/fonts/favorit/stylesheet.css`
        s.rel = "stylesheet"
        document.head.append(s)
      }
      document.body.append(bar)
    }

    // wrap text nodes
    for(let br of document.querySelectorAll(`${posts_str} p > br:only-child`)){
      let p = br.closest("p");
      [...p.childNodes]?.forEach(node => {
        if(node.nodeType === 3 && node.data.trim().length){
          let span = document.createElement("span")
          node.before(span)
          span.appendChild(node)
        }
      })
    }
    
    // remove empty <p>s
    for(let p of document.querySelectorAll(`${posts_str} p`)){
      p.innerHTML.trim() == "" && p.remove()
    }
    
    /*>>>>>>>>> NPF BASIC STUFF <<<<<<<<<*/
    // go through all CLASSLESS <figure>s and check if they're supposed to be img.tmblr-full
    for(let fig of document.querySelectorAll(`${posts_str} figure:not([class])`)){
      fig.querySelector("img") && fig.classList.add("tmblr-full")
    }
    
    // wrap each .npf_row > .tmblr-full + .tmblr-full in their own .npf_col
    for(let t of document.querySelectorAll(`${posts_str} .npf_row .tmblr-full:not(:only-of-type):not(.npf_col > .tmblr-full)`)){
      makeCol({ wrap: t })
    }

    // VIDEOS: wrap parentless .tmblr-full
    for(let v of document.querySelectorAll(`${posts_str} [data-npf*='"type":"video"'], ${posts_str} .tmblr-embed.tmblr-full`)){
      npfMediaWrap(v, {
        addType: "video_row"
      })
    }
    
    // AUDIOS: wrap parentless .tmblr-full
    for(let a of document.querySelectorAll(`${posts_str} [data-npf*='"type":"audio"'], ${posts_str} iframe[class*="_audio_player"], ${posts_str} .tmblr-full > figcaption.audio-caption`)){
      npfMediaWrap(a, {
        addType: "audio_row"
      })
    }

    // IMAGES: LEGACY inline images: add <a> anchor to images that don't have them
    // example: glen-test.tumblr.com/post/738994635798691840
    for(let img of document.querySelectorAll(`${posts_str} figure[data-orig-src] > img:first-child`)){
      let fig = img.closest("figure[data-orig-src]")
      !fig.matches(".tmblr-full") && fig.classList.add("tmblr-full")
      if(img.matches("[data-orig-width][data-orig-height]")){
        let w = img.dataset.origWidth
        let h = img.dataset.origHeight

        let a = document.createElement("a")
        a.classList.add("post_media_photo_anchor")
        a.dataset.bigPhoto = img.src
        a.dataset.bigPhotoWidth = w
        a.dataset.bigPhotoHeight = h

        img.classList.add("post_media_photo","image")
        img.before(a)
        a.append(img)
      }

      if(!(fig.closest(".npf_row"))){
        makeRow({
          wrap: fig,
          addType: "photo_row"
        })
      }
    }

    // IMAGES: NPF inline images: wrap in row
    // example: glen-test.tumblr.com/post/790249320660205568
    for(let img of document.querySelectorAll(`${posts_str} .tmblr-full:not(.npf_row .tmblr-full) > a.post_media_photo_anchor > img.post_media_photo`)){
      let tf = img.closest(".tmblr-full:not(.npf_row .tmblr-full)")
      makeRow({
        wrap: tf,
        addType: "photo_row"
      })
    }

    // IMAGES: gifs with attribution: wrap in row
    // example: demo.tumblr.com/post/718863891534413824
    for(let gif of document.querySelectorAll(`${posts_str} .tmblr-full[data-tumblr-attribution] > img`)){
      let tf = gif.closest(".tmblr-full")
      !gif.matches(".post_media_image") && gif.classList.add("post_media_image")

      let hug
      if(!gif.closest("a.post_media_photo_anchor") && tf.matches("[data-orig-width]:not([data-orig-width=''])[data-orig-height]:not([data-orig-height=''])")){
        let a = document.createElement("a")
        a.classList.add("post_media_photo_anchor")
        a.dataset.bigPhotoWidth = tf.dataset.origWidth
        a.dataset.bigPhotoHeight = tf.dataset.origHeight
        tf.before(a)
        a.append(tf)
        hug = a
      } else {
        hug = a
      }
      
      if(!hug.closest(".npf_row")){
        makeRow({
          wrap: hug,
          addType: "photo_row"
        })
      }
      else {
        hug.closest(".npf_row").classList.add("npf_photo_row")
      }
    }

    // IMAGES: row > single col, get rid of the npf_col since it's not technically necessary
    // example: tumblr.com/glen-px/807604887709990912
    for(let col of document.querySelectorAll(`${posts_str} .npf_row > .npf_col:only-child`)){
      col.replaceWith(...col.childNodes)
    }

    // IMAGES: multi-col: add identifier to ROW
    for(let col of document.querySelectorAll(`${posts_str} .npf_row > .npf_col + .npf_col`)){
      let row = col.closest(".npf_row")
      row.classList.add("npf_photo_row")
    }

    // IMAGES: single col: add identifier to ROW
    for(let img_single of document.querySelectorAll(`${posts_str} .npf_row > .tmblr-full > a.post_media_photo_anchor > img.post_media_photo`)){
      let row = img_single.closest(".npf_row")
      row.classList.add("npf_photo_row")
    }

    // wrap .npf_rows into a .npf_inst
    let erays = ["npf_photo_row", "npf_video_row", "npf_audio_row"]
    for(let row of document.querySelectorAll(`${posts_str} .npf_row:first-of-type:not(.npf_row .npf_row, .npf_inst .npf_row)`)){
      let parent = row.parentNode
      parent && wrapSiblings(parent, ".npf_row", {
        tag: "div",
        className: "npf_inst"
      }, newInsts => {
        for(let npf_inst of newInsts){
          let rowsClasses = []
          for(let row of npf_inst.children){
            if(row.matches(".npf_row")){
              rowsClasses.push(row.classList.value.split(" ").filter(x => x !== "npf_row"))
            }
          }

          // only 1 row, therefore npf_inst type == row 1's type
          if(rowsClasses.length == 1){
            let firstRow = rowsClasses[0]

            // add to npf_inst and remove class(es) from npf_row
            for(let eray of erays){
              if(firstRow.includes(eray)){
                npf_inst.classList.add(eray.substring(0,eray.lastIndexOf("_row")) + (npf_inst.querySelector(".npf_col") ? "_set" : "_single"))
                firstRow = firstRow.filter(x => x !== eray)
              }
            }
          }//end: single row

          // more than 1 row, find overlapping npf classes
          else if(rowsClasses.length > 1){
            for(let i=0; i<rowsClasses.length-1; i++){
              let current = rowsClasses[i]
              let next = rowsClasses[i+1]

              let overlaps = current.filter(type => next.includes(type))

              // multiple rows, same media type
              if(overlaps.length){
                if(overlaps[0] == "npf_photo_row"){
                  npf_inst.classList.add("npf_photo_set")
                }
                
                else if(overlaps[0] == "npf_audio_row"){
                  npf_inst.classList.add("npf_audio_set")
                }
                
                else if(overlaps[0] == "npf_video_row"){
                  npf_inst.classList.add("npf_video_set")
                }
              }

              // multiple rows, different media types
              else {
                npf_inst.classList.add("npf_multimedia")
                wrapSiblings(npf_inst, ".npf_photo_row", {
                  tag: "div",
                  className: ["npf_row_set","npf_photo_set"]
                })
              }
            }
          }//end: multirow
        }//end foreach
      })
    }//edn: wrap npf_rows into npf_inst

    // display number of cols
    for(let photoRow of document.querySelectorAll(`${posts_str} .npf_row.npf_photo_row`)){
      let cols = photoRow.querySelectorAll(".npf_col:not(.npf_col .npf_col)")?.length
      photoRow.setAttribute("columns",cols ? cols : 1)
    }

    // get & apply shortest height of row using either
    // aspect-ratio [or] getting the height
    // depending on what the browser supports
    rowHeights()
    
    // npf cols: undo stretch ([data-ready])
    for(let col of document.querySelectorAll(`${posts_str} .npf_col`)){
      col.dataset.ready = ""
    }
    
    /*>>>>>>>>> NPF LIGHTBOXES <<<<<<<<<*/
    for(let npf_inst of document.querySelectorAll(`${posts_str} .npf_photo_set, ${posts_str} .npf_photo_single`)){
      // collect all images in each instance
      if(npf_inst.querySelector("img")){
        let imgs = []

        npf_inst.querySelectorAll("img").forEach((img, imgIndex) => {
          // remove single photo lightbox if it has one
          // reason: split second of empty color flash before the image loads
          let a = img.closest("a.post_media_photo_anchor")
          if(a && a.matches("[data-big-photo]")){
            a.removeAttribute("data-big-photo")
          }

          let imgW, imgH, lowRES, highRES

          // if: YES SRCSET
          if(img.matches("[srcset]")){
            let srcset = img.getAttribute("srcset");         
            lowRES = img.src
            highRES = srcset.split(",").pop().trim().split(" ")[0] // gets the last img item in [srcset] (largest)

            let ljsze = new Image()
            ljsze.src = highRES
            imgW = ljsze.width
            imgH = ljsze.height

            if(imgW >= vpw*0.9){
              imgW *= 0.7
              imgH *= 0.7
            }
          }

          // if: NO SRCSET
          else {
            lowRES = img.src
            highRES = img.src

            let bigPhotoW = img.closest("[data-big-photo-width]")
            let bigPhotoH = img.closest("[data-big-photo-height]")

            if(bigPhotoW){
              imgW = Number(bigPhotoW.getAttribute("data-big-photo-width"));
            } else {
              imgW = img.width
            }

            if(bigPhotoH){
              imgH = Number(bigPhotoH.getAttribute("data-big-photo-height"))
            } else {
              imgH = img.height
            }
          }

          imgs.push({
            width: imgW,
            height: imgH,
            low_res: lowRES,
            high_res: highRES
          })

          let nonZeroIndex = Math.floor(parseInt(imgIndex)+1)
          img.setAttribute("img-index",nonZeroIndex)

          img.addEventListener("click", () => {
            Tumblr.Lightbox.init(imgs,nonZeroIndex)
          })
        })//end <img> forEach

        // console.log(imgs)
      }//end: npf_inst has imgs
    }//end: .npf_photo_set forEach

    /*>>>>>>>>> PREPEND NPF <<<<<<<<<*/
    if(opts.moveToTop == "yes" || opts.moveToTop === true){

      let captionName = opts.textBlock
      let hasCaption = selExists(captionName)

      let entryName = opts.reblogs
      let hasEntry = selExists(entryName)
      
      // console logs
      // console.log(`hasCaption: ${hasCaption}, ${captionName}`)
      // console.log(`hasEntry: ${hasEntry}, ${entryName}`)
      
      /*========= [CASE: 1] UNNESTED CAPTIONS =========*/
      // unnested captions by neothm & magnusthemes: neothm.com/post/148902138319
      if((window.jQuery || window.$) && $().unnest){
        // console.log("captions style: unnested")

        (!hasEntry && document.querySelector(".tumblr_parent")) ? entryName == ".tumblr_parent" : null // fallback to neo/bev's defaults if not specified

        // is original post
        if(hasCaption && !selExists(entryName)){
          for(let npf_inst of document.querySelectorAll(`${text_posts_str} ${captionName} .npf_inst`)){
            let post = npf_inst.closest("[post-type='text']")
            let prev = npf_inst.previousElementSibling
            let next = npf_inst.nextElementSibling
            let textCapt = npf_inst.closest(captionName)

            if(!prev || (prev && prev.innerHTML.trim() == "")){
              npf_inst.classList.add("photo-origin")
              reassignPostType(post,npf_inst)

              textCapt.before(npf_inst)
              textCapt.classList.add("npf-caption")

              // no next (no caption text), remove text capt completely
              if(!next || (next && next.innerHTML.trim() == "")){
                npf_inst.classList.add("npf-no-caption")
                textCapt.remove()
              }//end no .next()
            }//end no .prev()
          }//end original post's npf_inst forEach
        }//end: is original post

        // is reblog
        else if(selExists(entryName)){
          for(let npf_inst of document.querySelectorAll(`${text_posts_str} ${entryName}:not(:is(${entryName} ~ ${entryName})) .npf_inst`)){
            let post = npf_inst.closest("[post-type='text']")
            let anchor = hasCaption ? npf_inst.closest(captionName) : npf_inst.closest(entryName)
            let currentEntry = npf_inst.closest(entryName)

            let prev = npf_inst.previousElementSibling
            let next = npf_inst.nextElementSibling

            let hasPrev1 = prev && prev.innerHTML.trim() == ""
            let hasPrev2 = prev && (prev.matches("a.tumblr_blog") || prev.matches(`a[href*='tumblr.com/']`))

            if(!prev || hasPrev1 || hasPrev2){
              npf_inst.classList.add("photo-origin")
              reassignPostType(post,npf_inst)

              anchor.before(npf_inst)
              anchor.classList.add("npf-caption")

              // no next (no caption text), remove current entry and add post source if specified
              if(!next || (next && next.innerHTML.trim() == "")){
                npf_inst.classList.add("npf-no-caption")

                if(opts.addSource == "yes" || opts.addSource === true){
                  let findLink = anchor.querySelector("a[href*='tumblr.com/']")
                  if(findLink){
                    let opDupe = findLink.cloneNode(true)
                    opDupe.matches("[class]") && opDupe.removeAttribute("class")

                    if(opDupe.textContent.trim() !== ""){
                      let sourceP = document.createElement("p")
                      sourceP.classList.add("npf-post-source")
                      sourceP.append(opDupe)
                      sourceP.innerHTML = `(Source: ${sourceP.innerHTML})`

                      // user has specified a text block container
                      if(anchor !== currentEntry){
                        anchor.append(sourceP)
                        currentEntry.remove()
                      }
                      
                      // no text block container, therefore place the source AFTER all the reblogs
                      else {
                        let fnparent = currentEntry.parentNode
                        let lastEntry = fnparent.querySelector(`:scope > ${entryName}:last-of-type`)
                        if(lastEntry){
                          lastEntry.after(sourceP)
                          currentEntry.remove()
                        }
                      }
                    }
                  }//end: has link, likely a reblog
                } else {
                  currentEntry.remove()
                }              
              }//end: no .next(), can remove current entry
            }//end no .prev(), can prepend
          }//end npf_inst forEach
        }//end: is reblog
      }//end case 1

      /*========= [CASE: 2] LEGACY BLOCKQUOTE CAPTIONS =========*/
      else if(!entryName){
        // console.log("captions style: legacy blockquotes")

        for(let npf_inst of document.querySelectorAll(`${text_posts_str} .npf_inst`)){
          let post = npf_inst.closest("[post-type='text']")
          let textBlock = npf_inst.closest(captionName)
          if(!textBlock) return;

          // p + blockquote
          for(let bq of textBlock.querySelectorAll("p + blockquote")){
            let p = bq.previousElementSibling
            if(p.querySelector("a.tumblr_blog")){
              p.dataset.npfUser = ""
              bq.dataset.npfBlockquote = ""
            }
          }

          // is original post
          if(!textBlock.querySelector("[data-npf-user]") || !textBlock.querySelector("[data-npf-blockquote]")){
            let next = npf_inst.nextElementSibling

            let m1 = npf_inst.matches(`${opts.textBlock} > .npf_inst:first-child`)
            let m2 = npf_inst.matches(`${opts.textBlock} > :is(h1,h2,p):empty:first-child + .npf_inst`)
            if(m1 || m2){
              npf_inst.classList.add("photo-origin")
              reassignPostType(post,npf_inst)

              textBlock.before(npf_inst)
              textBlock.classList.add("npf-caption")

              if(!next || (next && next.innerHTML.trim() == "")){
                npf_inst.classList.add("npf-no-caption")

                textBlock.innerHTML.trim() == "" && textBlock.remove()
              }
            }
          }

          // is reblogged
          if(!textBlock.matches(".npf-caption")){
            for(let originalBQ of textBlock.querySelectorAll("[data-npf-user] + [data-npf-blockquote]:not(:has([data-npf-blockquote]))")){
              let originalPoster = originalBQ.previousElementSibling
              originalPoster.dataset.npfOriginalPoster = ""
              originalBQ.dataset.npfOriginalCaption = ""

              let next = npf_inst.nextElementSibling

              let m1 = npf_inst.matches("blockquote[data-npf-original-caption] > .npf_inst:first-child")
              let m2 = npf_inst.matches("blockquote[data-npf-original-caption] > :is(h1,h2,p):empty:first-child + .npf_inst")
              if(m1 || m2){
                npf_inst.classList.add("photo-origin")
                reassignPostType(post,npf_inst)

                textBlock.before(npf_inst)
                textBlock.classList.add("npf-caption")

                if(!next || (next && next.innerHTML.trim() == "")){
                  npf_inst.classList.add("npf-no-caption")

                  if(opts.addSource == "yes" || opts.addSource === true){
                    let opDupe = originalPoster.querySelector("a.tumblr_blog").cloneNode(true)

                    if(opDupe.textContent.trim() !== ""){
                      let sourceP = document.createElement("p")
                      sourceP.classList.add("npf-post-source")
                      sourceP.append(opDupe)
                      sourceP.innerHTML = `(Source: ${sourceP.innerHTML})`

                      textBlock.append(sourceP)
                    }
                  }
                  
                  originalPoster.remove()
                  originalBQ.remove()

                  textBlock.innerHTML.trim() == "" && textBlock.remove()
                }
              }
            }//end for loop
          }//end: npf does not have origin yet
        }//end npf_inst forEach
      }//end case 2
      
      /*========= [CASE: 3] MODERN DASHBOARD-STYLE CAPTIONS =========*/
      else if(entryName){
        // console.log("captions style: modern dash-style")

        for(let npf_inst of document.querySelectorAll(`${text_posts_str} .npf_inst`)){
          let post = npf_inst.closest("[post-type='text']")

          // is original post
          if(!npf_inst.closest(entryName)){
            let caption = npf_inst.closest(captionName)
            if(caption){
              let prev = npf_inst.previousElementSibling
              let next = npf_inst.nextElementSibling

              let hasPrev1 = prev && prev.innerHTML.trim() == ""
              let hasPrev2 = prev && (prev.matches("a.tumblr_blog") || prev.matches(`a[href*='tumblr.com/']`))

              if(!prev || hasPrev1 || hasPrev2){
                npf_inst.classList.add("photo-origin")
                reassignPostType(post,npf_inst)

                caption.before(npf_inst)
                caption.classList.add("npf-caption")

                // no next (no caption text), remove currenty entry and add post source if specified
                if(!next || (next && next.innerHTML.trim() == "")){
                  npf_inst.classList.add("npf-no-caption")

                  caption.remove()
                }//end: no .next(), can remove current entry
              }//end no .prev(), can prepend
            }//end: has text block/cont
          }//end: is original post

          // is reblog
          else {
            let anchor = hasCaption ? npf_inst.closest(captionName) : npf_inst.closest(entryName)
            let currentEntry = npf_inst.closest(entryName)

            // is first in reblog trail (original entry)
            if(currentEntry.matches(`${text_posts_str} ${entryName}:not(:is(${entryName} ~ ${entryName}))`)){
              
              let prev = npf_inst.previousElementSibling
              let next = npf_inst.nextElementSibling

              let hasPrev1 = prev && prev.innerHTML.trim() == ""
              let hasPrev2 = prev && (prev.matches("a.tumblr_blog") || prev.matches(`a[href*='tumblr.com/']`))

              if((!prev || hasPrev1 || hasPrev2) && !post.querySelector(".photo-origin")){
                npf_inst.classList.add("photo-origin")
                reassignPostType(post,npf_inst)

                anchor.before(npf_inst)
                anchor.classList.add("npf-caption")

                // no next (no caption text), remove currenty entry and add post source if specified
                if(!next || (next && next.innerHTML.trim() == "")){
                  let findLink = currentEntry.querySelector("a[href*='tumblr.com/']")
                  npf_inst.classList.add("npf-no-caption")

                  if(opts.addSource == "yes" || opts.addSource === true){
                    if(findLink){
                      let opDupe = findLink.cloneNode(true)
                      opDupe.matches("[class]") && opDupe.removeAttribute("class")

                      if(opDupe.textContent.trim() !== ""){
                        let sourceP = document.createElement("p")
                        sourceP.classList.add("npf-post-source")
                        sourceP.append(opDupe)
                        sourceP.innerHTML = `(Source: ${sourceP.innerHTML})`

                        // user has specified a text block container
                        if(anchor !== currentEntry){
                          anchor.append(sourceP)
                          currentEntry.remove()
                        }
                        
                        // no text block container, therefore place the source AFTER all the reblogs
                        else {
                          let fnparent = currentEntry.parentNode
                          let lastEntry = fnparent.querySelector(`:scope > ${entryName}:last-of-type`)
                          if(lastEntry){
                            lastEntry.after(sourceP)
                            currentEntry.remove()
                          }
                        }
                      }
                    }//end: has link, likely a reblog
                  } else {
                    currentEntry.remove()
                  }              
                }//end: no .next(), can remove current entry
              }//end no .prev(), can prepend
            }//end: is original entry (OP post)
          }//end: is reblog
        }//end npf_inst forEach
      }//end case 3
      
    }//end: YES, PREPEND IT

    /*>>>>>>>>> ADD npf-loaded CLASS TO POSTS <<<<<<<<<*/
    // done to avoid duplicate executions on posts that have already been looked at
    // e.g. if user has infinite scroll on a theme
    let pots = document.querySelectorAll(`${posts_str}`)
    let potsArr = []
    pots?.forEach((post,i) => {
      post.classList.add("npf-loaded")
      potsArr.push(post)

      if(i == pots.length-1){
        action?.(potsArr)
      }
    })
  }//end run (end NPFv4Init)

  onReady(() => {
    run(action)

    let iscroll = ((window.jQuery || window.$) && $().infinitescroll) || typeof InfiniteScroll !== "undefined" && !document.documentElement.hasAttribute("has-infinite-scroll")

    if(iscroll){
      document.documentElement.setAttribute("has-infinite-scroll","")
      let oldPostsCount = document.querySelectorAll("[post-type]").length

      let DOMObsvr = new MutationObserver(() => {
        let newPostsCount = document.querySelectorAll("[post-type]").length
        if(newPostsCount > oldPostsCount){
          oldPostsCount = newPostsCount
          run(action)
        }
      })

      DOMObsvr.observe(document.body, {
        childList: true,
        subtree: true
      })
    }
  })
}//end NPFv4