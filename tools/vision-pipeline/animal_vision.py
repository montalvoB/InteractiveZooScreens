"""
animal_vision.py

Simulates animal color vision by adjusting image colors based on cone peak wavelengths.

Strategy: instead of an unstable matrix inversion through XYZ space, we compute
per-channel hue/chroma shifts directly from the difference between human and animal
cone peaks, then apply them in a perceptually uniform color space (HSL).

Human reference cone peaks (S, M, L): 420, 535, 565 nm
"""

import numpy as np
from PIL import Image


# ── Govardovskii A1 visual pigment template ───────────────────────────────────

def govardovskii_a1(lam: np.ndarray, lam_max: float) -> np.ndarray:
    """Normalized A1 absorbance curve (Govardovskii et al. 2000)."""
    x = lam_max / lam
    alpha = 0.8795 + 0.0459 * np.exp(-((lam_max - 300) ** 2) / 11940)
    absorbance = 1.0 / (
        np.exp(69.7 * (alpha - x))
        + np.exp(28.0 * (0.922 - x))
        + np.exp(-14.9 * (1.104 - x))
        + 0.674
    )
    return absorbance / np.max(absorbance)


# ── sRGB <-> linear helpers ───────────────────────────────────────────────────

def srgb_to_linear(c: np.ndarray) -> np.ndarray:
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def linear_to_srgb(c: np.ndarray) -> np.ndarray:
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1.0 / 2.4) - 0.055)


# ── RGB channel mix from cone peaks ──────────────────────────────────────────

def cone_peaks_to_rgb_matrix(
    animal_peaks: list,
    human_peaks: list,
    lam: np.ndarray,
) -> np.ndarray:
    """
    Build a stable 3x3 linear-RGB mixing matrix from cone sensitivity curves.

    For each animal cone, project its sensitivity onto the human cone basis
    via least-squares. This expresses each animal cone as a mixture of human
    channels — no matrix inversion needed, numerically stable.
    """
    H = np.stack([govardovskii_a1(lam, p) for p in human_peaks])   # (3, L)
    A = np.stack([govardovskii_a1(lam, p) for p in animal_peaks])  # (3, L)

    # Solve: for each animal cone i, find w s.t. A[i] ≈ w @ H (over wavelength)
    # HHt @ w = AHt  =>  w = lstsq solution
    HHt = H @ H.T   # (3, 3)
    AHt = A @ H.T   # (3, 3)
    W, _, _, _ = np.linalg.lstsq(HHt, AHt.T, rcond=None)  # (3, 3)

    M = W.T  # rows = output RGB channels, cols = input RGB channels

    # Soft-clip: prevent any row from summing > 1.5 (avoids blowout)
    row_sums = np.abs(M).sum(axis=1, keepdims=True)
    scale = np.where(row_sums > 1.5, 1.5 / row_sums, 1.0)
    return M * scale


# ── Oil-droplet effect: vectorized saturation + exposure ─────────────────────

def apply_oil_droplet_effect(
    arr: np.ndarray,
    saturation_scale: float,
    exposure_scale: float,
) -> np.ndarray:
    """
    arr: float32 (H, W, 3) in [0, 1] sRGB.
    Boosts saturation and scales brightness to simulate oil-droplet effects.
    Fully vectorized.
    """
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    delta = cmax - cmin
    L = (cmax + cmin) / 2.0

    denom = 1.0 - np.abs(2 * L - 1.0)
    S = np.where(denom > 1e-8, delta / denom, 0.0)
    S = np.clip(S * saturation_scale, 0, 1)

    eps = 1e-8
    H = np.zeros_like(r)
    m = delta > eps
    H[m & (cmax == r)] = ((g - b)[m & (cmax == r)] / delta[m & (cmax == r)]) % 6
    H[m & (cmax == g)] = (b - r)[m & (cmax == g)] / delta[m & (cmax == g)] + 2
    H[m & (cmax == b)] = (r - g)[m & (cmax == b)] / delta[m & (cmax == b)] + 4
    H = H / 6.0

    C = (1.0 - np.abs(2 * L - 1.0)) * S
    X = C * (1.0 - np.abs((H * 6.0) % 2 - 1.0))
    m2 = L - C / 2.0

    h6 = (H * 6.0).astype(int) % 6
    zz = np.zeros_like(C)
    R2 = np.select([h6==0, h6==1, h6==2, h6==3, h6==4, h6==5], [C, X, zz, zz, X, C])
    G2 = np.select([h6==0, h6==1, h6==2, h6==3, h6==4, h6==5], [X, C, C, X, zz, zz])
    B2 = np.select([h6==0, h6==1, h6==2, h6==3, h6==4, h6==5], [zz, zz, X, C, C, X])

    out = np.stack([R2 + m2, G2 + m2, B2 + m2], axis=-1)
    return np.clip(out * exposure_scale, 0, 1)


# ── Main function ─────────────────────────────────────────────────────────────

