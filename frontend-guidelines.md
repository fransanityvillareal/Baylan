# Baylan Frontend Guidelines

This document describes the implemented Baylan UI foundation. It is the source of truth for new screens and UI refactors. Reuse the existing primitives and canonical screens before introducing a new pattern.

## 1. Product UI hierarchy

Baylan has two visual contexts:

1. **Authentication and onboarding** — centered, compact forms for choosing a role, signing in, signing up, and completing provider setup.
2. **Dashboard operations** — a persistent sidebar and header around dense operational pages, tables, filters, modals, drawers, and sidepeeks.

The product currently supports two roles:

- **Doctor:** clinical prescribing and provider onboarding.
- **Pharmacist:** pharmacy onboarding and pharmacist-only prescription QR scanning.

Role selection is preserved through authentication and onboarding. Role-aware UI must use the existing role state rather than creating a second permission or role mechanism.

## 2. Canonical implementations

Use the majority-wins reference for the concern being changed:

| Concern | Implemented reference | Reuse |
| --- | --- | --- |
| Dense operational page | Campaign List, Campaign Review, Prescriptions, Inventory, Appointments | Page shell, toolbar, tabs, filters, tables, mobile list treatment, and pagination rhythm |
| Date and action toolbar | Calendar | Top date/action row and second filter/action row |
| Detail panel | Campaign sidepeek | Width, header, section dividers, property rows, typography, and footer actions |
| Prescription detail | Prescription sidepeek | Same sidepeek foundation, with horizontally scrollable medication table |
| Authentication | AuthForm | Card, logo scale, labels, inputs, buttons, typography, and spacing |
| Provider onboarding | SignupOnboarding | Auth-scale controls inside a role-specific step flow |
| Create/edit modal | Create Prescription, Medicine Form, campaign modals | Compact responsive modal with progressive disclosure |
| Export modal | Campaign export and DataExportModal | Single-column radio groups, helper text, compact footer actions |
| Mobile overlay | ResponsiveModal | Dialog on desktop and drawer on mobile |
| Medicine ordering | `/mport` | Search-first marketplace, category tabs, medicine cards, cart sheet, and pharmacy availability map |

Do not copy a one-off prescription, inventory, or onboarding treatment when one of these references already solves the problem.

## 3. Foundation tokens

### Font and theme

