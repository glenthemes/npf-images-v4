#### NPF Images Fix (v4.0) — changelog

> Updates are listed from newest to oldest.

- `2026-10-30, 2:30PM` — **fix:** on NPF photoset rows that contain images of uneven heights (each image's aspect ratio is different, so some images are taller/shorter), taller images would mean that part of the alt text button gets cut off ([Example screenshot](https://64.media.tumblr.com/6651a106e030f58293e1922c4d9b1891/tumblr_inline_szepqvmn5K1qf8af3_1280.png)  •  [Example post](https://tmblr.co/Z2hZ-VhnGo0mOW00))
- `2026-02-22, 3:51PM` — **fix:** `--NPF-Captionless-Add-Source:"yes"` rendering ineffective on themes with unnested captions installed (solution: moved `.npf-post-source` outside of the reblogs section)