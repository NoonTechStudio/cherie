# Chérie — Step 5: Clients Tab

Build a client directory derived from appointment history. Follow existing design system: white bg, #FFF8F5 accent fills, #E8E2DC borders, Inter font, #6B0F1A burgundy accent.

## Concept
There's no separate "clients" table — clients are derived from unique (client_name, client_mobile) pairs in the `appointments` table, grouped per business.

## 1. `app/(dashboard)/clients/page.tsx`
Server component.

- Fetch all appointments for the business_id
- Group by client_mobile (unique key), aggregating:
  - client_name (most recent)
  - client_mobile
  - client_address (most recent non-null)
  - total_visits (count of appointments)
  - last_visit (max start_date)
  - last_service (service_type of most recent appointment)
- Sort by last_visit descending
- Pass grouped list to a client component for search + display

## 2. `components/clients/clients-list.tsx`
Client component:
- Search bar at top (reuse pattern from appointments search-bar, filter by name or mobile)
- List: hairline-divider container, same style as appointments list — each row: avatar initials (cycling tinted colors), client name + mobile, "X visits" + last service on the right, last visit date below
- Tapping a row opens a Dialog showing:
  - Client info (name, mobile, address)
  - Full appointment history for that client (list of past/upcoming bookings with dates + service types + status badges)
  - "New booking for this client" button → links to `/appointments/new` with client info pre-filled via query params (e.g. `?name=X&mobile=Y&address=Z`)

## 3. Update `app/(dashboard)/appointments/new/page.tsx`
- Read `name`, `mobile`, `address` from searchParams (Next.js useSearchParams)
- Pre-fill the corresponding form fields if present

## Empty state
If no appointments exist yet, show centered message: "No clients yet" + "Your clients will appear here after you add appointments" with icon.

## Notes
- This is read-only aggregation from appointments — no new DB table needed
- Run dev server, confirm: clients tab shows aggregated list, search works, detail dialog shows history, "new booking" pre-fill works
