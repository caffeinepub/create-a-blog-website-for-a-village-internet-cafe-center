# Specification

## Summary
**Goal:** Update the site to use a newly redesigned logo asset and ensure the header and footer display it correctly.

**Planned changes:**
- Create a new logo image asset in `frontend/public/assets/generated` with a new filename.
- Update all frontend references that currently use `/assets/generated/cafe-logo.dim_512x512.png` to point to the new logo filename (keeping existing alt text).
- Verify header and footer logo rendering remains at existing sizes (`h-10 w-10` in the header, `h-8 w-8` in the footer) without distortion.

**User-visible outcome:** The site header and footer show the refreshed logo with no broken images, while the rest of the site remains unchanged.
