import sys
import os
import glob
from PIL import Image

def convert_frames_to_gif(frame_dir, output_gif_path, duration_per_frame_ms=500):
    png_files = sorted(glob.glob(os.path.join(frame_dir, "*.png")))
    if not png_files:
        print(f"[GIF Compiler] No PNG frames found in {frame_dir}")
        sys.exit(1)

    print(f"[GIF Compiler] Compiling {len(png_files)} PNG frames into GIF...")
    images = [Image.open(f) for f in png_files]

    os.makedirs(os.path.dirname(output_gif_path), exist_ok=True)
    images[0].save(
        output_gif_path,
        save_all=True,
        append_images=images[1:],
        optimize=True,
        duration=duration_per_frame_ms,
        loop=0
    )
    print(f"[GIF Compiler] Successfully saved optimized GIF loop at: {output_gif_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python frame_to_gif.py <frame_dir> <output_gif_path> [duration_ms]")
        sys.exit(1)

    f_dir = sys.argv[1]
    out_path = sys.argv[2]
    dur = int(sys.argv[3]) if len(sys.argv) > 3 else 500
    convert_frames_to_gif(f_dir, out_path, dur)
