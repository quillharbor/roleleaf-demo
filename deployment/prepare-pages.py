"""Validate the two demo artifacts, then generate a QR from GitHub Pages metadata."""
import argparse
import hashlib
import json
import os
from pathlib import Path
from urllib.parse import urlparse


def prepare(site, base_url):
    site = Path(site).resolve()
    parsed = urlparse(base_url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise ValueError("A configured HTTPS Pages base URL is required")
    record = json.loads((site / "release.json").read_text())
    artifacts = record["artifacts"]
    if len(artifacts) != 2 or sorted(a["platform"] for a in artifacts) != ["android", "chrome"]:
        raise ValueError("Only Android and Chrome demo artifacts are permitted")
    expected = {"index.html"}
    for artifact in artifacts:
        filename = artifact["filename"]
        suffix = ".apk" if artifact["platform"] == "android" else ".zip"
        if Path(filename).name != filename or not filename.endswith(suffix):
            raise ValueError("Unexpected artifact filename")
        data = (site / "files" / filename).read_bytes()
        if len(data) != artifact["bytes"] or hashlib.sha256(data).hexdigest() != artifact["sha256"]:
            raise ValueError("Artifact checksum mismatch: " + artifact["platform"])
        expected.add(filename)
    if {p.name for p in (site / "files").iterdir()} != expected:
        raise ValueError("Unexpected file in demo download directory")
    allowed = {"index.html", "style.css", "app.js", "i18n.js", "messages.js", "logo.png", "release.js", "release.json", "SHA256SUMS", "files", "android-qr.svg", ".nojekyll"}
    if any(p.name not in allowed or p.is_symlink() for p in site.iterdir()):
        raise ValueError("Unexpected site content")
    expected_sums = "".join(f"{a['sha256']}  {a['filename']}\n" for a in artifacts)
    if (site / "SHA256SUMS").read_text() != expected_sums:
        raise ValueError("Checksum manifest mismatch")
    import qrcode
    import qrcode.image.svg
    record["url"] = base_url.rstrip("/") + "/"
    qrcode.make(record["url"] + "#android", image_factory=qrcode.image.svg.SvgPathImage, border=4).save(site / "android-qr.svg")
    (site / "release.json").write_text(json.dumps(record, indent=2) + "\n")
    (site / "release.js").write_text("window.ROLELEAF_RELEASE = " + json.dumps(record) + ";\n")
    print("Verified Android and Chrome artifacts; generated QR for " + record["url"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", type=Path, required=True)
    args = parser.parse_args()
    prepare(args.site, os.environ.get("DEMO_PAGES_URL", ""))
