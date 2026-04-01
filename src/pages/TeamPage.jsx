import { CheckCircle2, Clock4, Sparkles, Users } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

const staffMembers = [
  { id: 'ST-11', name: 'Sachini Perera', role: 'Design Lead', department: 'Design', load: '72%', status: 'Available' },
  { id: 'ST-12', name: 'Malinda Fernando', role: 'Catering Ops', department: 'Catering', load: '64%', status: 'Available' },
  { id: 'ST-13', name: 'Nuwan Jayasuriya', role: 'Logistics Lead', department: 'Logistics', load: '81%', status: 'On Site' },
  { id: 'ST-14', name: 'Tharindu Wickramasinghe', role: 'Floor Manager', department: 'Operations', load: '77%', status: 'Available' },
  { id: 'ST-15', name: 'Dilani Senaratne', role: 'Finance Control', department: 'Finance', load: '58%', status: 'Available' },
  { id: 'ST-16', name: 'Sahan Gunasekara', role: 'Stage Production', department: 'Production', load: '74%', status: 'On Site' },
];

function TeamPage() {
  const { canAccess } = usePlan();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Team Availability Board</h3>
            <p className="text-sm text-slate-500">Role visibility for rapid assignment and on-site coordination.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
            <Users size={14} />
            {staffMembers.length} Active Staff
          </div>
        </div>

        <div className="mt-4 overflow-x-auto soft-scrollbar">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Staff</th>
                <th className="px-3 py-3">Department</th>
                <th className="px-3 py-3">Current Load</th>
                <th className="px-3 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((member) => (
                <tr key={member.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <p className="font-semibold text-slate-800">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{member.department}</td>
                  <td className="px-3 py-3 text-slate-700">{member.load}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <Sparkles size={17} className="text-indigo-600" />
            <h4 className="text-base font-extrabold text-slate-900">Assignment Engine Status</h4>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Intermediate plan enables automatic role-based task routing directly from event detail pages.
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            {canAccess('intermediate')
              ? 'Automation is enabled. Auto-assign can route tasks to available staff by category.'
              : 'Automation is locked in Basic. Tasks are assigned manually one by one.'}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <Clock4 size={17} className="text-indigo-600" />
            <h4 className="text-base font-extrabold text-slate-900">Shift Health</h4>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600">
              Design and Logistics teams are nearing capacity for next week.
            </p>
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
              <CheckCircle2 size={14} className="mr-1 inline" />
              Client-facing response SLA is healthy across all assigned events.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default TeamPage;
