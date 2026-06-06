# VendorBridge — Procurement & Vendor Management ERP

## Demo credentials

| Role | Email | Password | What to demo |
|---|---|---|---|
| Admin | `admin@vendorbridge.com` | `demo123` | Full access, reports, settings |
| Procurement Officer | `officer@vendorbridge.com` | `demo123` | Vendors, RFQs, POs, invoices |
| Manager / Approver | `manager@vendorbridge.com` | `demo123` | Approval workflow and monitoring |
| Vendor | `vendor@vendorbridge.com` | `demo123` | RFQ tracking and quotation submission |

## Important: demo data strategy

The app also supports real demo inputs through:

```text
/dashboard/input
```

Input Center supports:

- Vendor registration input
- RFQ creation input
- Vendor quotation input
- Approval/rejection input
- Purchase order generation input
- Invoice generation input
- Edit/delete for user-entered vendors
- Loading states and clear success/error messages
- Demo reset button
- Procurement timeline
- AI-style vendor recommendation explanation

User-entered demo records are saved in browser `localStorage`, while the seed data remains available for a polished evaluation demo.


## Architecture

```text
app/
├── api/                    # Health, demo data, AI RFQ, invoice email mock
├── auth/                   # Login and signup
├── dashboard/              # ERP modules
│   ├── input/              # Real demo input workflow center
│   ├── vendors/            # Vendor management
│   ├── rfqs/               # RFQs and RFQ details
│   ├── quotations/         # Quotation comparison
│   ├── approvals/          # Manager approval workflow
│   ├── purchase-orders/    # PO generation and tracking
│   ├── invoices/           # Invoice tracking, email, PDF download
│   ├── reports/            # Analytics
│   └── audit/              # Audit trail
components/
├── ai/                     # ProcureGPT assistant
└── layout/                 # Sidebar/header with role navigation
lib/
├── seed-data.ts            # Realistic procurement demo data
├── demo-workflow.ts        # LocalStorage input persistence helpers
├── types.ts                # Shared ERP types
└── utils.ts                # Formatting helpers
database/
└── schema.sql              # Production-style relational ERP schema
```

## API endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Health check for deployment/demo |
| `GET /api/demo-data` | Returns demo users, vendors, RFQs, quotations, POs, invoices |
| `POST /api/rfq-generate` | AI/fallback RFQ generation |
| `POST /api/chat` | ProcureGPT assistant route |
| `POST /api/invoices/send` | Safe mock invoice email sending |

## Database schema


```text
database/schema.sql
```

It models:

- Users and roles
- Vendors
- RFQs and RFQ items
- Vendor invitations
- Quotations and quotation items
- Approval workflow
- Purchase orders and PO items
- Invoices and tax calculations
- Audit logs

For hackathon demo mode, the app runs without database setup. For production, connect the schema to Supabase/PostgreSQL.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment variables

All integrations are optional for demo mode.

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```
Without these keys, the app still runs with demo data and fallback AI/email responses.
