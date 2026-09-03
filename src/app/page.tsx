"use client";

import { useMemo, useState } from "react";

type Profile = { id: number; name: string; role: string; initials: string };
type Task = { id: number; title: string; status: "Pendiente" | "En progreso" | "Completada"; points: number; assigneeIds: number[] };
type Story = { id: number; key: string; title: string; description: string; priority: "Alta" | "Media" | "Baja"; status: "Por hacer" | "En progreso" | "Hecha"; tasks: Task[] };

const profiles: Profile[] = [
  { id: 1, name: "Sofía Ramírez", role: "Frontend", initials: "SR" },
  { id: 2, name: "Mateo Silva", role: "Backend", initials: "MS" },
  { id: 3, name: "Valentina Cruz", role: "QA / Testing", initials: "VC" },
  { id: 4, name: "Diego Torres", role: "DevOps", initials: "DT" },
];

const starterStories: Story[] = [
  { id: 1, key: "US-01", title: "Autenticación de usuarios", description: "Como usuario quiero iniciar sesión para acceder de forma segura a mi cuenta.", priority: "Alta", status: "En progreso", tasks: [
    { id: 11, title: "Diseñar formulario de login", status: "Completada", points: 3, assigneeIds: [1] },
    { id: 12, title: "Implementar sesión con JWT", status: "En progreso", points: 5, assigneeIds: [2, 4] },
  ] },
  { id: 2, key: "US-02", title: "Crear estimación de proyecto", description: "Como líder quiero estimar el esfuerzo para planificar entregas realistas.", priority: "Media", status: "Por hacer", tasks: [
    { id: 21, title: "Definir fórmula de estimación", status: "Pendiente", points: 3, assigneeIds: [2] },
  ] },
  { id: 3, key: "US-03", title: "Consultar resumen de avance", description: "Como cliente quiero ver el avance para conocer el estado del proyecto.", priority: "Baja", status: "Hecha", tasks: [] },
];

const emptyStory = { title: "", description: "", priority: "Media" as Story["priority"], status: "Por hacer" as Story["status"] };

