# VendorBridge Judge Pitch

## One-liner

VendorBridge is a Procurement & Vendor Management ERP that digitizes RFQs, quotations, approvals, purchase orders, invoices, audit logs and analytics in one role-based workflow.

## What changed for final polish

- Added a clear Input Center for real demo inputs.
- Kept realistic seed data instead of an empty ERP.
- Added demo-mode messaging and reset behavior.
- Added loading states and clearer success/error messages in the input workflow.
- Added role-based action restrictions.
- Added procurement timeline and AI-style vendor recommendation.
- Added branded invoice PDF generation with GST, company details, terms and signature area.
- Added README screenshots section, API list, architecture notes and deployment placeholders.

## Demo flow

1. Start from the landing page.
2. Explain procurement pain: manual vendor communication, approval delays, invoice tracking issues.
3. Login as Procurement Officer: `officer@vendorbridge.com` / `demo123`.
4. Open Dashboard and show procurement overview.
5. Open Input Center and create a new vendor.
6. Create RFQ and assign vendors.
7. Switch to Vendor account and submit quotation.
8. Switch to Manager account and approve/reject the quotation.
9. Switch back to Procurement Officer and generate PO/invoice.
10. Download branded invoice PDF.
11. Show Reports and Audit Trail.

## Pitch script

VendorBridge is a procurement ERP built to reduce manual inefficiencies in vendor management. Instead of handling RFQs, vendor quotes, approvals, purchase orders and invoices across emails and spreadsheets, VendorBridge brings everything into one workflow. A procurement officer can create RFQs, vendors can submit quotations, managers can approve or reject, and the system can generate purchase orders and branded invoices. The dashboard gives live procurement visibility, while reports and audit logs make the process traceable and judge-friendly. The app also includes realistic seed data and an Input Center so the entire workflow can be demonstrated live without needing database setup.

## Strong judge answers

**Why did you keep demo data?**  
Because ERPs look empty without operational data. We use realistic seed data for instant evaluation and still support live demo inputs through localStorage.

**Is the workflow actually interactive?**  
Yes. Input Center supports creating vendors, RFQs, quotations, approvals, POs and invoices. It persists user-entered records in the browser.

**How would this become production-ready?**  
The included `database/schema.sql` maps the app to a relational schema. Next step is connecting Supabase/PostgreSQL and replacing demo persistence with database CRUD.

**What is the wow feature?**  
The combination of end-to-end procurement workflow, role-specific UX, audit trail, branded invoice PDF, and AI-style vendor recommendation.
