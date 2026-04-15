import Link from "next/link";
import { getProducts } from "@/src/backend/repositories/products";
import { getCategories } from "@/src/backend/repositories/categories";
import { getHeroSlides, getTestimonials, getFaqs } from "@/src/backend/repositories/site-content";

export default async function AdminDashboardPage() {
  const [products, categories, heroSlides, testimonials, faqs] = await Promise.all([
    getProducts(),
    getCategories(),
    getHeroSlides(),
    getTestimonials(),
    getFaqs(),
  ]);

  const stats = [
    {
      label: "Products",
      value: products.length,
      description: `${products.filter((p) => p.inStock).length} in stock`,
      href: "/admin/products",
      color: "bg-green-50 border-green-200 text-green-900",
    },
    {
      label: "Categories",
      value: categories.length,
      description: "Active categories",
      href: "/admin/categories",
      color: "bg-blue-50 border-blue-200 text-blue-900",
    },
    {
      label: "Hero Slides",
      value: heroSlides.length,
      description: "Active slides",
      href: "/admin/content",
      color: "bg-purple-50 border-purple-200 text-purple-900",
    },
    {
      label: "Testimonials",
      value: testimonials.length,
      description: "Customer reviews",
      href: "/admin/content",
      color: "bg-orange-50 border-orange-200 text-orange-900",
    },
  ];

  const quickActions = [
    { label: "Add Product", href: "/admin/products", icon: "+" },
    { label: "Add Category", href: "/admin/categories", icon: "+" },
    { label: "Manage Content", href: "/admin/content", icon: "✏️" },
    { label: "Site Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Dashboard
        </p>
        <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-slate-900">
          Admin Overview
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Manage your store content, products, and settings from this dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group rounded-[1.75rem] border p-6 shadow-sm transition-all hover:shadow-md ${stat.color}`}
          >
            <p className="text-sm font-medium opacity-70">{stat.label}</p>
            <p className="mt-3 font-display text-5xl">{stat.value}</p>
            <p className="mt-2 text-xs opacity-60">{stat.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
                {action.icon}
              </span>
              <span className="font-medium text-slate-900">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-slate-900">Recent Products</h2>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{product.categorySlug}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{product.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    No products yet. Add your first product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Summary */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl text-slate-900">Content Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Hero Slides</span>
              <span className="font-medium text-slate-900">{heroSlides.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Testimonials</span>
              <span className="font-medium text-slate-900">{testimonials.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">FAQs</span>
              <span className="font-medium text-slate-900">{faqs.length}</span>
            </div>
          </div>
          <Link
            href="/admin/content"
            className="mt-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Manage content →
          </Link>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl text-slate-900">Inventory Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Products</span>
              <span className="font-medium text-slate-900">{products.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">In Stock</span>
              <span className="font-medium text-green-700">
                {products.filter((p) => p.inStock).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Out of Stock</span>
              <span className="font-medium text-red-700">
                {products.filter((p) => !p.inStock).length}
              </span>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="mt-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Manage products →
          </Link>
        </div>
      </div>
    </div>
  );
}
