import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock4,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import LockedButton from '../components/LockedButton';
import { usePlan } from '../context/PlanContext';
import { checklistTemplate, events } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

const timelineSteps = [
  { time: 'T-14 Days', task: 'Finalize event design, floor layout, and visual assets', owner: 'Creative Lead' },
  { time: 'T-10 Days', task: 'Confirm all vendor ETAs and contingency suppliers', owner: 'Vendor Manager' },
  { time: 'T-7 Days', task: 'Auto-dispatch task packs to on-site staff teams', owner: 'Operations' },
  { time: 'T-3 Days', task: 'Client-facing progress summary and approval checkpoint', owner: 'Client Success' },
  { time: 'Event Day', task: 'Live execution board with minute-by-minute updates', owner: 'Command Center' },
];

const manualStaffOptions = [
  { id: 'staff-sachini', name: 'Sachini Perera', category: 'Design', role: 'Design Lead', initials: 'SP', tone: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'staff-nuwan', name: 'Nuwan Jayasuriya', category: 'Logistics', role: 'Logistics Lead', initials: 'NJ', tone: 'bg-blue-100 text-blue-700' },
  { id: 'staff-tharindu', name: 'Tharindu Wickramasinghe', category: 'Operations', role: 'Operations Manager', initials: 'TW', tone: 'bg-emerald-100 text-emerald-700' },
  { id: 'staff-malinda', name: 'Malinda Fernando', category: 'Catering', role: 'Catering Ops', initials: 'MF', tone: 'bg-amber-100 text-amber-700' },
  { id: 'staff-dilani', name: 'Dilani Senaratne', category: 'Finance', role: 'Finance Control', initials: 'DS', tone: 'bg-violet-100 text-violet-700' },
  { id: 'staff-sahan', name: 'Sahan Gunasekara', category: 'Production', role: 'Stage Production', initials: 'SG', tone: 'bg-cyan-100 text-cyan-700' },
];

const taskCategoryOptions = ['Design', 'Catering', 'Logistics', 'Operations', 'Finance', 'Production'];

const staffByCategory = {
  Design: { name: 'Sachini Perera', role: 'Design Lead', initials: 'SP', tone: 'bg-fuchsia-100 text-fuchsia-700' },
  Catering: { name: 'Malinda Fernando', role: 'Catering Ops', initials: 'MF', tone: 'bg-amber-100 text-amber-700' },
  Logistics: { name: 'Nuwan Jayasuriya', role: 'Logistics Lead', initials: 'NJ', tone: 'bg-blue-100 text-blue-700' },
  Operations: { name: 'Tharindu Wickramasinghe', role: 'Floor Manager', initials: 'TW', tone: 'bg-emerald-100 text-emerald-700' },
  Finance: { name: 'Dilani Senaratne', role: 'Finance Control', initials: 'DS', tone: 'bg-violet-100 text-violet-700' },
  Production: { name: 'Sahan Gunasekara', role: 'Stage Production', initials: 'SG', tone: 'bg-cyan-100 text-cyan-700' },
};

const fallbackStaff = {
  name: 'Team Ops',
  role: 'General Staff',
  initials: 'TO',
  tone: 'bg-slate-200 text-slate-700',
};

const defaultCreateEventForm = {
  name: '',
  type: 'Wedding',
  date: '',
  venue: '',
  manager: '',
  budget: '',
  spent: '0',
  attendees: '150',
  status: 'Planning',
};

const createChecklistForEvent = (eventId) =>
  checklistTemplate.map((task) => ({
    ...task,
    id: `${eventId}-${task.id}`,
    assignedStaff: null,
  }));

const buildChecklistByEvent = (eventList) =>
  eventList.reduce((acc, eventItem) => {
    acc[eventItem.id] = checklistTemplate.map((task) => ({
      ...task,
      id: `${eventItem.id}-${task.id}`,
      assignedStaff: null,
    }));

    return acc;
  }, {});

const generateEventId = (eventList) => {
  const numericIds = eventList
    .map((eventItem) => Number(String(eventItem.id).replace('EVT-', '')))
    .filter((value) => Number.isFinite(value));

  const next = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 5000;
  return `EVT-${next}`;
};

