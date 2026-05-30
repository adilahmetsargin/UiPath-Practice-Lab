"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginPractice() {
  const [message, setMessage] = useState("");
  return (
    <PracticePanel title="Acme Portal Login">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setMessage(data.get("email") === "analyst@example.com" && data.get("password") === "Practice123" ? "Login successful. Welcome, Practice Analyst." : "Invalid credentials. Try analyst@example.com / Practice123.");
        }}
      >
        <label className="grid gap-1 text-sm font-medium">Email<input id="email" name="email" className="rounded-md border p-2" /></label>
        <label className="grid gap-1 text-sm font-medium">Password<input id="password" name="password" type="password" className="rounded-md border p-2" /></label>
        <Button type="submit">Sign in</Button>
      </form>
      {message && <Status text={message} />}
    </PracticePanel>
  );
}

export function OrderFormPractice() {
  const [confirmation, setConfirmation] = useState("");
  return (
    <PracticePanel title="Northwind Order Entry">
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setConfirmation(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
        }}
      >
        <label className="grid gap-1 text-sm font-medium">Customer name<input name="customer" required className="rounded-md border p-2" /></label>
        <label className="grid gap-1 text-sm font-medium">Product<select name="product" className="rounded-md border p-2"><option>Studio License</option><option>Robot Minutes</option><option>Support Plan</option></select></label>
        <label className="grid gap-1 text-sm font-medium">Quantity<input name="quantity" type="number" min="1" defaultValue="1" className="rounded-md border p-2" /></label>
        <label className="grid gap-1 text-sm font-medium">Shipping<select name="shipping" className="rounded-md border p-2"><option>Standard</option><option>Expedited</option><option>Hold for review</option></select></label>
        <Button type="submit" className="md:col-span-2">Submit order</Button>
      </form>
      {confirmation && <Status text={`Order submitted. Confirmation ${confirmation}.`} />}
    </PracticePanel>
  );
}

export function ProductTablePractice() {
  const products = [
    ["Monitor Arm", "Hardware", "$74.00", "18"],
    ["Automation Cloud Seat", "Software", "$120.00", "44"],
    ["Invoice Scanner", "Hardware", "$310.00", "7"],
    ["QA Test Pack", "Service", "$55.00", "23"],
    ["Robot Runtime", "Software", "$480.00", "12"],
    ["Document Template", "Service", "$35.00", "60"]
  ];
  return <DataTable title="Procurement Product Catalog" headers={["Product", "Category", "Price", "Stock"]} rows={products} />;
}

export function InvoiceListPractice() {
  const rows = [
    ["INV-1001", "Blue River Logistics", "$840.00", "2026-06-15", "Pending"],
    ["INV-1002", "Metro Office Supply", "$1,420.00", "2026-06-18", "Review"],
    ["INV-1003", "Northstar Utilities", "$275.50", "2026-06-20", "Paid"],
    ["INV-1004", "Summit Consulting", "$2,300.00", "2026-06-25", "Review"],
    ["INV-1005", "Acme Hosting", "$120.00", "2026-06-30", "Pending"]
  ];
  return <DataTable title="Accounts Payable Invoice Queue" headers={["Invoice", "Vendor", "Amount", "Due date", "Status"]} rows={rows} />;
}

export function DynamicButtonsPractice() {
  const labels = ["Approve", "Process", "Continue", "Submit"];
  const [target, setTarget] = useState(0);
  const [clicked, setClicked] = useState("");
  const buttons = useMemo(() => labels.map((label, index) => `${label} ${Math.floor(Math.random() * 99)}`), [target]);
  return (
    <PracticePanel title="Dynamic Approval Buttons">
      <p className="text-sm text-muted-foreground">Target button data-action: approve-primary</p>
      <div className="flex flex-wrap gap-3">
        {buttons.map((label, index) => (
          <Button key={label} data-action={index === target ? "approve-primary" : `secondary-${index}`} variant={index === target ? "default" : "outline"} onClick={() => setClicked(index === target ? "Correct dynamic button clicked." : "Wrong button clicked.")}>
            {label}
          </Button>
        ))}
      </div>
      <Button variant="secondary" onClick={() => { setTarget((value) => (value + 1) % labels.length); setClicked(""); }}>
        <RotateCcw className="h-4 w-4" />
        Change labels
      </Button>
      {clicked && <Status text={clicked} />}
    </PracticePanel>
  );
}

export function ErrorSimulationPractice() {
  const [message, setMessage] = useState("");
  return (
    <PracticePanel title="Transaction Error Simulator">
      <div className="grid gap-3 md:grid-cols-3">
        <Button onClick={() => setMessage("Success: transaction TX-204 completed.")}><CheckCircle2 className="h-4 w-4" />Success</Button>
        <Button variant="outline" onClick={() => setMessage("Business exception: required invoice amount is missing.")}><AlertTriangle className="h-4 w-4" />Business error</Button>
        <Button variant="outline" onClick={() => setMessage("System exception: browser element was not found before timeout.")}><AlertTriangle className="h-4 w-4" />System error</Button>
      </div>
      {message && <Status text={message} />}
    </PracticePanel>
  );
}

export function SearchPractice() {
  const records = ["invoice automation", "selector repair", "excel data entry", "email notification", "pdf extraction"];
  const [query, setQuery] = useState("");
  const results = records.filter((record) => record.includes(query.toLowerCase()));
  return (
    <PracticePanel title="Knowledge Base Search">
      <label className="grid gap-1 text-sm font-medium">Search keyword<input value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-md border p-2" /></label>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Search className="h-4 w-4" />Result count: {query ? results.length : 0}</div>
      <ul className="grid gap-2">
        {query && results.map((result) => <li key={result} className="rounded-md border bg-slate-50 p-3">{result}</li>)}
      </ul>
    </PracticePanel>
  );
}

export function ExcelEntryPractice() {
  const [rows, setRows] = useState<string[][]>([]);
  return (
    <PracticePanel title="Excel Data Entry Target">
      <form
        className="grid gap-4 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setRows((value) => [...value, [String(data.get("name")), String(data.get("email")), String(data.get("amount")), String(data.get("status"))]]);
          event.currentTarget.reset();
        }}
      >
        <input name="name" required placeholder="Name" className="rounded-md border p-2" />
        <input name="email" required placeholder="Email" className="rounded-md border p-2" />
        <input name="amount" required placeholder="Amount" className="rounded-md border p-2" />
        <select name="status" className="rounded-md border p-2"><option>New</option><option>Review</option><option>Approved</option></select>
        <Button type="submit" className="md:col-span-4">Add row</Button>
      </form>
      <DataTable title="Submitted Rows" headers={["Name", "Email", "Amount", "Status"]} rows={rows} compact />
    </PracticePanel>
  );
}

function PracticePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mx-auto max-w-4xl px-4 py-8"><div className="rounded-lg border bg-white p-6 shadow-sm"><h1 className="mb-5 text-2xl font-semibold">{title}</h1><div className="space-y-5">{children}</div></div></section>;
}

function Status({ text }: { text: string }) {
  return <div id="status-message" className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{text}</div>;
}

function DataTable({ title, headers, rows, compact = false }: { title: string; headers: string[]; rows: string[][]; compact?: boolean }) {
  return (
    <PracticePanel title={title}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr>{headers.map((header) => <th key={header} className="border bg-slate-100 p-3 text-left font-medium">{header}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr key={`${row.join("-")}-${index}`}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border p-3">{cell}</td>)}</tr>)}</tbody>
        </table>
        {compact && rows.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No rows submitted yet.</p>}
      </div>
    </PracticePanel>
  );
}
