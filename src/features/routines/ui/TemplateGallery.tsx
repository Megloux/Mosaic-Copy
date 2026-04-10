import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Layers, Lock, Plus, LayoutTemplate, ChevronDown } from 'lucide-react';
import { TEMPLATES, type TemplateDef } from './templateData';

interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplateDef) => void;
  onStartScratch: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onStartScratch,
}) => {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'rgb(var(--core-black))',
        fontFamily: 'var(--font-primary)',
      }}
    >
      {/* ====== Hero Header ====== */}
      <section
        className="relative px-5 pt-14 pb-8 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0,183,120,0.22) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: 'rgba(0,183,120,0.10)' }}
        />

        <div className="relative">
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: 'rgb(var(--core-teal))', fontWeight: 600 }}
          >
            Routine Builder
          </p>
          <h1
            className="text-3xl leading-tight mb-3"
            style={{
              color: 'rgb(var(--core-white))',
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Build Your
            <br />
            Routine
          </h1>
          <p
            className="text-sm max-w-sm"
            style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'var(--font-thin)' }}
          >
            Start fresh or choose a master-trainer template.
          </p>
        </div>
      </section>

      {/* ====== Two Entry Paths ====== */}
      <section className="px-5 space-y-3 mb-6">
        {/* Path 1: Create New Routine */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartScratch}
          className="w-full text-left rounded-2xl p-5 transition-colors"
          style={{
            background: 'linear-gradient(135deg, rgba(0,183,120,0.12) 0%, rgba(0,183,120,0.03) 100%)',
            border: '1px solid rgba(0,183,120,0.18)',
            transitionDuration: 'var(--motion-natural)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,183,120,0.18) 0%, rgba(0,183,120,0.06) 100%)',
              }}
            >
              <Plus className="w-6 h-6" style={{ color: 'rgb(var(--core-teal))' }} />
            </div>
            <div>
              <h3
                className="text-base font-semibold mb-0.5"
                style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}
              >
                Create New Routine
              </h3>
              <p
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'var(--font-thin)' }}
              >
                Blank canvas — add exercises freely
              </p>
            </div>
          </div>
        </motion.button>

        {/* Path 2: Create from Template */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-full text-left rounded-2xl p-5 transition-colors"
          style={{
            background: showTemplates
              ? 'linear-gradient(135deg, rgba(168,85,247,0.14) 0%, rgba(168,85,247,0.04) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: showTemplates
              ? '1px solid rgba(168,85,247,0.22)'
              : '1px solid rgba(255,255,255,0.08)',
            transitionDuration: 'var(--motion-natural)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: showTemplates
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0.06) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              }}
            >
              <LayoutTemplate className="w-6 h-6" style={{ color: showTemplates ? 'rgba(168,85,247,0.9)' : 'rgba(255,255,255,0.6)' }} />
            </div>
            <div className="flex-1">
              <h3
                className="text-base font-semibold mb-0.5"
                style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}
              >
                Create from Template
              </h3>
              <p
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'var(--font-thin)' }}
              >
                {TEMPLATES.length} master-trainer blueprints
              </p>
            </div>
            <motion.div
              animate={{ rotate: showTemplates ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </motion.div>
          </div>
        </motion.button>
      </section>

      {/* ====== Template Grid (reveals on tap) ====== */}
      <AnimatePresence>
        {showTemplates && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.24, 1.12, 0.76, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 mb-3">
              <h2
                className="text-[11px] uppercase tracking-widest"
                style={{ color: 'rgba(168,85,247,0.6)', fontWeight: 600 }}
              >
                Choose a Template
              </h2>
            </div>
            <div className="px-5 pb-12">
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template, index) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    index={index}
                    onSelect={() => onSelectTemplate(template)}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- Individual Template Card ----------

const TemplateCard: React.FC<{
  template: TemplateDef;
  index: number;
  onSelect: () => void;
}> = ({ template, index, onSelect }) => {
  const rgb = template.accentColor;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.24, 1.12, 0.76, 1],
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="relative text-left rounded-2xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-4"
      style={{
        background: `linear-gradient(160deg, rgba(${rgb},0.20) 0%, rgba(${rgb},0.04) 60%, rgba(0,0,0,0.3) 100%)`,
        border: `1px solid rgba(${rgb},0.12)`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] pointer-events-none"
        style={{ backgroundColor: `rgba(${rgb},0.15)` }}
      />

      {/* PRO badge */}
      {template.isProOnly && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Lock className="w-2.5 h-2.5" style={{ color: `rgba(${rgb},0.9)` }} />
          <span
            className="text-[9px] font-bold tracking-wider"
            style={{ color: `rgba(${rgb},0.9)` }}
          >
            PRO
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="text-2xl mb-2">{template.icon}</div>

      {/* Name */}
      <h3
        className="text-sm font-bold leading-snug mb-1"
        style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}
      >
        {template.name}
      </h3>

      {/* Description */}
      <p
        className="text-[10px] leading-relaxed mb-2.5 line-clamp-2"
        style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 'var(--font-thin)' }}
      >
        {template.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3" style={{ color: `rgba(${rgb},0.7)` }} />
          <span
            className="text-[10px]"
            style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}
          >
            {template.blocks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" style={{ color: `rgba(${rgb},0.7)` }} />
          <span
            className="text-[10px]"
            style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}
          >
            ~{template.estimatedMinutes}m
          </span>
        </div>
      </div>
    </motion.button>
  );
};