function EventsPage() {
  const { canAccess } = usePlan();
  const [eventList, setEventList] = useState(events);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [createEventForm, setCreateEventForm] = useState(defaultCreateEventForm);
  const [tasksByEvent, setTasksByEvent] = useState(() => buildChecklistByEvent(events));
  const [autoAssignedByEvent, setAutoAssignedByEvent] = useState({});
  const [assignmentMenuTaskId, setAssignmentMenuTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskValue, setEditingTaskValue] = useState('');
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState(taskCategoryOptions[0]);

  const selectedEvent = useMemo(
    () => eventList.find((eventItem) => eventItem.id === selectedEventId) ?? null,
    [eventList, selectedEventId],
  );

  const selectedTasks = useMemo(() => {
    if (!selectedEvent) {
      return [];
    }

    return tasksByEvent[selectedEvent.id] ?? [];
  }, [selectedEvent, tasksByEvent]);

  const completedTasks = useMemo(
    () => selectedTasks.filter((task) => task.complete).length,
    [selectedTasks],
  );

  const selectedProgress = useMemo(() => {
    if (!selectedEvent || selectedEvent.budget === 0) {
      return 0;
    }

    return Math.round((selectedEvent.spent / selectedEvent.budget) * 100);
  }, [selectedEvent]);

  const showAssignedStaff = selectedEvent
    ? canAccess('intermediate') && Boolean(autoAssignedByEvent[selectedEvent.id])
    : false;

  const updateSelectedTasks = (updater) => {
    if (!selectedEvent) {
      return;
    }

    setTasksByEvent((current) => ({
      ...current,
      [selectedEvent.id]: updater(current[selectedEvent.id] ?? []),
    }));
  };

  const toggleTask = (taskId) => {
    updateSelectedTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              complete: !task.complete,
            }
          : task,
      ),
    );
  };

  const clearChecklistUiState = () => {
    setAssignmentMenuTaskId(null);
    setEditingTaskId(null);
    setEditingTaskValue('');
    setNewTaskLabel('');
    setNewTaskCategory(taskCategoryOptions[0]);
  };

  const openEventDetail = (eventId) => {
    clearChecklistUiState();
    setIsCreatingEvent(false);
    setSelectedEventId(eventId);
  };

  const closeEventDetail = () => {
    clearChecklistUiState();
    setSelectedEventId(null);
  };

  const openCreateEvent = () => {
    clearChecklistUiState();
    setSelectedEventId(null);
    setCreateEventForm(defaultCreateEventForm);
    setIsCreatingEvent(true);
  };

  const cancelCreateEvent = () => {
    setCreateEventForm(defaultCreateEventForm);
    setIsCreatingEvent(false);
  };

  const updateCreateEventField = (field, value) => {
    setCreateEventForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const createEvent = (event) => {
    event.preventDefault();

    const requiredFields = [
      createEventForm.name,
      createEventForm.type,
      createEventForm.date,
      createEventForm.venue,
      createEventForm.manager,
      createEventForm.budget,
    ];

    if (requiredFields.some((field) => String(field).trim() === '')) {
      toast.error('Please complete all required event details.');
      return;
    }

    const budget = Number(createEventForm.budget);
    const spent = Number(createEventForm.spent || 0);
    const attendees = Number(createEventForm.attendees || 0);

    if (!Number.isFinite(budget) || budget <= 0) {
      toast.error('Budget must be a valid number greater than zero.');
      return;
    }

    if (!Number.isFinite(spent) || spent < 0 || spent > budget) {
      toast.error('Spent amount must be between 0 and the total budget.');
      return;
    }

    const eventId = generateEventId(eventList);

    const createdEvent = {
      id: eventId,
      name: createEventForm.name.trim(),
      type: createEventForm.type.trim(),
      date: createEventForm.date,
      venue: createEventForm.venue.trim(),
      status: createEventForm.status,
      budget,
      spent,
      attendees: Number.isFinite(attendees) ? attendees : 0,
      manager: createEventForm.manager.trim(),
    };

    setEventList((current) => [...current, createdEvent]);
    setTasksByEvent((current) => ({
      ...current,
      [eventId]: createChecklistForEvent(eventId),
    }));
    setAutoAssignedByEvent((current) => ({
      ...current,
      [eventId]: false,
    }));

    setCreateEventForm(defaultCreateEventForm);
    setIsCreatingEvent(false);
    setSelectedEventId(eventId);
    toast.success('Event created and added to your board.');
  };

  const assignTask = (taskId, staff) => {
    updateSelectedTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignedStaff: staff,
            }
          : task,
      ),
    );
    setAssignmentMenuTaskId(null);
  };

  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskValue(task.label);
  };

  const saveEditingTask = () => {
    if (!editingTaskId) {
      return;
    }

    const trimmed = editingTaskValue.trim();
    if (!trimmed) {
      setEditingTaskId(null);
      setEditingTaskValue('');
      return;
    }

    updateSelectedTasks((tasks) =>
      tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              label: trimmed,
            }
          : task,
      ),
    );

    setEditingTaskId(null);
    setEditingTaskValue('');
  };

  const deleteTask = (taskId) => {
    updateSelectedTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    if (editingTaskId === taskId) {
      setEditingTaskId(null);
      setEditingTaskValue('');
    }
    if (assignmentMenuTaskId === taskId) {
      setAssignmentMenuTaskId(null);
    }
  };

  const addNewTask = () => {
    const trimmed = newTaskLabel.trim();
    if (!trimmed || !selectedEvent) {
      return;
    }

    const taskId = `${selectedEvent.id}-N-${Date.now()}`;

    updateSelectedTasks((tasks) => [
      ...tasks,
      {
        id: taskId,
        label: trimmed,
        category: newTaskCategory,
        complete: false,
        assignedStaff: null,
      },
    ]);

    setNewTaskLabel('');
  };

  const runAutoAssign = () => {
    if (!selectedEvent) {
      return;
    }

    setTasksByEvent((current) => ({
      ...current,
      [selectedEvent.id]: (current[selectedEvent.id] ?? []).map((task) => ({
        ...task,
        assignedStaff: staffByCategory[task.category] ?? fallbackStaff,
      })),
    }));

    setAutoAssignedByEvent((current) => ({
      ...current,
      [selectedEvent.id]: true,
    }));

    toast.success('Tasks automatically routed to available staff based on roles!');
  };

  const generateTimeline = () => {
    if (!selectedEvent) {
      return;
    }

    toast.success(`Automated timeline regenerated for ${selectedEvent.name}.`);
  };

  const shareClientPortal = () => {
    if (!selectedEvent) {
      return;
    }

    toast.success(`Interactive client portal shared for ${selectedEvent.name}.`);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait" initial={false}>
        {selectedEvent ? (
          <motion.div
            key={`detail-${selectedEvent.id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="space-y-6"
          >
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
              <button
                type="button"
                onClick={closeEventDetail}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <ArrowLeft size={16} />
                ← Back to Events
              </button>

              <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{selectedEvent.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(selectedEvent.date)} • Managed by {selectedEvent.manager}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedEvent.type} • {selectedEvent.venue}
                  </p>
                </div>

                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>Budget Progress</span>
                    <span>{selectedProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${selectedProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {formatCurrency(selectedEvent.spent)} / {formatCurrency(selectedEvent.budget)}
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel xl:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900">Operational Task Checklist</h4>
                    <p className="text-sm text-slate-500">Manual control in Basic, role-based automation in Intermediate.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {completedTasks}/{selectedTasks.length}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex flex-col gap-3 rounded-xl border border-slate-200 px-3 py-3 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs transition ${
                            task.complete
                              ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                              : 'border-slate-300 bg-white text-slate-400 hover:border-indigo-300 hover:text-indigo-500'
                          }`}
                          aria-label={task.complete ? 'Mark task incomplete' : 'Mark task complete'}
                        >
                          {task.complete ? '✓' : ''}
                        </button>

                        <span
                          className="flex-1 min-w-0"
                        >
                          {editingTaskId === task.id ? (
                            <input
                              value={editingTaskValue}
                              onChange={(event) => setEditingTaskValue(event.target.value)}
                              onBlur={saveEditingTask}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  saveEditingTask();
                                }

                                if (event.key === 'Escape') {
                                  setEditingTaskId(null);
                                  setEditingTaskValue('');
                                }
                              }}
                              autoFocus
                              className="w-full rounded-md border border-indigo-300 bg-white px-2 py-1 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                            />
                          ) : (
                            <p className={`text-sm ${task.complete ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                              {task.label}
                            </p>
                          )}
                          <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                            [{task.category}]
                          </span>
                        </span>
                      </div>

                      <div className="flex w-full max-w-64 items-center justify-end gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setAssignmentMenuTaskId((current) => (current === task.id ? null : task.id))
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                          >
                            {task.assignedStaff ? (
                              <>
                                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${task.assignedStaff.tone}`}>
                                  {task.assignedStaff.initials}
                                </span>
                                <span>{task.assignedStaff.name}</span>
                              </>
                            ) : (
                              <>
                                <span>Unassigned</span>
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400">
                                  +
                                </span>
                              </>
                            )}
                            <ChevronDown size={14} />
                          </button>

                          {assignmentMenuTaskId === task.id ? (
                            <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                Assign Staff
                              </p>
                              <div className="space-y-1">
                                {manualStaffOptions.map((staff) => (
                                  <button
                                    key={staff.id}
                                    type="button"
                                    onClick={() => assignTask(task.id, staff)}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-slate-100"
                                  >
                                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${staff.tone}`}>
                                      {staff.initials}
                                    </span>
                                    <span className="font-semibold text-slate-700">{staff.name}</span>
                                    <span className="text-slate-500">[{staff.category}]</span>
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => assignTask(task.id, null)}
                                className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                              >
                                Clear / Unassign
                              </button>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => startEditingTask(task)}
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                            aria-label="Edit task"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                            aria-label="Delete task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Add New Task</p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        value={newTaskLabel}
                        onChange={(event) => setNewTaskLabel(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            addNewTask();
                          }
                        }}
                        placeholder="Task name"
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                      />
                      <select
                        value={newTaskCategory}
                        onChange={(event) => setNewTaskCategory(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                      >
                        {taskCategoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addNewTask}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        <Plus size={14} />
                        Add New Task
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="space-y-6 xl:col-span-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">Automation & Premium Actions</h4>
                      <p className="text-sm text-slate-500">Unlock instant role-based routing and client-facing tools.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
                      <Sparkles size={14} />
                      Upsell Area
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <LockedButton
                      requiredPlan="intermediate"
                      icon="🔒"
                      feature="Auto-Assign Staff Tasks"
                      benefit="Upgrade to the Intermediate Plan to automatically route tasks based on staff roles and save hours of manual work."
                      modalVariant="pricing"
                      onClick={runAutoAssign}
                      className="w-full"
                    >
                      Auto-Assign Staff Tasks
                    </LockedButton>

                    <LockedButton
                      requiredPlan="advanced"
                      icon="👑"
                      feature="Share Interactive Client Portal"
                      benefit="Give clients real-time status visibility, approvals, and milestone tracking in one portal."
                      modalVariant="pricing"
                      onClick={shareClientPortal}
                      className="w-full"
                    >
                      Share Interactive Client Portal
                    </LockedButton>
                  </div>

                  {showAssignedStaff ? (
                    <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-700">
                      Tasks are now routed to available staff by category.
                    </p>
                  ) : null}

                  {canAccess('advanced') ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 size={15} />
                      Advanced client tools are active for this event.
                    </div>
                  ) : null}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">Automated Event Timeline</h4>
                      <p className="text-sm text-slate-500">Live dependency timeline generated by workflow rules.</p>
                    </div>

                    {canAccess('intermediate') ? (
                      <button
                        type="button"
                        onClick={generateTimeline}
                        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                      >
                        <Clock4 size={14} />
                        Refresh
                      </button>
                    ) : null}
                  </div>

                  {canAccess('intermediate') ? (
                    <div className="space-y-2">
                      {timelineSteps.map((step) => (
                        <article
                          key={step.time}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{step.time}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">{step.task}</p>
                          <p className="mt-1 text-xs text-slate-500">Owner: {step.owner}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <p className="text-sm text-slate-600">🔒 Unlock Automated Timeline</p>
                      <LockedButton
                        requiredPlan="intermediate"
                        icon="🔒"
                        feature="Automated Event Timeline"
                        benefit="Upgrade to the Intermediate Plan to generate timeline dependencies and assign deadline owners automatically."
                        modalVariant="pricing"
                        className="mt-3"
                      >
                        Unlock Automated Timeline
                      </LockedButton>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </motion.div>
        ) : isCreatingEvent ? (
          <motion.section
            key="event-create"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel"
          >
            <button
              type="button"
              onClick={cancelCreateEvent}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
              ← Back to Events
            </button>

            <div className="mt-5">
              <h3 className="text-2xl font-extrabold text-slate-900">Create New Event</h3>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the event details. Once saved, it will appear in the Event Board and open in the same detail workflow.
              </p>
            </div>

            <form onSubmit={createEvent} className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Event Name *</span>
                <input
                  value={createEventForm.name}
                  onChange={(inputEvent) => updateCreateEventField('name', inputEvent.target.value)}
                  placeholder="Temple Garden Wedding - Colombo"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Event Type *</span>
                <input
                  value={createEventForm.type}
                  onChange={(inputEvent) => updateCreateEventField('type', inputEvent.target.value)}
                  placeholder="Wedding"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date *</span>
                <input
                  type="date"
                  value={createEventForm.date}
                  onChange={(inputEvent) => updateCreateEventField('date', inputEvent.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Venue *</span>
                <input
                  value={createEventForm.venue}
                  onChange={(inputEvent) => updateCreateEventField('venue', inputEvent.target.value)}
                  placeholder="Grand Vista Ballroom"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Manager *</span>
                <input
                  value={createEventForm.manager}
                  onChange={(inputEvent) => updateCreateEventField('manager', inputEvent.target.value)}
                  placeholder="Nadeesha Perera"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span>
                <select
                  value={createEventForm.status}
                  onChange={(inputEvent) => updateCreateEventField('status', inputEvent.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Concept Phase">Concept Phase</option>
                  <option value="Planning">Planning</option>
                  <option value="Vendor Confirmation">Vendor Confirmation</option>
                  <option value="Execution Ready">Execution Ready</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budget (LKR) *</span>
                <input
                  type="number"
                  min="1"
                  value={createEventForm.budget}
                  onChange={(inputEvent) => updateCreateEventField('budget', inputEvent.target.value)}
                  placeholder="35000"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Spent</span>
                <input
                  type="number"
                  min="0"
                  value={createEventForm.spent}
                  onChange={(inputEvent) => updateCreateEventField('spent', inputEvent.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected Attendees</span>
                <input
                  type="number"
                  min="0"
                  value={createEventForm.attendees}
                  onChange={(inputEvent) => updateCreateEventField('attendees', inputEvent.target.value)}
                  placeholder="200"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <div className="md:col-span-2 mt-2 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelCreateEvent}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                  <Plus size={16} />
                  Create Event
                </button>
              </div>
            </form>
          </motion.section>
        ) : (
          <motion.section
            key="events-list"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Event Board</h3>
                <p className="text-sm text-slate-500">
                  Select an event to open its full management workspace.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {eventList.length} Active Events
                </span>
                <button
                  type="button"
                  onClick={openCreateEvent}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                  <Plus size={14} />
                  Add Event
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto soft-scrollbar">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Event</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Manager</th>
                    <th className="px-3 py-3">Progress</th>
                    <th className="px-3 py-3 text-right">Spent/Budget</th>
                    <th className="px-3 py-3 text-right">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {eventList.map((eventItem) => {
                    const progress = Math.round((eventItem.spent / eventItem.budget) * 100);

                    return (
                      <tr
                        key={eventItem.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openEventDetail(eventItem.id)}
                        onKeyDown={(keyEvent) => {
                          if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                            keyEvent.preventDefault();
                            openEventDetail(eventItem.id);
                          }
                        }}
                        className="group cursor-pointer border-b border-slate-100 transition-all hover:-translate-y-0.5 hover:bg-slate-50"
                      >
                        <td className="px-3 py-3">
                          <p className="font-semibold text-slate-800 transition-colors group-hover:text-indigo-700">
                            {eventItem.name}
                          </p>
                          <p className="text-xs text-slate-500">{eventItem.type} • {eventItem.venue}</p>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{formatDate(eventItem.date)}</td>
                        <td className="px-3 py-3 text-slate-600">{eventItem.manager}</td>
                        <td className="px-3 py-3">
                          <div className="w-44">
                            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200">
                              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-slate-700">
                          {formatCurrency(eventItem.spent)} / {formatCurrency(eventItem.budget)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-indigo-600">
                            Open
                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EventsPage;
