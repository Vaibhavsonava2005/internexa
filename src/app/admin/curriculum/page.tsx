"use client";

import { useState, useEffect } from "react";
import { getInternshipsAdmin, saveCurriculum } from "@/actions/curriculum.actions";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Trash2, ChevronDown, ChevronRight, Video, FileText, Code, CheckCircle, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

export default function AdminCurriculumPage() {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Current active curriculum state
  const [modules, setModules] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  // UI states
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const res = await getInternshipsAdmin();
      if (res.success && res.data) {
        setInternships(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
          setModules(res.data[0].modules || []);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSelectInternship = (id: string) => {
    setSelectedId(id);
    const internship = internships.find(i => i.id === id);
    if (internship) {
      setModules(internship.modules || []);
    }
  };

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    const res = await saveCurriculum(selectedId, modules);
    if (res.success) {
      // Update local cache
      setInternships(prev => prev.map(i => i.id === selectedId ? { ...i, modules } : i));
      alert("Curriculum saved successfully!");
    } else {
      alert("Failed to save curriculum: " + res.error);
    }
    setSaving(false);
  };

  // --- Curriculum Manipulations ---
  
  const addModule = () => {
    const newMod = {
      id: `mod_${uuidv4().split('-')[0]}`,
      week: modules.length + 1,
      title: `Week ${modules.length + 1}: New Module`,
      duration: "1 Week",
      days: []
    };
    setModules([...modules, newMod]);
    setExpandedModules({ ...expandedModules, [newMod.id]: true });
  };

  const deleteModule = (modIndex: number) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    const newMods = [...modules];
    newMods.splice(modIndex, 1);
    setModules(newMods);
  };

  const updateModule = (modIndex: number, field: string, value: string) => {
    const newMods = [...modules];
    newMods[modIndex] = { ...newMods[modIndex], [field]: value };
    setModules(newMods);
  };

  const addLesson = (modIndex: number) => {
    const newMods = [...modules];
    if (!newMods[modIndex].days) newMods[modIndex].days = [];
    
    newMods[modIndex].days.push({
      id: `les_${uuidv4().split('-')[0]}`,
      day: newMods[modIndex].days.length + 1,
      title: "New Lesson",
      type: "Video",
      content_url: "",
      duration: "30 mins",
      description: ""
    });
    setModules(newMods);
  };

  const deleteLesson = (modIndex: number, lessonIndex: number) => {
    if (!confirm("Delete this lesson?")) return;
    const newMods = [...modules];
    newMods[modIndex].days.splice(lessonIndex, 1);
    setModules(newMods);
  };

  const updateLesson = (modIndex: number, lessonIndex: number, field: string, value: string) => {
    const newMods = [...modules];
    newMods[modIndex].days[lessonIndex] = { ...newMods[modIndex].days[lessonIndex], [field]: value };
    setModules(newMods);
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Curriculum Builder</h1>
          <p className="text-slate-500">Manage course modules and dynamic lessons.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Curriculum
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Internship to Edit</label>
        <select 
          value={selectedId || ""}
          onChange={(e) => handleSelectInternship(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          {internships.map(i => (
            <option key={i.id} value={i.id}>{i.title}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {modules.map((mod, mIndex) => (
          <div key={mod.id || mIndex} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button onClick={() => toggleModule(mod.id)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md">
                  {expandedModules[mod.id] ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                </button>
                <input 
                  type="text" 
                  value={mod.title}
                  onChange={(e) => updateModule(mIndex, 'title', e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-lg font-bold text-slate-900 dark:text-white p-0 w-full md:w-1/2"
                  placeholder="Module Title"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => deleteModule(mIndex)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedModules[mod.id] && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {(!mod.days || mod.days.length === 0) && (
                      <p className="text-slate-500 italic text-center py-4">No lessons in this module. Add one!</p>
                    )}
                    
                    {mod.days?.map((lesson: any, lIndex: number) => (
                      <div key={lesson.id || lIndex} className="bg-slate-50/50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative group">
                        <button 
                          onClick={() => deleteLesson(mIndex, lIndex)}
                          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-1 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                              {lIndex + 1}
                            </div>
                          </div>
                          <div className="md:col-span-4 space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Lesson Title</label>
                            <input 
                              type="text"
                              value={lesson.title}
                              onChange={(e) => updateLesson(mIndex, lIndex, 'title', e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                            <select 
                              value={lesson.type}
                              onChange={(e) => updateLesson(mIndex, lIndex, 'type', e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="Video">Video</option>
                              <option value="Reading">Reading (Markdown)</option>
                              <option value="Coding">Coding Playground</option>
                              <option value="Project">Project/Assignment</option>
                            </select>
                          </div>
                          <div className="md:col-span-3 space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Content URL</label>
                            <input 
                              type="text"
                              value={lesson.content_url || ""}
                              onChange={(e) => updateLesson(mIndex, lIndex, 'content_url', e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                            <input 
                              type="text"
                              value={lesson.duration || ""}
                              onChange={(e) => updateLesson(mIndex, lIndex, 'duration', e.target.value)}
                              placeholder="e.g. 45 mins"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button 
                      onClick={() => addLesson(mIndex)}
                      className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Lesson
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <button 
        onClick={addModule}
        className="w-full py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <Plus className="w-6 h-6" /> Add New Module / Week
      </button>

    </div>
  );
}
