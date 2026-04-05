# Changelog

## 2026-04-05

FEATURE: Migrate pipeline from localStorage to PostgreSQL with Brand and BrandContact models
FEATURE: Add server actions for brand CRUD operations (create, update, delete, changeStatus, addContact)
CHORE: Import 470 cleaned brands from CSV into production Neon database
FEATURE: Migrate message templates from localStorage to PostgreSQL with MessageTemplate and CustomVariable models
FEATURE: Add server actions for template CRUD operations (create, update, delete, duplicate, incrementUsed, incrementReplied)
CHORE: Import 7 message templates into production Neon database

## 2026-04-04

FEATURE: Add custom variables system to message templates — create, insert, and delete user-defined variables with inline form, auto-generated keys, and smart fallback in use panel

## 2026-04-03

REFACTOR: Redesign all auth pages (signin, signup, forget-password, verify, confirm-delete, goodbye, error) with warm palette and French text
REFACTOR: Replace auth layout grid background with warm cream background and dot pattern
REFACTOR: Style auth buttons, provider buttons, and OTP forms with warm accent color (#C4621D)

## 2026-04-02

REFACTOR: Remove organization pages and redirect all post-login flows to /pipeline
FEATURE: Add Settings page (/pipeline/settings) with warm palette design — profile, email, security, danger zone sections
FEATURE: Add Billing page (/pipeline/billing) with premium dark banner, plan grid, and Stripe portal integration
REFACTOR: Simplify proxy.ts by removing org slug validation logic
REFACTOR: Add Settings and Billing links to pipeline sidebar navigation

## 2026-03-26

FEATURE: Add collapsible sidebar with Pipeline and Messages navigation links, user account dropdown with logout
FEATURE: Add Messages page placeholder with warm-themed empty state
REFACTOR: Wrap pipeline routes in SidebarProvider layout with warm palette CSS variables
REFACTOR: Replace h-screen with h-full on pipeline-page to work within sidebar layout
REFACTOR: Replace sidebar border with box-shadow for depth effect, fix icon centering when collapsed, redesign user dropdown with warm palette
FIX: Replace blue tooltip background with warm dark brown (#3D2314) to match project palette
FEATURE: Add "Templates de Messages" module with create/edit/duplicate/delete, variable system ({{nom_marque}}, {{produit}}, etc.), response rate tracking, performance badges, and "Use template" side panel with copy-to-clipboard
FEATURE: Add template stats dashboard (total templates, total uses, average response rate, best performer)
FEATURE: Add template filters by channel, niche, search, and sort by response rate/usage/date
FEATURE: Include 3 pre-built mock templates (DM Instagram, Email Cold Outreach, Relance J+7) with realistic stats

## 2026-03-20

FIX: Auto-focus notes textarea when opening brand edit dialog, position cursor at end, allow vertical resize and auto-resize on content

## 2026-03-15

FEATURE: Replace date inputs with inline mini-calendar picker for custom date range selection
FEATURE: Add contact count badge in list-view and brand-card (warm pill, darker when > 0)
FIX: Resolve ESLint no-unnecessary-condition error in DateRangeFilter handleDay logic
FEATURE: Add date range filter with presets (today, this week, last week, this month, last month, this year, last year, custom date range)
FEATURE: Add ChannelBadge component with gradient backgrounds for each channel (Instagram, LinkedIn, Email, Formulaire)
FEATURE: Update CommandPalette to accept controlled props (open, onOpenChange, query, onQueryChange, selectedIndex, onSelectedIndexChange)
REFACTOR: Move Cmd+K listener from CommandPalette to pipeline-page.tsx for centralized keyboard handling
REFACTOR: Update search input in navbar to be readOnly with onClick handler to open CommandPalette
REFACTOR: Update list-view and brand-card to display ChannelBadge instead of plain text canal
REFACTOR: Add cursor-pointer to SelectTrigger in list-view for better UX
REFACTOR: Update PipelineCounters to receive filtered brands (pipeline.brands) instead of all brands

## 2026-03-14

FEATURE: Add Cmd+K / Ctrl+K command palette to search brands and contact history
FIX: Remove blue tooltip arrow by rendering InlineTooltip without Radix Arrow element
FIX: Remove white background bar behind pipeline filters (now inherits warm page bg)
FIX: Add cursor-pointer to all action buttons, view toggle, and add brand button
FIX: Click on kanban card or list row now opens edit dialog (stopPropagation on action buttons)
FEATURE: Drag cursor shows grabbing hand on kanban cards (cursor-pointer by default, grabbing when active)

REFACTOR: Move search bar into the sticky navbar header in pipeline-page.tsx
REFACTOR: Simplify pipeline-filters.tsx to show only niche/status/channel selects (search removed)
REFACTOR: Premium warm-themed modals for brand-form-dialog and contact-history-dialog (white bg, #EDE0D0 border, #C4621D accents)
REFACTOR: Warm SelectContent/SelectItem overrides for all pipeline dropdowns (replaces dark default theme)
FEATURE: Entrance animations on kanban cards (staggered fade-in + slide-from-bottom with animationDelay)
FEATURE: View switch animation (animate-in fade-in-0 on key change between Kanban/Liste)

REFACTOR: Complete redesign of Pipeline UI with warm premium color palette (#FAF6F1, #EDE0D0, #3D2314, #C4621D)
REFACTOR: Redesign pipeline-page.tsx with full-bleed background layout and custom header section
REFACTOR: Redesign pipeline-counters.tsx as horizontal 4-column stats strip without card borders
REFACTOR: Redesign pipeline-filters.tsx with inline compact filter bar featuring search with icon
REFACTOR: Redesign brand-card.tsx with rounded-2xl cards, hover shadows, and colored niche badges
REFACTOR: Redesign kanban-view.tsx with colored 3px top borders, drag-over visual feedback, empty state dashed borders
REFACTOR: Redesign list-view.tsx with warm header styling and row hover effects
FEATURE: Add "Pipeline de Prospection" feature for managing brand prospecting pipeline with Kanban and list views, contact history tracking, follow-up reminders, and localStorage persistence
FEATURE: Add brand form dialog with TanStack Form validation for adding/editing brands
FEATURE: Add contact history dialog for tracking brand interactions and responses
FEATURE: Add pipeline counters showing total brands, contacted, in discussion, and deals signed
FEATURE: Add pipeline filters by niche, status, channel, and search
FEATURE: Add Target icon to organization navigation menu for Pipeline access

## 2026-02-16

FEATURE: Add /api/status route with optional random number query parameter
FEATURE: Add /api/status health check route
FEATURE: Add middleware redirect from /admin/interdit to /home

## 2026-01-24

FEATURE: Add "Dismiss all" button to changelog sidebar stack for dismissing multiple changelogs at once

## 2026-01-22

FEATURE: Add changelog system documentation in content/docs/changelog.mdx
FEATURE: Add add-documentation skill with SKILL.md and reference for creating documentation in content/docs/
FEATURE: Add documentation template and create-doc.sh script (mandatory for creating new docs)

## 2026-01-21

FIX: Free plan users now redirect to Stripe checkout instead of billing portal when upgrading

## 2026-01-19

FEATURE: Add x-org-slug header support for /api/orgs/* routes in middleware

## 2026-01-18

CHORE: Add Prisma security and performance rules (orgId filtering, select over include, codebase patterns)
FEATURE: Add domain question to init-project workflow for Resend email configuration (with/without domain support)

## 2026-01-13

CHORE: Remove 14 unused files including admin components, docs components, and utility files
CHORE: Remove 5 unused dependencies (@ai-sdk/openai, ai, @types/react-syntax-highlighter, radix-ui, ts-node) saving ~3MB
REFACTOR: Remove duplicated FileMetadata type from avatar-upload.tsx, import from use-file-upload.ts instead
REFACTOR: Replace session-based organization context with URL slug-based routing using middleware headers for multi-tab support
FIX: Update hasPermission to pass explicit organizationId for Better Auth compatibility
REFACTOR: Move legal and docs links from floating footer to minimal sidebar navigation above Settings button with text-xs

## 2026-01-02

REFACTOR: Add cacheLife("max") to docs, changelog, and posts pages for 30-day cache instead of 15-minute default
REFACTOR: Improve mobile nav user button to show avatar + name/email with dropdown instead of just avatar
FEATURE: Add responsive mobile navigation for documentation with sticky header and sheet sidebar
FIX: Fix documentation page horizontal overflow when description text is too long
FEATURE: Add /add-documentation slash command for creating and updating docs in content/docs/
REFACTOR: Add useDebugPanelAction and useDebugPanelInfo hooks for cleaner debug panel registration with automatic cleanup
FIX: Improve changelog dialog responsiveness on mobile with smaller padding and text sizes

## 2025-12-28

REFACTOR: Replace admin back button with breadcrumb navigation (matching org page style)

## 2025-12-27

REFACTOR: Merge billing info into single card with next payment date, amount, and payment method
FEATURE: Add "Create customer" button to auto-create Stripe customer for organizations
FEATURE: Add inline title editing with org avatar on admin organization detail page
FEATURE: Add coupon code support for admin subscription management (enables 100% off plans without payment method)
REFACTOR: Admin user organizations list uses badges for role and plan instead of text with dots
REFACTOR: Admin user organizations list uses proper ItemGroup pattern with separators and unified border
REFACTOR: Modernize admin subscription UI with plan cards, monthly/yearly toggle, and status indicators
REFACTOR: Feedback detail page uses Item component instead of Card for consistent styling
REFACTOR: Post detail page now matches changelog detail style - max-w-2xl layout, aspect-video image, badges with icons, prose content
REFACTOR: Simplify admin charts with Stripe-style design - hero numbers, no grid, cleaner layout
REFACTOR: Use dot style badges for status indicators in admin user sessions and providers tables
FEATURE: Add MRR growth and user growth charts to admin dashboard with Stripe data
REFACTOR: Remove 15 PostCard variants, keep single clean compact design
REFACTOR: Consolidate image upload components into unified ImageDropzone with avatar/square variants
REFACTOR: Unify sidebar trigger button style across all navigation components
REFACTOR: Add size="lg" to all admin dashboard pages for consistent layout width
CHORE: Add v2.1.0 changelog entry and update image paths
REFACTOR: Changelog timeline with vertical line on left, date labels, and compact cards
FEATURE: Add active state highlighting to content header navigation
FIX: Remove pulsing animation from changelog timeline first item
REFACTOR: Modernize changelog UI with docs-style header, footer, and blog post layout
REFACTOR: Changelog detail page now uses aspect-video image, cleaner badges, and prose styling
REFACTOR: Changelog list page uses card-based layout with hover effects and latest badge

## 2025-12-26

FEATURE: Changelog page timeline view with vertical timeline, version badges, and hover effects
CHORE: Add unit tests for changelog-manager and changelog actions
CHORE: Add E2E tests for changelog dialog flow
FIX: InterceptDialog uses router.refresh() after router.back() to reset parallel route slot state
FIX: InterceptDialog only calls router.back() when closing, not on every state change
FEATURE: Add "Reset Changelog" debug action to restore dismissed changelogs
FEATURE: Debug Panel with draggable/resizable UI, session info, and dynamic action buttons (dev only)
FEATURE: Public changelog system with CardStack animation and timeline UI
FEATURE: Changelog CardStack widget in organization sidebar
FEATURE: Intercepting routes for changelog dialog from any page
FEATURE: Claude Code slash command for creating changelog entries
FEATURE: Add reply button with textarea dialog on feedback detail page
FEATURE: Clickable user Item on feedback detail page navigates to user profile
REFACTOR: Replace feedback table with Item components for cleaner UI

## 2025-12-15

FIX: Remove insecure trusted origins wildcard configuration in auth
FIX: Use hard redirects for impersonation to update profile button immediately
FIX: Breadcrumb path selection slice issue
FIX: Typo in prisma:generate script
FIX: ESLint and TypeScript errors across codebase
FIX: Vitest config ESM conversion
FIX: generateStaticParams for posts in production (Next.js 16 compatibility)

FEATURE: Major performance improvements with refactored application architecture
FEATURE: TanStack Form migration replacing React Hook Form across all forms
FEATURE: Redis caching for improved performance
FEATURE: OTP-based password reset flow
FEATURE: Complete OTP sign-in flow implementation
FEATURE: Responsive provider buttons (full width when single provider)
FEATURE: Global PageProps type for standardized page component typing

REFACTOR: Middleware utilities extraction with admin route protection

CHORE: Update Better-Auth to version 1.3.27
CHORE: Update VSCode snippets and workflow configuration
CHORE: Add environment variables guide
CHORE: Improve type safety in chart and tooltip components
CHORE: Remove unused shadcn-prose dependency

## 2025-08-23

FEATURE: GridBackground component for customizable visual design
FEATURE: Admin feedback system with filters, tables, and detailed views
FEATURE: Documentation system with dynamic content and sidebar navigation
FEATURE: Last used provider tracking for enhanced sign-in experience
FEATURE: Contact and about pages

CHORE: Update Next.js to 15.5.0
CHORE: Update React to 19.1.1
CHORE: Update AI SDK to v5
CHORE: Update all Radix UI component packages
CHORE: Update testing dependencies and build tools
CHORE: Claude Code integration with new agents, commands, and formatting hooks
CHORE: Improve API file organization and documentation structure

## 2025-08-13

FEATURE: Complete admin dashboard with sidebar layout and routing
FEATURE: Admin-only authentication guards with role checking
FEATURE: User management interface with search, pagination, and role filtering
FEATURE: User detail pages with session management and impersonation
FEATURE: Organization management interface with member management
FEATURE: Subscription management with plan changes and billing controls
FEATURE: Payment history with Stripe integration for admin oversight
FEATURE: AutomaticPagination reusable component

REFACTOR: Move billing ownership from User to Organization level
REFACTOR: Migrate stripeCustomerId from User model to Organization model
REFACTOR: Update webhook handlers for organization-based billing
REFACTOR: Replace Better-Auth subscription methods with custom server actions
REFACTOR: Billing page with Card components and Typography

FIX: Remove all `any` type usage in Stripe webhook handlers
FIX: Type compatibility issues across billing system
FIX: Card hover effects replaced with clean styling
FIX: Organization/user names now clickable instead of separate View buttons

## 2025-07-14

FEATURE: Playwright workflow migrated to local CI testing with PostgreSQL service
FEATURE: Comprehensive logging throughout all E2E tests

REFACTOR: Migrate Prisma configuration from package.json to prisma.config.ts
REFACTOR: Rename RESEND_EMAIL_FROM to EMAIL_FROM

FIX: Delete account test case sensitivity issue
FIX: Button state validation and error handling in tests
FIX: External API dependency error catching for build
FIX: DATABASE_URL_UNPOOLED configuration for Prisma
FIX: OAuth secrets renamed (GITHUB to OAUTH_GITHUB)

CHORE: Add all required GitHub secrets for CI testing
CHORE: Enhance Playwright reporter configuration for CI visibility

## 2025-06-01

FEATURE: Orgs-list page to view organization list
FEATURE: Adapter system for email and image upload

FIX: API Error "No active organization"

CHORE: Upgrade libraries to latest versions

## 2025-05-03

FEATURE: NOW.TS deployed app tracker
FEATURE: Functional database seed

## 2025-04-17

FEATURE: Resend contact support

REFACTOR: Prisma with output directory
REFACTOR: Replace redirect method
REFACTOR: Update getOrg logic to avoid bugs

FIX: Navigation styles
FIX: Hydration error

CHORE: Upgrade to Next.js 15.3.0

## 2025-04-06

FEATURE: Better-Auth organization plugin
FEATURE: Better-Auth Stripe plugin
FEATURE: Better-Auth permissions
FEATURE: Middleware authentication handling

REFACTOR: Replace AuthJS with Better-Auth
REFACTOR: Upgrade to Tailwind V4
REFACTOR: Layout and pages upgrade

## 2024-09-12

FEATURE: NEXT_PUBLIC_EMAIL_CONTACT env variable
FEATURE: RESEND_EMAIL_FROM env variable

## 2024-09-08

FEATURE: Add slug to organizations
REFACTOR: Update URL with slug instead of id

## 2024-09-01

FEATURE: NOW.TS version 2 with organizations
