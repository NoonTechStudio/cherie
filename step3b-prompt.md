# Chérie — Step 3b: Polish fixes

Quick fixes to the design system from Step 3.

## 1. Background color
Change page background from #FFF8F5 to **#FFFFFF** (pure white).
Use #FFF8F5 (or #FAF7F4) only for subtle section backgrounds — e.g. stat card fills, the cherry badge container background — not the page itself.

Update `app/layout.tsx` body bg and any other global bg references accordingly.

## 2. Cherry icon fix
Current: cherry-mark.png (already a filled circle) is wrapped in an extra white circular badge with border — looks like a circle-in-circle and the icon disappears.

Fix in `components/layout/app-shell.tsx`:
- Remove the wrapper circle/badge entirely
- Render `<Image src="/icons/cherry-mark.png" width={36} height={36} />` directly, no border/background wrapper

## 3. Audit all pages for missing/incomplete styles
Check these routes and ensure consistent styling (white bg, #E8E2DC borders, Inter font, proper spacing per design tokens from Step 3):
- `app/(dashboard)/dashboard/page.tsx` — verify stat cards, upcoming list still look correct on white bg
- `app/(dashboard)/appointments/page.tsx` — currently a stub heading only; give it: page title "Bookings", empty state message if no appointments, placeholder for list (will be built in Step 4)
- `app/(dashboard)/appointments/new/page.tsx` — currently shows unstyled "New Appointment" heading only; wrap in a proper page layout: title, back button, placeholder form container (Step 4 will add fields) — at minimum make it look intentional, not broken
- `app/(dashboard)/clients/page.tsx` and `app/(dashboard)/settings/page.tsx` if they exist as stubs — same treatment: proper title + "Coming soon" empty state styled consistently (centered icon + text on white bg)
- `app/(onboarding)/setup-business/page.tsx` — verify card still looks good on white page bg (card itself can stay white with border, fine since page is also white — consider subtle shadow or border to distinguish card from page if needed)

## 4. General pass
- Confirm bottom nav still has white bg, hairline top border, looks correct against white page
- Confirm no remaining #FFF8F5 references except intentional accent fills

Run dev server, navigate through all bottom-nav tabs, confirm nothing looks like a broken/unstyled stub.
