# Carbon → pixelmist migration guide (v0.3.0)

For brdcrmb's screen-by-screen swap from IBM Carbon to pixelmist. Every component below
exists in `@pixelmist/react` (web) **and** `@pixelmist/native` with the same props, unless
noted. All components forward refs and spread `data-*` / `aria-*` / `className` / `style`
onto the root element, so `data-testid` selectors keep working. Field components
(`TextField`, `Search`, `PasswordInput`, `DateInput`, `TextArea`, `Composer`, `Select`,
`ComboBox`, `Checkbox`, `Radio`, `Switch`) spread them onto the inner control instead —
the element your tests type into — with `className` on the wrapper. `InfoTip` puts
`data-testid` on the "?" button. `Progress` has no `tone` prop: `status`
(active/finished/error) drives the tone (progress/settled/danger).

Install (private GitHub Packages — see each package's `publishConfig`):

```bash
npm install @pixelmist/tokens @pixelmist/react @pixelmist/art
# css
import '@pixelmist/tokens/tokens.css';
import '@pixelmist/react/styles.css';
```

## Tone mapping (colour means state)

| pixelmist semantic tone | meaning | legacy status hue |
| --- | --- | --- |
| `attention` | needs a person | `warning` |
| `progress` | in flight | `info` |
| `settled` | done | `success` |
| `inactive` | not in play (incl. zero counts — **a count of zero is never toned**) | neutral |

Tokens: `--pm-color-tones-{tone}-{surface|border|text|strong|on-strong}` per theme,
contrast-gated. `InlineNotification` tones map: error→danger, warning→attention,
success→settled, info→progress.

## Component table (part A of the brief)

| Carbon | pixelmist | prop mapping |
| --- | --- | --- |
| `Button` | `Button` | `kind="primary"`→`variant="primary"`; `kind="secondary"`→`"tertiary"`; `kind="ghost"`→`"ghost"`; `kind="danger"`→`"danger"`; `kind="danger--tertiary"`→`"dangerTertiary"`; `kind="tertiary"`→`"tertiary"`; `size="sm/md/lg"`→`size` (web: 32/40/48px; native md stays 44); `hasIconOnly`+`iconDescription`→`icon`+`label`; `tooltip`→`tooltip` prop; `isLoading`→`loading`; `renderIcon`→`leftIcon`/`rightIcon` |
| `InlineNotification` | `InlineNotification` | `kind="error/warning/success/info"`→`tone`; `title`→`title`; `subtitle`→`subtitle`; `onCloseButtonClick`→`onClose`; `action`→`action={{label,onClick}}`; role: `alert` for error, `status` otherwise |
| `Tag` | `Tag` | `type="red/orange/…"`→`tone="attention/progress/settled/inactive/neutral"`; `variant="outline"`→`variant="outline"`; solid→`variant="highContrast"`; `size="sm/md"`→`size` |
| `FilterableTag` / toggle chip | `SelectableTag` | `selected`→`selected`/`defaultSelected`/`onSelectedChange`; `aria-pressed` |
| `Link` | `Link` | `href`→`href`; `inline`→`variant="inline"` (default); standalone→`variant="standalone"`; external→`external` (adds icon + `rel="noopener noreferrer"`); router link→`as={RouterLink}` |
| `InlineLoading` | `InlineLoading` | `status="active/finished/error"`→`status`; `description`→`label`; `successDescription`→`finishedLabel`; `errorDescription`→`errorLabel` |
| `TextInput` | `TextField` | `labelText`→`label`; `helperText`→`hint`; `invalid`+`invalidText`→`error`; `warn`+`warnText`→`warning`; `size`→`size`; `hideLabel`→`hideLabel`; `readOnly`/`disabled` pass through |
| `PasswordInput` | `PasswordInput` | same as TextField + `hidePasswordLabel`/`showPasswordLabel`→ built-in labelled toggle |
| `Search` | `Search` | `labelText`→`label`; `onClear`→`onClear`; clear button built-in; Escape clears; `value`/`onChange`→`value`/`onValueChange` (+`defaultValue`) |
| `Select` / `SelectItem` | `Select` | `items`+`itemToString`+`itemToValue` (typed) or `options=[{value,label}]`; `labelText`→`label`; `helperText`→`hint`; `invalid`/`invalidText`→`error`; `warn`→`warning`; controlled `value`/`onChange`→`value`/`onValueChange` |
| `Dropdown` | `Select` | same as Select |
| `ComboBox` | `ComboBox` | `items`+`itemToString`; `onChange({selectedItem})`→`onSelect`; input text `value`/`onChange`→`value`/`onValueChange`; APG combobox roles |
| `Checkbox` | `Checkbox` | `checked`/`defaultChecked`/`onChange`→`checked`/`defaultChecked`/`onCheckedChange`; `labelText`→`label`; `indeterminate`→`indeterminate` (`aria-checked="mixed"`); `helperText`→`hint`; `invalid`→`error` |
| `RadioButtonGroup` / `RadioButton` | `RadioGroup` / `Radio` | `value`/`onChange`→`value`/`onValueChange`; `labelText`→`label`; group `helperText`→`hint`, `invalid`→`error` |
| `TextArea` | `TextArea` | `labelText`→`label`; `helperText`→`hint`; `invalid`→`error`; `warn`→`warning`; `enableCounter`+`maxCount`→`showCount`+`maxLength` |
| `Modal` | `Dialog` | `open`/`onRequestClose`→`open`/`onOpenChange`; `modalHeading`→`title`; `modalLabel`→`description`; `primaryButtonText`/`onRequestSubmit`→`primaryAction={{label,onClick,loading}}`; `secondaryButtonText`→`secondaryAction`; `danger`→`danger`; `passiveModal`→`passive`; `size="sm/md/lg"`→`size`; `preventCloseOnClickOutside`→`closeOnOutsideClick={false}`; custom footer→`actions` |
| `ProgressBar` | `Progress` | `value`→`value` (omit = indeterminate); `label`→`label`; `helperText`→`hint`; `type="inline"`→default; status active/finished/error→`status`; now forwardRef + full pass-through |
| `Tabs` / `Tab` / `TabPanels` / `TabPanel` | `Tabs` / `Tabs.List` / `Tabs.Tab` / `Tabs.Panel` | compound API incl. panels: `role="tabpanel"`, `aria-labelledby`/`aria-controls` wired automatically; `value`/`defaultValue`/`onValueChange` |
| `DataTable` (`Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell`) | `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell` | `isSortable`+`onSort`→`sort={{direction,onSort}}` on `TableHeaderCell` (`aria-sort`); sticky header→`stickyHeader`; compact→`density="compact"`; wrapper scrolls sideways, never the page |
| `Popover` (low-level) | `Popover` | `open`/`onOpenChange`; `align`→`placement` (12 placements, auto-flip); `anchor`→`anchor` (ref/element/getter); Escape closes + focus returns to anchor |
| `Tooltip` / `Toggletip` | `Tooltip` / `InfoTip` | `Tooltip`: hover 120ms + focus, stays while hovered, Escape (1.4.13), `role="tooltip"` + `aria-describedby`. `InfoTip`: the "?" beside headings — hover/focus/click-pin, Escape returns focus without reopening, outside click closes |
| `Accordion` / `AccordionItem` | `Disclosure` | `title`→`title`; open state controlled/uncontrolled; grid-rows fold animation, fades in place under reduced motion |
| `DatePicker` / `DatePickerInput` | `DateInput` | one date, ISO `YYYY-MM-DD` value; styled native `<input type="date">` on web, ISO text field on native |
| `Header` / `SideNav` / `SkipToContent` (UIShell) | `AppShell` + `Header` + `SideNav` + `SkipToContent` | `Header`: `productName`, menu button (narrow screens), right slot = children; `SideNav`: `groups=[{heading, links:[{label,href,icon,current}]}]`, `aria-current="page"`, overlay below lg breakpoint, router-agnostic via `linkAs`; `SkipToContent`: `targetId` |
| `Layer` | `Layer` | nested `Layer` automatically takes the next surface token (context provider; `useLayer()`) |
| `Grid` / `Column` | `Grid` | `columns={3}` fixed or `columns={{base:1, md:2, lg:4}}` responsive; `gap` token or px. (Stack/Box also cover most layout needs.) |
| icons (`@carbon/icons-react`) | `@pixelmist/icons` via `Icon` | new: archive, cloud-download, compass, document-export, folder-open, help, external-link, lock, scan, undo, warning, warning-filled, stop-filled, eye, eye-off (60 total) |

## Part B — live views (heatmap / tree)

- Tokens: `--pm-color-dataviz-categorical-0..7`, `--pm-color-dataviz-sequential-0..5`, `--pm-color-dataviz-grid|axis|axis-text` (contrast-gated; categorical ≥3:1 on canvas/surface).
- `ActivityMarker state="working|idle|stopped"` (pulsing ring / steady ring / no ring; still filled marker under reduced motion) + `AgentChip name color state` (`color` = categorical index 0–7 or CSS colour).
- `HoverCard` for chart nodes: `title`, `status` (e.g. a `Tag`), `facts` ("criteria 2 of 3 met"), `agent` (an `AgentChip`); opens on hover and on keyboard focus of an SVG node (`tabIndex={0}`).
- `Legend items=[{label,color}] direction="horizontal|vertical"`.

## Part C — chat with coding agents

- `Composer`: multi-line, Enter sends / Shift+Enter newline, `running` turns Send into Stop, `disabled`, `onAttach` attachment slot.
- `Message markdown` renders a safe markdown subset via `Markdown` (CodeBlock for fenced code, lists, links, inline code, bold/italic — never raw HTML).
- `PermissionPrompt action onAllowOnce onAlwaysAllow onDeny`.
- `PlanList steps=[{label,status: pending|inProgress|done}]`.
- `SessionListItem title project workItem state lastActive`.
- Existing: `Message`, `ToolCall`, `DiffView`, `TypingDots`.

## Part D — pixel art

- `@pixelmist/art/tray/brdcrmb-{idle|working|needs-attention|stopped}-{light|dark}-{16|22|24|32}.png` + `.svg` (polychrome auto-theming) / `.mono.svg` (currentColor).
- `@pixelmist/art/avatars/{beetle|moth|frog|sparrow}-{0..7}.png` (categorical tints) + `.svg`; `manifest.json` lists everything.

## Part E — terminal palette (Rust/ratatui)

`import terminal from '@pixelmist/tokens/terminal.json'` — flat hex per theme:
`background, surface, raised, text, muted, accent, tones.{attention,progress,settled,inactive}.{surface,border,text,strong,onStrong}, status.{success,info,warning,danger}, categorical[8], sequential[6], grid, axis, axisText`.

## Rules that apply everywhere (from the brief)

1. Pass-through: ref + `data-*`/`aria-*`/`className`/`style` land on the root DOM element.
2. Controlled and uncontrolled for anything with state.
3. WCAG 2.2 AA; outline focus ring that never animates; targets ≥24px.
4. Density: web sm 32 / md 40 / lg 48; native md keeps 44.
5. Motion: only opacity/transform/colour; ≤240ms (chart draw/fold/number tween ≤400ms); `--pm-motion-travel` drops to 0 under `prefers-reduced-motion` (fades stay, travel goes).
6. Colour means state: the four tones above; zero is never toned.
7. Themes `daylight` / `terminal` / follow-system; every token pair passes the contrast gate.
8. Prefixed `pm-` classes + CSS custom properties only; no runtime CSS-in-JS; no bare element selectors outside the opt-in reset — pixelmist loads safely beside Carbon.
9. No network: self-hosted fonts/assets, no CDN, no telemetry, no runtime fetches.
10. React 18.3 and 19 (peer range `^18.3.1 || ^19.0.0`).
11. vitest + Testing Library behavior tests per component; Storybook story per component.
12. Dependencies are MIT/Apache-2.0/BSD/ISC only (audited in CI).
13. No third-party brands anywhere (Mistral's and coding-agent vendors' included).


## Gamification primitives (not Carbon — for brdcrmb's gamified UI)

| primitive | web + native API | notes |
| --- | --- | --- |
| `XPBar` | `value max level? showValue? label? hint? size?` | `role=progressbar` with XP `aria-valuetext`; readout tweens ≤400ms (instant under reduced motion); fill is scaleX; tone `progress` |
| `LevelBadge` | `level size?` | medal icon + `Lv n`; always neutral (a level is not a state) |
| `Streak` | `days size?` | flame + `n-day streak`; `attention` when >0, neutral at 0 (zero never toned) |
| `AchievementToast` | `title description? icon? action? onClose? duration?` | settled toast card, `role=status`; auto-dismiss pauses on hover/focus (web), never under reduced motion; `duration=0` = sticky |
| `useTweenedNumber` | `(value, duration?)` | shared tween hook (web: matchMedia, native: `useReducedMotion`) |
| `ToastProvider`/`useToast` | `push({title, description?, tone?, duration?, icon?, action?})` | toasts pause on hover/focus, danger = `role=alert` |
| icons | `flame`, `trophy`, `medal` (+ 64 more) | `@pixelmist/icons`, stroke style, `currentColor` |
