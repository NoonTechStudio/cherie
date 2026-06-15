# Chérie — Step 4: Appointment Management

Build the core booking feature. Follow Step 3's design system: white bg, #FFF8F5 accent fills, #E8E2DC borders, Inter font, #6B0F1A burgundy accent only.

## 1. New Appointment form — `app/(dashboard)/appointments/new/page.tsx`
Client component, react-hook-form + zod.

Fields:
- Client Name (text, required)
- Mobile Number (text, 10 digits, required)
- Address (text, optional)
- Booking Type (select: "Single Day" | "Date Range")
- Start Date (date picker, required)
- End Date (date picker, only shown/required if Booking Type = Date Range)
- Service Type (select, options depend on business category — fetch business category from business_profiles, show SERVICE_TYPES[category] from lib/constants.ts)

On submit:
1. Get business_id from business_profiles for current user
2. Check for double-booking: query appointments where business_id matches and start_date overlaps with new start_date/end_date range — if conflict found, show warning but allow override (don't hard-block, just warn)
3. Insert into appointments table
4. On success: show success message, redirect to /appointments

UI: Card container, white bg, bordered inputs, burgundy submit button "Save Appointment". Back button (chevron-left) in top-left linking to /appointments.

## 2. Bookings list — `app/(dashboard)/appointments/page.tsx`
Server component.

- Fetch all appointments for business_id, ordered by start_date (upcoming first, then past)
- Search bar at top (client component island) — filters by client_name or client_mobile
- Filter tabs: "Upcoming" | "Past" | "All" (based on start_date vs today)
- List: same hairline-divider container style as dashboard's upcoming list — each row shows avatar initials, client name, service type, date, and a status badge (confirmed/completed/cancelled)
- Tapping a row opens a detail view (can be a dialog/sheet using shadcn Dialog) showing full appointment details: name, mobile, address, dates, service, status
- In the detail dialog: buttons to mark as "Completed" or "Cancelled" (updates status in DB)
- Empty state if no appointments: centered message + "Add your first appointment" CTA linking to /appointments/new

## 3. Search component — `components/appointments/search-bar.tsx`
Client component, controls a query param or local filter state passed to the list.

## 4. Update `lib/constants.ts` if needed
Ensure SERVICE_TYPES export matches what's used (heena_artist / beauty_parlor arrays already defined in Step 1 — reuse).

## 5. Double-booking check helper — `lib/appointments/checkConflict.ts`
Function `checkDateConflict(businessId, startDate, endDate)`:
- Query appointments for business_id where status='confirmed' and date ranges overlap
- Return array of conflicting appointments (empty if none)

## Notes
- Use shadcn `Dialog`, `Badge`, `Select`, `Calendar`/`Popover` for date picking (or native `<input type="date">` if Calendar isn't installed — simpler for now)
- SMS notification (Fast2SMS) is NOT part of this step — that comes later once DLT registration completes. For now, just save to DB.
- Run dev server, confirm: can add an appointment, see it in the list, open detail dialog, mark as completed.
