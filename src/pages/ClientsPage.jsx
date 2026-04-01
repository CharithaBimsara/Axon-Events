import { CreditCard, MessageSquareText, NotebookPen } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import LockedButton from '../components/LockedButton';
import { clients } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

function ClientsPage() {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '');
  const [notesByClient, setNotesByClient] = useState(
    clients.reduce((acc, client) => {
      acc[client.id] = client.notes;
      return acc;
    }, {}),
  );

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? clients[0],
    [selectedClientId],
  );

  const sendAutomatedStatusSms = () => {
    toast.success('Automated milestone status SMS sent to all selected clients.');
  };

  const acceptOnlinePayment = (clientName) => {
    toast.success(`Payment request link for ${clientName} generated and shared.`);
  };

  const saveNotes = () => {
    toast.success(`Manual notes saved for ${selectedClient.name}.`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Client Directory</h3>
            <p className="text-sm text-slate-500">Contact history, milestone notes, and payment touchpoints.</p>
          </div>

          <LockedButton
            requiredPlan="intermediate"
            icon="🔒"
            feature="Send Automated Status SMS"
            benefit="Automatically notify clients at each event milestone without manual follow-up."
            onClick={sendAutomatedStatusSms}
            className="w-full sm:w-auto"
          >
            Send Automated Status SMS
          </LockedButton>
        </div>

        <div className="mt-4 space-y-3 lg:hidden">
          {clients.map((client) => (
            <article key={client.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedClientId(client.id)}
                  className="text-left"
                >
                  <p className="font-semibold text-slate-800">{client.name}</p>
                  <p className="text-xs text-slate-500">{client.eventType} • {client.tier}</p>
                </button>
                <p className="text-sm font-semibold text-slate-800">{formatCurrency(client.balanceDue)}</p>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p>{client.phone}</p>
                <p className="break-all">{client.email}</p>
                <p className="sm:col-span-2">
                  <span className="font-semibold text-slate-700">Next:</span> {client.nextMilestone}
                </p>
              </div>

              <LockedButton
                requiredPlan="advanced"
                icon="👑"
                feature="Accept Online Credit Card Payments"
                benefit="Allow clients to pay securely online and instantly sync payment records in your dashboard."
                onClick={() => acceptOnlinePayment(client.name)}
                className="mt-3 w-full px-3 py-2 text-xs"
              >
                <span className="inline-flex items-center gap-1">
                  <CreditCard size={14} />
                  Accept Online Payment
                </span>
              </LockedButton>
            </article>
          ))}
        </div>

        <div className="mt-4 hidden overflow-x-auto soft-scrollbar lg:block">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Client</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Next Milestone</th>
                <th className="px-3 py-3 text-right">Balance</th>
                <th className="px-3 py-3 text-right">Premium Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className="text-left"
                    >
                      <p className="font-semibold text-slate-800">{client.name}</p>
                      <p className="text-xs text-slate-500">{client.eventType} • {client.tier}</p>
                    </button>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    <p>{client.phone}</p>
                    <p className="text-xs text-slate-500">{client.email}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{client.nextMilestone}</td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-700">
                    {formatCurrency(client.balanceDue)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <LockedButton
                      requiredPlan="advanced"
                      icon="👑"
                      feature="Accept Online Credit Card Payments"
                      benefit="Allow clients to pay securely online and instantly sync payment records in your dashboard."
                      onClick={() => acceptOnlinePayment(client.name)}
                      className="px-3 py-2 text-xs"
                    >
                      <span className="inline-flex items-center gap-1">
                        <CreditCard size={14} />
                        Accept Online Payment
                      </span>
                    </LockedButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel lg:col-span-2">
          <div className="flex items-center gap-2">
            <NotebookPen size={17} className="text-indigo-600" />
            <h4 className="text-base font-extrabold text-slate-900">Manual Client Notes</h4>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Basic package keeps communication notes centralized. Select a client and update manually.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {clients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => setSelectedClientId(client.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedClient.id === client.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {client.name}
              </button>
            ))}
          </div>

          <textarea
            value={notesByClient[selectedClient.id] ?? ''}
            onChange={(event) =>
              setNotesByClient((current) => ({
                ...current,
                [selectedClient.id]: event.target.value,
              }))
            }
            className="mt-4 min-h-36 w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={saveNotes}
            className="mt-3 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Save Manual Notes
          </button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <MessageSquareText size={17} className="text-emerald-600" />
            <h4 className="text-base font-extrabold text-slate-900">Upgrade Story</h4>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Basic: store contact data and manage notes manually.
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              Intermediate: trigger automated client SMS updates.
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              Advanced: collect payments online with real-time ledger sync.
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ClientsPage;
