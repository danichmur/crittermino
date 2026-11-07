#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

LEVEL="${LEVEL:-53}"
RAW="promo/raw/gameplay-${LEVEL}.webm"
AUDIO="promo/audio/audio.wav"
OUT="promo/out"
CREAM="0xfff9f0"
mkdir -p "$OUT"

FPSIN=25
FRAMES=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$RAW")
DUR=$(python3 -c "print(${FRAMES}/${FPSIN})")
# Trim the lingering win-modal tail so the endcard gets its full moment.
GPLEN=$(python3 -c "print(min(${DUR}, 23.5))")
ENDT=3.3
HOOK_OUT=$(python3 -c "print(max(0.5, ${GPLEN}-1.0))")
XF=$(python3 -c "print(${GPLEN}-0.6)")
ENC=(-c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -r 30 -movflags +faststart -c:a aac -b:a 160k -ac 2 -shortest)
echo "level=${LEVEL} dur=${DUR}s gameplay=${GPLEN}s"

# 1) Vertical 9:16 (TikTok / Reels / Shorts) in EN and RU
for LANG in en ru; do
  HOOK="promo/cards/${LANG}/hook.png"
  END="promo/cards/${LANG}/endcard.png"
  ffmpeg -y -hide_banner -loglevel error \
    -t "$GPLEN" -i "$RAW" -loop 1 -t "$ENDT" -i "$END" -loop 1 -framerate 30 -t "$GPLEN" -i "$HOOK" -i "$AUDIO" \
    -filter_complex "\
[0:v]scale=1080:1920:flags=lanczos,fps=30,setsar=1[gp];\
[2:v]scale=1080:-1:flags=lanczos,fps=30,format=rgba,fade=in:st=0.3:d=0.5:alpha=1,fade=out:st=${HOOK_OUT}:d=0.8:alpha=1[hk];\
[gp][hk]overlay=0:150,format=yuv420p,setsar=1[v0];\
[1:v]scale=1080:1920:flags=lanczos,fps=30,setsar=1,format=yuv420p[ec];\
[v0][ec]xfade=transition=fade:duration=0.6:offset=${XF}[vout]" \
    -map "[vout]" -map 3:a "${ENC[@]}" \
    "$OUT/crittermino-vertical-${LANG}-1080x1920.mp4"
  echo "built vertical ${LANG}"
done

# 2) Square 1:1 (Instagram / X) with EN endcard
ffmpeg -y -hide_banner -loglevel error \
  -t "$GPLEN" -i "$RAW" -loop 1 -t "$ENDT" -i "promo/cards/en/endcard.png" -i "$AUDIO" \
  -filter_complex "\
[0:v]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,gblur=sigma=28,eq=brightness=0.06,fps=30,setsar=1[bg];\
[0:v]scale=-1:1040:flags=lanczos[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p,setsar=1[v0];\
[1:v]scale=-1:1080:flags=lanczos,pad=1080:1080:(ow-iw)/2:0:color=${CREAM},fps=30,setsar=1,format=yuv420p[ec];\
[v0][ec]xfade=transition=fade:duration=0.6:offset=${XF}[vout]" \
  -map "[vout]" -map 2:a "${ENC[@]}" \
  "$OUT/crittermino-square-1080x1080.mp4"
echo "built square"

# 3) Horizontal 16:9 (YouTube / X) with EN endcard
ffmpeg -y -hide_banner -loglevel error \
  -t "$GPLEN" -i "$RAW" -loop 1 -t "$ENDT" -i "promo/cards/en/endcard.png" -i "$AUDIO" \
  -filter_complex "\
[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=34,eq=brightness=0.06,fps=30,setsar=1[bg];\
[0:v]scale=-1:1040:flags=lanczos[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p,setsar=1[v0];\
[1:v]scale=-1:1080:flags=lanczos,pad=1920:1080:(ow-iw)/2:0:color=${CREAM},fps=30,setsar=1,format=yuv420p[ec];\
[v0][ec]xfade=transition=fade:duration=0.6:offset=${XF}[vout]" \
  -map "[vout]" -map 2:a "${ENC[@]}" \
  "$OUT/crittermino-horizontal-1920x1080.mp4"
echo "built horizontal"

# 4) Instagram feed 4:5 (looping gameplay over blurred bg)
ffmpeg -y -hide_banner -loglevel error -t "$GPLEN" -i "$RAW" -i "$AUDIO" \
  -filter_complex "\
[0:v]scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350,gblur=sigma=28,eq=brightness=0.06[bg];\
[0:v]scale=-1:1300:flags=lanczos[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,fps=30,setsar=1,format=yuv420p[v]" \
  -map "[v]" -map 1:a "${ENC[@]}" \
  "$OUT/crittermino-feed-1080x1350.mp4"
echo "built feed"

# 5) Reddit GIF (silent, sped up, optimized palette)
ffmpeg -y -hide_banner -loglevel error -t "$GPLEN" -i "$RAW" \
  -vf "setpts=PTS/1.4,fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
  "$OUT/crittermino-reddit.gif"
echo "built gif"

echo "--- outputs ---"
ls -la "$OUT"