- Font: `Inter Variable`, loaded in `src/index.css` and exposed through the `font-sans` stack.
- Default theme tokens come from CSS variables: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted`, `border-border`, `border-sidebar-border`, `bg-input`, and `ring`.
- Dark operational surfaces use `dark:bg-black` or the shared `dark:bg-[#0a0a0a]` modal/sidepeek surface where already established.
- Use theme tokens before writing a new hex color. Avoid per-component gray values that create visible seams.
- Semantic states use existing success, warning, destructive, and muted colors. Do not encode status with color alone.

### Actual primitive defaults

The shared primitives are smaller than ordinary marketing UI:

- `Button` default: `h-7`, compact `text-xs`, `rounded-md`, `px-2`.
- `Button` large: `h-8`; use for primary page actions and modal footer actions when the surrounding screen uses the larger control rhythm.
- Icon button: `size-7`; larger icon buttons use the existing `icon-lg` variant (`size-8`).
- `Input`: `h-7`, `rounded-md`, `px-2`, `text-sm` base and compact `md:text-xs`.
- `TabsList`: `h-8`, `rounded-lg`, `p-[3px]`; page implementations may use `h-9` when matching the Calendar/Prescriptions toolbar.
- `TableHead`: `h-10 px-2`, `text-xs`, `font-medium`.
- `TableCell`: `p-2`, `text-xs`, vertically centered, whitespace-preserving by default.
- Default radius token: `--radius: 0.625rem`; use `rounded-md` for controls and `rounded-xl` for cards/modal shells.

If a screen intentionally overrides a primitive to `h-8`, keep that override consistent across the whole control group.

## 4. Typography

- Dashboard default: `text-xs` for dense operational content.
- Dashboard page title/month: usually `text-xl` or `text-2xl`, `font-semibold`, `tracking-tight`.
- Section title: `text-xs font-medium` in dense pages; `text-sm` when used as a prominent sidepeek or modal section heading.
- Table headers and cells: `text-xs`; headers are `font-medium`.
- Sidepeek title: `text-sm font-medium`; sidepeek values and body remain compact.
- Auth/onboarding title: `text-xl font-semibold`.
- Auth/onboarding labels and controls: `text-sm`.
- Supporting/helper text: `text-xs` or `text-[11px] text-muted-foreground`.
- Compact badges and timestamps: `text-[10px] font-medium`.
- Use `font-normal` for values and descriptions, `font-medium` for labels/actions, and `font-semibold` for page titles, primary headings, and major values.

Avoid arbitrary display sizes, `font-bold`, and shrinking labels to repair a bad layout. Fix width, wrapping, or scrolling instead.

## 5. Application shell and navigation

### Dashboard shell

- `DashboardLayout` provides the sidebar, `AppHeader`, and the scrollable outlet.
- The dashboard uses a full-height layout with the main content scrolling independently from the shell.
- The desktop header is `h-14`, border-bottomed, opaque, and uses compact breadcrumb typography.
- The mobile quick-create control is a fixed circular action at the bottom-right with a high z-index. Do not add another floating action pattern without a product reason.

### Sidebar

- Use the existing `AppSidebar` and `SidebarMenu` primitives.
- Navigation is grouped into **Clinical Operations** and **Practice Management**.
- Current Clinical Operations entries: Prescriptions, Analytics, Appointments, Inventory, Calendar.
- Current Practice Management entries: Team → Team Management, Settings.
- Use Lucide icons and `isActive` from the route path.
- The sidebar supports expanded and icon-collapsed states; labels must gracefully collapse without changing the icon meaning.
- Do not reintroduce removed navigation such as Prescription Ledger unless the product scope explicitly changes.

### Header and breadcrumbs

- Use `AppHeader` for all dashboard routes.
- Breadcrumbs must describe the actual route and use the existing section names: Clinical Operations, Practice Management, and Core Operations where applicable.
- Do not create a second page-header pattern inside dense operational screens.
- Keep the header action area compact; avoid reintroducing a global campaign search or an unnecessary divider.

## 6. Page layout, toolbars, and tabs

### Dense page shell

- Use a full-width, full-height page with `min-w-0` and a scrollable content region.
- Standard page padding is compact, commonly `p-4` with a slightly tighter left edge where it matches the existing shell.
- Sticky toolbar rows must have an opaque `bg-background dark:bg-black` so content never shows through while scrolling.
- Major dense sections generally use `gap-4`; use larger gaps only for intentionally spacious dashboard content.

### Toolbar order

Use this order for Calendar, Prescriptions, Inventory, Appointments, and similar screens:

1. Top row: navigation/date controls, page title, and the primary action on the opposite side.
2. Tab row: status/category tabs with horizontal overflow when needed.
3. Filter row: date range, search, status/validity filters, export, and refresh.
4. Table/list content and pagination.

Keep tabs and filters in separate visual rows. Preserve a deliberate gap between them; do not merge a tab list into a filter bar.

### Responsive toolbar behavior

- Use `overflow-x-auto` and `w-max` for tab groups so labels do not shrink.
- Desktop actions can be hidden below `md` when a mobile Filter/Export action exists.
- On small screens, stack primary actions when side-by-side controls would become cramped.
- Keep all interactive controls at least the primitive compact height; never sacrifice the hit target for visual density.

## 7. Inputs, filters, and controls

- Use the shared `Input`, `Select`, `Calendar`, `Popover`, `Checkbox`, `Switch`, `RadioGroup`, and `Button` primitives.
- Labels sit above controls with `gap-2`; field groups use `gap-4` unless a denser existing form establishes another rhythm.
- Auth and onboarding controls use `h-8 text-sm` where the existing AuthForm does; dashboard controls generally use the compact primitive scale.
- Selects, date triggers, and filters must match the height, radius, border, and text scale of neighboring inputs.
- Filter menus use a compact popover with clear option rows and a full-width `Clear Filter` action.
- Date range controls should open a calendar/popover; a button that only looks interactive but has no popover is incomplete.
- Optional prototype fields must not disable navigation. Disable an action only when a real product rule blocks it.
- Every control needs a visible label or an accessible label, especially icon-only buttons.

## 8. Tables and data lists

- Use shared `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives.
- The shared table wrapper owns horizontal scrolling with `overflow-x-auto`.
- Use `whitespace-nowrap` for dense operational columns and a deliberate `min-w-*` when all columns cannot fit.
- Prefer scrolling to clipping or squeezing columns into unreadable widths.
- Keep column order, labels, and alignment stable between list tables and sidepeek summaries.
- Use existing hover and selected row states; selected records should be visually distinct but not overpowering.
- Table row actions use `MoreVertical` and a dropdown menu rather than custom text controls.
- Mobile screens use compact cards/list rows instead of forcing every desktop column into the viewport.
- Prescription medication tables inside a sidepeek must scroll horizontally within their own wrapper and must not widen or reflow the sidepeek.
- Inventory stock values are interactive when they open the stock adjustment modal; communicate that with hover/focus behavior while preserving table density.

## 9. Sidepeeks and drawers

- Desktop sidepeek width follows the campaign pattern, approximately `xl:w-[400px]`.
- Surface: `bg-background text-foreground` with the established dark surface and a left border.
- Header: compact title, status badge, close icon, `p-4`, and a bottom border.
- Body: `min-w-0 flex-1 overflow-x-hidden overflow-y-auto`.
- Major sections use `p-4` and a border separator where the canonical sidepeek does.
- Use clear section spacing: do not run labels from one section into the next. Section headings and subsection labels need visible breathing room before property rows.
- Property rows use a stable label column so values align. Values may truncate or wrap without shifting labels.
- Supporting subsection labels such as Patient Information, Hospital Location, and Prescriber Credentials use `text-[10px] text-muted-foreground` and spacing before their rows.
- Sidepeek footer uses a top border, `p-4`, safe bottom padding, vertical actions, and `h-8` buttons.
- Reset nested horizontal scroll when the selected record changes if the panel contains a scrollable table.

## 10. Cards, modals, drawers, and popovers

### Cards and surfaces

- Use `bg-card`/`dark:bg-[#111]` and `border-sidebar-border` for data cards.
- Use `rounded-xl` for form/card shells and `rounded-md` for controls.
- Do not place a bordered card inside another card, modal, drawer, or sidepeek. Use sections, tabs, borders, or flat grouped rows instead.

### ResponsiveModal

- Use `ResponsiveModal` for create, edit, export, QR scanning, and other focused workflows.
- Desktop renders a Dialog; mobile renders a Drawer.
- Default desktop width is compact (`sm:max-w-[425px]`) unless the workflow genuinely needs more space.
- Modal structure: title, short description, flat content sections, then a bordered footer with Cancel and the primary action.
- Modal content should use progressive disclosure. Do not render every step or every secondary field at once.
- Mobile drawers use the existing `max-h-[85dvh]`, internal scrolling, and safe bottom padding from the primitive.
- Modal actions must have real close/submit behavior; a visual Cancel or Export button without an interaction is incomplete.

### Export modal

The implemented export pattern is a compact single-column modal:

- File Format radio group.
- Data Scope radio group with current filtered view and all records counts.
- Included Columns radio group.
- Cancel and context-specific Export action.
- Functional CSV/JSON download with generated filenames.

Keep helper text short and muted. Do not replace these radio groups with large select fields unless there is a clear information-architecture reason.

## 11. Role-aware flows and pharmacist QR scanning

- Role selection begins at `/` and carries `doctor` or `pharmacist` through sign-in, sign-up, onboarding, and dashboard navigation.
- Preserve role in the URL when available and use the stored role fallback already established by auth when dashboard navigation removes query parameters.
- Pharmacist-only prescription actions must be conditionally rendered, not merely disabled for doctors.
- The pharmacist prescription toolbar includes `Scan QR Code` beside `Create Prescription`.
- QR scanning uses the same compact responsive modal language as other actions: scan affordance, short helper copy, and manual prescription-code fallback.
- Use `ScanQrCode`, `Camera`, and `CheckCircle2` Lucide icons for this flow.

## 12. Medicine ordering marketplace (`/mport`)

The standalone `/mport` route is a consumer-style medicine ordering surface, separate from the dashboard shell. It keeps the Baylan foundation while adopting a simpler marketplace flow:

- Use a compact sticky header with brand, delivery location, help, and cart actions.
- Lead with a prominent search field and short supporting copy.
- Use horizontally scrollable category tabs rather than a dense filter toolbar.
- Present medicines as compact cards with medicine name, generic name, strength, form, short description, price, and an Add/quantity control.
- Use the existing `Card`, `Badge`, `Button`, `Input`, `Tabs`, and `Sheet` primitives; do not create a new card or drawer system.
- The cart is a right-side `Sheet` on desktop and the shared responsive behavior on smaller screens. It must support quantity changes and show an estimated total.
- When the cart has items, show nearby pharmacy availability with a map-like surface and pharmacy pins. Pin and pharmacy-list states must reflect whether one pharmacy can fulfill every item in the cart.
- Use Mapbox GL JS for the `/mport` map canvas. Keep the map as an absolute full-workspace layer, initialize it with a public `VITE_MAPBOX_TOKEN`, and render pharmacy markers from longitude/latitude data rather than CSS-positioned placeholders.
- Available pharmacy pins use `MapPin` and a readable “In stock” label. Unavailable pins remain visible but muted when there is a relevant cart selection.
- The availability view must include a list alternative beneath the map so location status is not communicated by geography or color alone.
- Current `/mport` availability uses frontend mock pharmacy data. A production map provider, live geolocation, stock service, checkout, and payment flow should be introduced as separate capabilities rather than embedded into the visual foundation.
- Keep the ordering screen responsive: stack the medicine grid and availability panel on small screens, keep search usable, and avoid forcing the map/list card into a fixed desktop width.

## 13. Icons and status language

- Use Lucide icons only. Do not use emoji, Unicode arrows, improvised glyphs, or text symbols where a Lucide icon exists.
- Dense controls generally use `h-3.5 w-3.5`; standalone actions use `h-4 w-4`; sidepeek property icons use the compact scale.
- Use semantic icons consistently: `CircleAlert` for unavailable/error counts, `CheckCircle2` for success/active states, `MoreVertical` for row actions, `Download` for export/download, `RefreshCw` for refresh, `Printer` for print, and `ScanQrCode` for QR actions.
- Status badges should combine readable text with color and, where useful, a semantic icon.

## 14. Accessibility and interaction quality

- Associate every label with its input/select or use an explicit accessible label.
- Preserve keyboard focus and visible focus rings for buttons, tabs, table rows, menus, drawers, and pagination.
- Keep icon-only actions labeled with `aria-label`.
- Do not rely on hover alone to expose important information or actions.
- Do not use truncation unless the complete value remains available through wrapping, scrolling, a tooltip, or the sidepeek.
- Separate destructive actions from the primary action and use the destructive variant or existing confirmation dialog.
- Keep modal and drawer focus behavior delegated to the shared primitives.

## 15. Implementation and review rules

Before building a new UI pattern:

1. Search for an existing implementation in Campaigns, Calendar, Prescriptions, Inventory, Appointments, AuthForm, or the shared UI primitives.
2. Reuse the component and its classes where possible.
3. If a new variant is required, document why the canonical pattern cannot support it.
4. Keep data behavior and visual behavior together; a button that has no action is not complete.

Before handoff, verify:

- The screen uses the correct typography hierarchy and theme tokens.
- Inputs, selects, buttons, tabs, badges, and icon buttons share the expected primitive scale.
- Toolbar rows, tab/filter spacing, section rhythm, and page padding match the majority-wins reference.
- Tables scroll intentionally and remain aligned on desktop and mobile.
- Sidepeeks have consistent width, background, labels, padding, section separation, and footer actions.
- Modals are compact, symmetrical, progressive, responsive, and functional.
- Role-specific actions appear only for the correct role.
- All icons are Lucide and semantically appropriate.
- Light/dark surfaces do not create seams or accidental background changes.
- Empty, optional, loading, error, and success states are deliberate.
- `npx prettier --write` and `npm run typecheck` pass after UI changes.