def simulate_animal_vision(
    image,
    animal_cone_peaks_nm,
    human_cone_peaks_nm=None,
    oil_droplet_saturation=1.35,
    oil_droplet_exposure=0.85,
    lam_range=(380, 700),
    lam_steps=321,
):
    """
    Approximate how an animal with the given cone sensitivities perceives an image.

    Parameters
    ----------
    image : PIL.Image (RGB)
    animal_cone_peaks_nm : list of 3 floats
        Animal cone peak wavelengths in nm, short to long.
        Example for Fiji iguana (3-cone): [455, 495, 565]
    human_cone_peaks_nm : list of 3 floats or None
        Human S/M/L cone peaks. Defaults to [420, 535, 565].
    oil_droplet_saturation : float
        Saturation multiplier (>1 = more vivid). Mimics pigmented oil droplets.
    oil_droplet_exposure : float
        Brightness multiplier (<1 = dimmer). Mimics quantum-catch cost.
    """
    if human_cone_peaks_nm is None:
        human_cone_peaks_nm = [420, 535, 565]

    lam = np.linspace(lam_range[0], lam_range[1], lam_steps)
    M = cone_peaks_to_rgb_matrix(animal_cone_peaks_nm, human_cone_peaks_nm, lam)

    img = image.convert("RGB")
    arr = np.array(img, dtype=np.float32) / 255.0
    lin = srgb_to_linear(arr)

    h, w, _ = lin.shape
    mixed = (M @ lin.reshape(-1, 3).T).T
    mixed = np.clip(mixed, 0, 1).reshape(h, w, 3)

    out = linear_to_srgb(mixed).astype(np.float32)
    out = apply_oil_droplet_effect(np.clip(out, 0, 1), oil_droplet_saturation, oil_droplet_exposure)

    return Image.fromarray((out * 255).astype(np.uint8))


# ── Preset animal profiles ────────────────────────────────────────────────────

ANIMAL_PROFILES = {
    "fiji_iguana": {
        "animal_cone_peaks_nm": [455, 495, 565],
        "oil_droplet_saturation": 1.35,
        "oil_droplet_exposure": 0.85,
        "description": "Fiji Banded Iguana (SWS2=455, RH2=495, LWS=565 nm). UV cone excluded.",
    },
    "dog": {
        "animal_cone_peaks_nm": [430, 430, 555],
        "oil_droplet_saturation": 1.0,
        "oil_droplet_exposure": 1.0,
        "description": "Dog dichromat (S~430, L~555 nm).",
    },
    "bigcat": {
        "animal_cone_peaks_nm": [450, 450, 555],
        "oil_droplet_saturation": 1.0,
        "oil_droplet_exposure": 1.0,
        "description": "Big cat dichromat — lion/cheetah (S~450, L~555 nm).",
    },
    "bird": {
        # Passerine 3-cone proxy: SWS=450, MWS=508, LWS=565
        # UV VS-cone (~360 nm) excluded; oil droplets narrow bandwidth -> higher saturation
        "animal_cone_peaks_nm": [450, 508, 565],
        "oil_droplet_saturation": 1.45,
        "oil_droplet_exposure": 0.88,
        "description": "Passerine bird 3-cone proxy (SWS=450, MWS=508, LWS=565). UV VS-cone excluded; oil-droplet saturation applied.",
    },
    "reptile": {
        # Alligator 3-cone proxy (Loew et al.): SWS~460, MWS~520, LWS~560
        "animal_cone_peaks_nm": [460, 520, 560],
        "oil_droplet_saturation": 1.1,
        "oil_droplet_exposure": 1.0,
        "description": "Alligator/reptile 3-cone proxy (SWS=460, MWS=520, LWS=560). UV cone excluded.",
    },
    "mammal": {
        # Rabbit dichromat: S~420, L~500
        "animal_cone_peaks_nm": [420, 420, 500],
        "oil_droplet_saturation": 1.0,
        "oil_droplet_exposure": 1.0,
        "description": "Generic mammal dichromat — rabbit-like (S~420, L~500 nm).",
    },
    "primate": {
        # Old World monkey — very close to human trichromacy
        "animal_cone_peaks_nm": [430, 530, 560],
        "oil_droplet_saturation": 1.0,
        "oil_droplet_exposure": 1.0,
        "description": "Non-human primate trichromat (S~430, M~530, L~560). Close to human.",
    },
    "bee_3cone": {
        "animal_cone_peaks_nm": [344, 436, 544],
        "oil_droplet_saturation": 1.0,
        "oil_droplet_exposure": 0.9,
        "description": "Honeybee visible cones (UV excluded; S=436, G=544 nm).",
    },
}


# ── CLI ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python animal_vision.py <input> <output> [profile|peak1,peak2,peak3]")
        print(f"Profiles: {list(ANIMAL_PROFILES.keys())}")
        sys.exit(1)

    img = Image.open(sys.argv[1])
    profile_arg = sys.argv[3] if len(sys.argv) > 3 else "fiji_iguana"

    if profile_arg in ANIMAL_PROFILES:
        p = ANIMAL_PROFILES[profile_arg]
        print(f"Profile '{profile_arg}': {p['description']}")
        kwargs = {k: v for k, v in p.items() if k != "description"}
    else:
        peaks = [float(x) for x in profile_arg.split(",")]
        print(f"Custom peaks: {peaks} nm")
        kwargs = {"animal_cone_peaks_nm": peaks}

    simulate_animal_vision(img, **kwargs).save(sys.argv[2])
    print(f"Saved -> {sys.argv[2]}")