export default function Home() {
  const [stories, setStories] = useState(starterStories);
  const [selectedId, setSelectedId] = useState(1);
  const [activeView, setActiveView] = useState<"stories" | "tasks">("stories");
  const [query, setQuery] = useState("");
  const [storyForm, setStoryForm] = useState(emptyStory);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPoints, setTaskPoints] = useState(3);
  const [taskAssignees, setTaskAssignees] = useState<number[]>([]);
  const [editingStory, setEditingStory] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const selectedStory = stories.find((story) => story.id === selectedId) ?? stories[0];
  const visibleStories = stories.filter((story) => `${story.title} ${story.key}`.toLowerCase().includes(query.toLowerCase()));
  const allTasks = useMemo(() => stories.flatMap((story) => story.tasks.map((task) => ({ ...task, storyKey: story.key, storyTitle: story.title }))), [stories]);
  const completedTasks = allTasks.filter((task) => task.status === "Completada").length;

  function saveStory(event: React.FormEvent) {
    event.preventDefault();
    if (!storyForm.title.trim()) return;
    if (editingStory) setStories((current) => current.map((story) => story.id === editingStory ? { ...story, ...storyForm } : story));
    else { const id = Date.now(); setStories((current) => [...current, { ...storyForm, id, key: `US-${String(current.length + 1).padStart(2, "0")}`, tasks: [] }]); setSelectedId(id); }
    setStoryForm(emptyStory); setEditingStory(null); setShowStoryForm(false);
  }

  function removeStory(id: number) {
    if (!window.confirm("¿Eliminar esta historia y todas sus tareas?")) return;
    setStories((current) => current.filter((story) => story.id !== id));
    if (selectedId === id) setSelectedId(stories.find((story) => story.id !== id)?.id ?? 0);
  }

  function saveTask(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedStory || !taskTitle.trim()) return;
    setStories((current) => current.map((story) => story.id !== selectedStory.id ? story : { ...story, tasks: editingTask ? story.tasks.map((task) => task.id === editingTask ? { ...task, title: taskTitle, points: taskPoints, assigneeIds: taskAssignees } : task) : [...story.tasks, { id: Date.now(), title: taskTitle, status: "Pendiente", points: taskPoints, assigneeIds: taskAssignees }] }));
    setTaskTitle(""); setTaskPoints(3); setTaskAssignees([]); setEditingTask(null);
  }

  function removeTask(taskId: number) { setStories((current) => current.map((story) => ({ ...story, tasks: story.tasks.filter((task) => task.id !== taskId) }))); }
  function editStory(story: Story) { setStoryForm({ title: story.title, description: story.description, priority: story.priority, status: story.status }); setEditingStory(story.id); setShowStoryForm(true); }
  function editTask(task: Task) { setTaskTitle(task.title); setTaskPoints(task.points); setTaskAssignees(task.assigneeIds); setEditingTask(task.id); }
  function toggleAssignee(id: number) { setTaskAssignees((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">S</span><span>Scope<span className="brand-dot">.</span></span></div><div className="workspace-label">ESPACIO DE TRABAJO</div><div className="workspace"><span className="workspace-icon">AC</span><span><strong>Acme Corp</strong><small>Producto digital</small></span><span className="chevron">⌄</span></div><nav><button className="nav-item"><span>▦</span> Resumen</button><button className="nav-item active"><span>◈</span> Backlog <b>{stories.length}</b></button><button className="nav-item"><span>◌</span> Equipo</button><button className="nav-item"><span>⚙</span> Configuración</button></nav><div className="sidebar-bottom"><div className="help"><span>?</span><div><strong>Centro de ayuda</strong><small>Resuelve tus dudas</small></div></div><div className="user"><span className="avatar dark">LC</span><div><strong>Lucía Castro</strong><small>Administradora</small></div><span className="more">•••</span></div></div></aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumb">Proyectos <span>/</span> <strong>Portal de clientes</strong></div><div className="top-actions"><button className="icon-button" aria-label="Buscar">⌕</button><button className="icon-button" aria-label="Notificaciones">♧<i></i></button><span className="avatar">LC</span></div></header><section className="page-heading"><div><div className="eyebrow">PORTAL DE CLIENTES <span className="status-dot">●</span> Activo</div><h1>Historias y tareas</h1><p>Define el alcance y coordina el trabajo técnico del proyecto.</p></div><button className="primary-button" onClick={() => { setStoryForm(emptyStory); setEditingStory(null); setShowStoryForm(true); }}><span>＋</span> Nueva historia</button></section>
      <section className="metrics"><div><span className="metric-icon blue">◈</span><p>Historias</p><strong>{stories.length}</strong><small>en este proyecto</small></div><div><span className="metric-icon orange">◫</span><p>Tareas registradas</p><strong>{allTasks.length}</strong><small>asociadas a historias</small></div><div><span className="metric-icon green">✓</span><p>Tareas completadas</p><strong>{completedTasks}</strong><small>{allTasks.length ? Math.round(completedTasks / allTasks.length * 100) : 0}% del total</small></div><div><span className="metric-icon purple">◷</span><p>Esfuerzo estimado</p><strong>{allTasks.reduce((sum, task) => sum + task.points, 0)} <em>pts</em></strong><small>puntos de historia</small></div></section>
      <div className="content-grid"><section className="panel backlog-panel"><div className="panel-header"><div><h2>Backlog del proyecto</h2><p>Gestiona las historias de usuario y sus tareas.</p></div><div className="view-tabs"><button className={activeView === "stories" ? "selected" : ""} onClick={() => setActiveView("stories")}>Historias <span>{stories.length}</span></button><button className={activeView === "tasks" ? "selected" : ""} onClick={() => setActiveView("tasks")}>Todas las tareas <span>{allTasks.length}</span></button></div></div><div className="toolbar"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el backlog..." /></label><button className="filter-button">☷ Filtrar <span>0</span></button></div>{activeView === "stories" ? <div className="story-list">{visibleStories.map((story) => <article className={`story-row ${selectedId === story.id ? "selected-row" : ""}`} key={story.id} onClick={() => setSelectedId(story.id)}><div className="story-main"><span className="story-key">{story.key}</span><div><h3>{story.title}</h3><p>{story.description}</p></div></div><div className="story-meta"><span className={`pill priority-${story.priority.toLowerCase()}`}>{story.priority}</span><span className={`status status-${story.status.replace(" ", "-").toLowerCase()}`}><i></i>{story.status}</span><span className="task-count">▤ {story.tasks.length}</span><button className="row-menu" onClick={(event) => { event.stopPropagation(); editStory(story); }} aria-label={`Editar ${story.key}`}>•••</button></div></article>)}</div> : <div className="task-table">{allTasks.filter((task) => `${task.title} ${task.storyKey}`.toLowerCase().includes(query.toLowerCase())).map((task) => <div className="task-line" key={task.id}><span className="check">{task.status === "Completada" ? "✓" : ""}</span><div><strong>{task.title}</strong><small>{task.storyKey} · {task.storyTitle}</small></div><span>{task.points} pts</span><button className="text-button" onClick={() => { const story = stories.find((item) => item.tasks.some((child) => child.id === task.id)); if (story) { setSelectedId(story.id); editTask(task); } }}>Editar</button><button className="delete-button" onClick={() => removeTask(task.id)} aria-label="Eliminar tarea">×</button></div>)}</div>}</section>
        {selectedStory && <aside className="panel detail-panel"><div className="detail-header"><span className="story-key">{selectedStory.key}</span><div><button className="icon-button small" onClick={() => editStory(selectedStory)} aria-label="Editar historia">✎</button><button className="icon-button small danger" onClick={() => removeStory(selectedStory.id)} aria-label="Eliminar historia">⌫</button></div></div><h2>{selectedStory.title}</h2><p className="detail-description">{selectedStory.description}</p><div className="detail-tags"><span className={`pill priority-${selectedStory.priority.toLowerCase()}`}>{selectedStory.priority} prioridad</span><span className={`status status-${selectedStory.status.replace(" ", "-").toLowerCase()}`}><i></i>{selectedStory.status}</span></div><div className="detail-section"><div className="section-heading"><h3>Tareas <span>{selectedStory.tasks.length}</span></h3><button className="add-task" onClick={() => { setEditingTask(null); setTaskTitle(""); setTaskAssignees([]); }}>＋ Añadir tarea</button></div><form className="task-form" onSubmit={saveTask}><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Nombre de la tarea..." aria-label="Nombre de la tarea" /><div className="form-inline"><select value={taskPoints} onChange={(event) => setTaskPoints(Number(event.target.value))} aria-label="Puntos de tarea"><option value={1}>1 punto</option><option value={3}>3 puntos</option><option value={5}>5 puntos</option><option value={8}>8 puntos</option></select><button className="add-task-submit" type="submit">{editingTask ? "Guardar" : "Añadir"}</button></div><div className="assignee-picker"><label>Perfiles técnicos asignados</label><div className="assignee-options">{profiles.map((profile) => <button type="button" key={profile.id} className={taskAssignees.includes(profile.id) ? "assignee chosen" : "assignee"} onClick={() => toggleAssignee(profile.id)}><span className="avatar">{profile.initials}</span>{profile.name.split(" ")[0]} {taskAssignees.includes(profile.id) ? "✓" : ""}</button>)}</div></div></form>{selectedStory.tasks.length === 0 && <p className="empty-state">Todavía no hay tareas. Añade el primer pendiente de esta historia.</p>}{selectedStory.tasks.map((task) => <div className="detail-task" key={task.id}><span className={`task-check ${task.status === "Completada" ? "done" : ""}`}>{task.status === "Completada" ? "✓" : ""}</span><div><strong>{task.title}</strong><small>{task.points} puntos · {task.assigneeIds.length ? task.assigneeIds.map((id) => profiles.find((profile) => profile.id === id)?.initials).join(" ") : "Sin asignar"}</small></div><button className="row-menu" onClick={() => editTask(task)} aria-label="Editar tarea">✎</button><button className="delete-button" onClick={() => removeTask(task.id)} aria-label="Eliminar tarea">×</button></div>)}</div></aside>}
      </div></main>
    {showStoryForm && <div className="modal-backdrop" onClick={() => setShowStoryForm(false)}><form className="modal" onSubmit={saveStory} onClick={(event) => event.stopPropagation()}><div className="modal-title"><div><span className="eyebrow">{editingStory ? "EDITAR HISTORIA" : "NUEVA HISTORIA"}</span><h2>{editingStory ? "Actualiza la historia" : "Registra una historia"}</h2></div><button type="button" className="icon-button" onClick={() => setShowStoryForm(false)}>×</button></div><label>Título de la historia<input autoFocus value={storyForm.title} onChange={(event) => setStoryForm({ ...storyForm, title: event.target.value })} placeholder="Ej. Gestionar notificaciones" /></label><label>Descripción<textarea value={storyForm.description} onChange={(event) => setStoryForm({ ...storyForm, description: event.target.value })} placeholder="Como [rol], quiero [acción] para [beneficio]." rows={4} /></label><div className="two-fields"><label>Prioridad<select value={storyForm.priority} onChange={(event) => setStoryForm({ ...storyForm, priority: event.target.value as Story["priority"] })}><option>Alta</option><option>Media</option><option>Baja</option></select></label><label>Estado<select value={storyForm.status} onChange={(event) => setStoryForm({ ...storyForm, status: event.target.value as Story["status"] })}><option>Por hacer</option><option>En progreso</option><option>Hecha</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowStoryForm(false)}>Cancelar</button><button className="primary-button" type="submit">{editingStory ? "Guardar cambios" : "Crear historia"}</button></div></form></div>}
  </div>;
}