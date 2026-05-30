import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const practicePages = [
  { href: "/practice/login-form", title: "Login form", text: "Practice typing credentials, validating errors, and reading success messages." },
  { href: "/practice/order-form", title: "Order form", text: "Enter customer orders and capture confirmation IDs." },
  { href: "/practice/product-table", title: "Product table", text: "Extract table rows, prices, categories, and inventory values." },
  { href: "/practice/invoice-list", title: "Invoice list", text: "Scrape invoice data and classify review items." },
  { href: "/practice/dynamic-buttons", title: "Dynamic buttons", text: "Practice selectors on changing labels and target attributes." },
  { href: "/practice/error-simulation", title: "Error simulation", text: "Trigger errors, retries, screenshots, and exception handling." },
  { href: "/practice/search-page", title: "Search page", text: "Search, click a result, and capture article detail evidence." },
  { href: "/practice/excel-data-entry", title: "Excel data entry", text: "Use spreadsheet-style inputs to populate a web table." }
];

export default function PracticeLabPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Automation targets</p>
        <h1 className="mt-2 text-3xl font-semibold">Practice lab</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">These internal pages behave like simple business apps so you can automate them safely with UiPath.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {practicePages.map((page) => (
          <Card key={page.href}>
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">{page.text}</p>
              <Button asChild variant="outline">
                <Link href={page.href}>
                  Open target
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
