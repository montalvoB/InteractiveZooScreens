"""
generate_exhibit_images.py

Generates animal-vision-filtered versions of exhibit images
for use in the InteractiveZooScreens React Native app.

This script takes a source image and outputs one filtered copy per animal
profile. The outputs are static assets — drop them into the app's
assets/images/animalVisions/filtered/ folder and reference them in AnimalVisionScreen.tsx.

Usage
-----
# Generate the Fiji iguana vision filter:
python generate_exhibit_images.py \
    --input ../../assets/images/animalVisions/originals/fiji.jpeg \
    --output ../../assets/images/animalVisions/filtered/ \
    --animals fiji_iguana

# Generate multiple animals at once:
python generate_exhibit_images.py \
    --input ../../assets/images/animalVisions/originals/fiji.jpeg \
    --output ../../assets/images/animalVisions/filtered/ \
    --animals fiji_iguana dog bird

# Generate ALL available profiles:
python generate_exhibit_images.py \
    --input ../../assets/images/animalVisions/originals/fiji.jpeg \
    --output ../../assets/images/animalVisions/filtered/ \
    --animals all

# Preview what would be generated without writing files:
python generate_exhibit_images.py \
    --input ../../assets/images/animalVisions/originals/fiji.jpeg \
    --output ../../assets/images/animalVisions/filtered/ \
    --animals all \
    --dry-run

Output naming convention
------------------------
The output filename is derived from the input filename + the profile key:
    fiji.jpeg  +  fiji_iguana  ->  fiji-fiji_iguana.jpeg

The original (human vision) image is NOT copied — it stays as-is in originals/.
In AnimalVisionScreen.tsx, the human vision mode just uses the original.

Adding a new exhibit or animal
------------------------------
1. Add a new profile to ANIMAL_PROFILES in animal_vision.py.
2. Place the source exhibit image in assets/images/animalVisions/originals/.
3. Run this script with --animals <your_new_profile_key>.
4. The filtered output lands in assets/images/animalVisions/filtered/.
5. Update VISION_IMAGES in AnimalVisionScreen.tsx to point to the new file.
See README.md for the full workflow.
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow is not installed. Run: pip install -r requirements.txt")
    sys.exit(1)

try:
    from animal_vision import simulate_animal_vision, ANIMAL_PROFILES
except ImportError:
    print("ERROR: Could not import animal_vision.py. Make sure you're running")
    print("       this script from the tools/vision-pipeline/ directory.")
    sys.exit(1)


def generate(input_path: Path, output_dir: Path, animal_keys: list, dry_run: bool):
    if not input_path.exists():
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    stem = input_path.stem          # e.g. "fiji"
    suffix = input_path.suffix      # e.g. ".jpeg"

    print(f"\nSource image : {input_path}")
    print(f"Output dir   : {output_dir}")
    print(f"Profiles     : {animal_keys}")
    if dry_run:
        print("(DRY RUN — no files will be written)\n")
    else:
        print()

    img = Image.open(input_path).convert("RGB")
    print(f"Image size   : {img.width} x {img.height} px\n")

    for key in animal_keys:
        if key not in ANIMAL_PROFILES:
            print(f"  SKIP  '{key}' — not found in ANIMAL_PROFILES. Available: {list(ANIMAL_PROFILES.keys())}")
            continue

        profile = ANIMAL_PROFILES[key]
        out_filename = f"{stem}-{key}{suffix}"
        out_path = output_dir / out_filename

        print(f"  [{key}]")
        print(f"    Description : {profile['description']}")
        print(f"    Cone peaks  : {profile['animal_cone_peaks_nm']} nm")
        print(f"    Saturation  : {profile.get('oil_droplet_saturation', 1.0)}")
        print(f"    Exposure    : {profile.get('oil_droplet_exposure', 1.0)}")
        print(f"    Output      : {out_path}")

        if not dry_run:
            kwargs = {k: v for k, v in profile.items() if k != "description"}
            result = simulate_animal_vision(img, **kwargs)
            result.save(out_path)
            print(f"    Status      : SAVED ✓")
        else:
            print(f"    Status      : (skipped — dry run)")
        print()

    if not dry_run:
        print("Done. Filtered images are in assets/images/animalVisions/filtered/")
        print("Update VISION_IMAGES in AnimalVisionScreen.tsx to reference them.")
        print("See tools/vision-pipeline/README.md for the full workflow.\n")


def main():
    parser = argparse.ArgumentParser(
        description="Generate animal-vision-filtered exhibit images for the zoo app.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--input", required=True,
        help="Path to the source exhibit image (e.g. ../../assets/images/animalVisions/originals/fiji.jpeg)"
    )
    parser.add_argument(
        "--output", required=True,
        help="Directory to write filtered images into (e.g. ../../assets/images/animalVisions/filtered/)"
    )
    parser.add_argument(
        "--animals", nargs="+", required=True,
        help=f"Profile key(s) to generate, or 'all'. Available: {list(ANIMAL_PROFILES.keys())}"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print what would be generated without writing any files."
    )

    args = parser.parse_args()

    if args.animals == ["all"]:
        keys = list(ANIMAL_PROFILES.keys())
    else:
        keys = args.animals

    generate(
        input_path=Path(args.input),
        output_dir=Path(args.output),
        animal_keys=keys,
        dry_run=args.dry_run,
    )


if __name__ == "__main__":
    main()