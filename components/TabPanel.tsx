// components/TabPanel.tsx

'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabPanelProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function TabPanel({ tabs, defaultTab }: TabPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div>
      {/* Tab bar */}
      <div
        role="tablist"
        className="flex gap-0 border-b border-zinc-800 overflow-x-auto"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap relative ${
              activeTab === tab.id
                ? 'text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel" className="p-4">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
