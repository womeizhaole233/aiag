# -*- coding: utf-8 -*-
"""Create transparent-background story portrait PNGs from the merged portrait sources."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


SOURCE_DIR = Path("剧情文案/人物立绘")
OUTPUT_DIR = Path("assets/story/portraits")
PORTRAITS = {
    "林砚秋": SOURCE_DIR / "林砚秋.png",
    "周淼": SOURCE_DIR / "周淼.png",
    "苏池": SOURCE_DIR / "苏池.jpg",
    "粟柏年": SOURCE_DIR / "粟柏年.png",
    "陈怀远": SOURCE_DIR / "陈怀远.png",
    "赵老倔": SOURCE_DIR / "赵老倔.png",
}


def is_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha == 0:
        return True
    # The supplied portraits use a near-white paper background. Keep this
    # conservative enough to avoid gray clothing, but broad enough to catch
    # anti-aliased paper halos.
    return min(red, green, blue) >= 210 and max(red, green, blue) - min(red, green, blue) <= 80


def find_background_mask(image: Image.Image) -> Image.Image:
    width, height = image.size
    pixels = image.load()
    mask = Image.new("L", image.size, 0)
    mask_pixels = mask.load()
    candidate = Image.new("1", image.size, 0)
    candidate_pixels = candidate.load()
    for y in range(height):
        for x in range(width):
            if is_background(pixels[x, y]):
                candidate_pixels[x, y] = 1

    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if mask_pixels[x, y] == 0 and candidate_pixels[x, y]:
            mask_pixels[x, y] = 255
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    # Also remove enclosed white paper regions, such as spaces between arms or
    # legs. Small pale details like badges are kept.
    visited = Image.new("1", image.size, 0)
    visited_pixels = visited.load()
    large_component_threshold = max(800, (width * height) // 6000)

    for y in range(height):
        for x in range(width):
            if visited_pixels[x, y] or not candidate_pixels[x, y] or mask_pixels[x, y]:
                continue
            component = []
            touches_edge = False
            queue.append((x, y))
            visited_pixels[x, y] = 1
            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))
                touches_edge = touches_edge or cx in (0, width - 1) or cy in (0, height - 1)
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height and not visited_pixels[nx, ny] and candidate_pixels[nx, ny] and not mask_pixels[nx, ny]:
                        visited_pixels[nx, ny] = 1
                        queue.append((nx, ny))
            if touches_edge or len(component) >= large_component_threshold:
                for cx, cy in component:
                    mask_pixels[cx, cy] = 255

    return mask


def remove_background(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    background_mask = find_background_mask(image)
    soft_mask = background_mask.filter(ImageFilter.GaussianBlur(0.95))

    red, green, blue, alpha = image.split()
    matte_alpha = Image.eval(soft_mask, lambda value: 255 - value)
    # Preserve any source transparency if a future portrait already has alpha.
    new_alpha = ImageChops.multiply(alpha, matte_alpha)
    image.putalpha(new_alpha)

    bbox = new_alpha.getbbox()
    if bbox:
        image = image.crop(bbox)

    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination)


def main() -> None:
    for name, source in PORTRAITS.items():
        destination = OUTPUT_DIR / f"{name}.png"
        remove_background(source, destination)
        print(f"wrote {destination}")


if __name__ == "__main__":
    main()
