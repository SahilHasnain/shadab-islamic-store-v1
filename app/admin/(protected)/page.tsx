export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Dashboard
        </p>
        <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-slate-900">
          Admin overview
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Phase D sets up admin authentication and the protected shell. CRUD screens
          for products, categories, content, and settings come next.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: "Pending" },
          { label: "Categories", value: "Pending" },
          { label: "Content", value: "Pending" },
          { label: "Settings", value: "Pending" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 font-display text-4xl text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
