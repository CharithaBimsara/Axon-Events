import { BellRing, ShieldCheck, Tags } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import LockedButton from '../components/LockedButton';
import { vendors } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

function VendorsPage() {
  const [rates, setRates] = useState(
    vendors.reduce((acc, vendor) => {
      acc[vendor.id] = vendor.negotiatedRate;
      return acc;
    }, {}),
  );

  const totalVendorCommitment = useMemo(
    () => Object.values(rates).reduce((sum, value) => sum + Number(value || 0), 0),
    [rates],
  );

  const sendBulkReminders = () => {
    toast.success('Bulk invoice reminders delivered to vendors with unpaid balances.');
  };

  const generateVendorPortal = () => {
    toast.success('Vendor login portal credentials generated and shared securely.');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Vendor & Supplier Management</h3>
            <p className="text-sm text-slate-500">Track contacts, pricing agreements, and invoice follow-ups.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LockedButton
              requiredPlan="intermediate"
              icon="🔒"
              feature="Send Bulk Invoice Reminders"
              benefit="Automatically remind all vendors about due invoices to protect event cash flow."
              className="w-full sm:w-auto"
              onClick={sendBulkReminders}
            >
              Send Bulk Invoice Reminders
            </LockedButton>

            <LockedButton
              requiredPlan="advanced"
              icon="👑"
              feature="Generate Vendor Login Portal"
              benefit="Enable vendors to self-manage uploads, status updates, and invoice submissions in one secure portal."
              className="w-full sm:w-auto"
              onClick={generateVendorPortal}
            >
              Generate Vendor Login Portal
            </LockedButton>
          </div>
        </div>

        <div className="mt-4 space-y-3 lg:hidden">
          {vendors.map((vendor) => (
            <article key={vendor.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{vendor.name}</p>
                  <p className="text-xs text-slate-500">{vendor.category} • {vendor.priceBand} band</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">{vendor.unpaidInvoices}</p>
              </div>

              <p className="mt-2 text-sm text-slate-600">{vendor.contact}</p>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Reliability Score</span>
                  <span>{vendor.reliabilityScore}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${vendor.reliabilityScore}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 hidden overflow-x-auto soft-scrollbar lg:block">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Vendor</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Reliability</th>
                <th className="px-3 py-3 text-right">Unpaid Invoices</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <p className="font-semibold text-slate-800">{vendor.name}</p>
                    <p className="text-xs text-slate-500">{vendor.priceBand} pricing band</p>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{vendor.category}</td>
                  <td className="px-3 py-3 text-slate-600">{vendor.contact}</td>
                  <td className="px-3 py-3">
                    <div className="w-36">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                        <span>Score</span>
                        <span>{vendor.reliabilityScore}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${vendor.reliabilityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-700">{vendor.unpaidInvoices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel lg:col-span-2">
          <div className="flex items-center gap-2">
            <Tags size={17} className="text-indigo-600" />
            <h4 className="text-base font-extrabold text-slate-900">Manual Price Tracking</h4>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Basic package lets your team keep negotiated vendor rates in one place for faster quotations.
          </p>

          <div className="mt-4 space-y-3">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">{vendor.name}</p>
                  <p className="text-xs text-slate-500">{vendor.category}</p>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  Negotiated Rate
                  <input
                    type="number"
                    min="0"
                    value={rates[vendor.id]}
                    onChange={(event) =>
                      setRates((current) => ({
                        ...current,
                        [vendor.id]: event.target.value,
                      }))
                    }
                    className="w-32 rounded-lg border border-slate-300 px-2 py-1.5 text-right font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </label>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <ShieldCheck size={17} className="text-emerald-600" />
            <h4 className="text-base font-extrabold text-slate-900">Spend Snapshot</h4>
          </div>

          <p className="mt-4 text-sm text-slate-500">Current negotiated commitment across active vendors:</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{formatCurrency(totalVendorCommitment)}</p>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            <p>Intermediate adds automated invoice reminders.</p>
            <p className="mt-2">Advanced adds secure vendor portal access and invoice uploads.</p>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
            <BellRing size={14} />
            Upgrade nudges are active in this page demo
          </div>
        </article>
      </section>
    </div>
  );
}

export default VendorsPage;
