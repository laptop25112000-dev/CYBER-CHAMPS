import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { 
  ChevronRight, ChevronDown, CheckCircle2, Shield, 
  ExternalLink, Users, Wrench, X, Sparkles, Sliders, ArrowRight 
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/team';

export default function ComponentInformationPanel({ 
  selectedComponent, 
  onSelectComponent, 
  onResetView,
  allComponents = []
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // If no component is selected, render an engaging, functional default state
  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-white rounded-2xl border border-[#E4E7EB] shadow-sm text-left overflow-y-auto">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#245DFF]/10 text-[#245DFF] flex items-center justify-center font-bold">
            <Sliders className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#17191C]">Interactive Component Explorer</h3>
            <p className="text-sm text-[#626A73] mt-1 leading-relaxed">
              Select an identified part below or click directly on any hotspot pin in the robot viewer to magnify its physical construction and learn what it does.
            </p>
          </div>

          {/* Structured selection instruction */}
          <div className="p-3.5 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] space-y-2">
            <div className="text-xs font-bold text-[#17191C] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#245DFF]" />
              <span>How to explore:</span>
            </div>
            <ul className="text-xs text-[#626A73] space-y-1 pl-3.5 list-disc">
              <li>Click <strong>Explode the Robot</strong> to separate assemblies.</li>
              <li>Choose any part from the list to zoom in.</li>
              <li>Click <strong>Return to Assembly</strong> at any time to zoom out.</li>
            </ul>
          </div>
        </div>

        {/* Clean, well-organized list of identified parts */}
        <div className="pt-4 border-t border-[#E4E7EB] space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#626A73]">
            Identified Components ({allComponents.length})
          </div>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {allComponents.map((comp) => (
              <button
                key={comp.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectComponent(comp);
                }}
                className="w-full p-2.5 rounded-xl border border-[#E4E7EB] bg-white hover:bg-[#F6F7F8] hover:border-[#245DFF]/50 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: comp.badgeColor }}
                  />
                  <div>
                    <span className="text-xs font-bold text-[#17191C] block group-hover:text-[#245DFF]">
                      {comp.name}
                    </span>
                    <span className="text-[10px] text-[#626A73]">
                      {comp.category}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#626A73] transition-transform group-hover:translate-x-1 group-hover:text-[#245DFF]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Find associated team members who engineered this component
  const contributors = (selectedComponent.teamMemberIds || []).map(id => {
    return TEAM_MEMBERS.find(m => m.id === id) || { name: id, id };
  });

  // Find related components
  const relatedComponents = (selectedComponent.relatedComponentIds || []).map(id => {
    return allComponents.find(c => c.id === id);
  }).filter(Boolean);

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-white rounded-2xl border border-[#E4E7EB] shadow-sm overflow-y-auto space-y-6 text-left">
      
      {/* Header with category and back to full robot button */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#245DFF] px-2.5 py-0.5 rounded-md bg-[#245DFF]/10">
            {selectedComponent.category}
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              if (onResetView) onResetView();
            }}
            className="text-xs font-semibold text-[#626A73] hover:text-[#17191C] px-2.5 py-1 rounded-md border border-[#E4E7EB] hover:bg-[#F6F7F8] transition-colors flex items-center gap-1"
          >
            <span>Back to Full Robot</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-[#17191C] tracking-tight">
          {selectedComponent.name}
        </h3>
      </div>

      {/* Structured Plain-Language Explanations */}
      <div className="space-y-4 border-y border-[#E4E7EB] py-5">
        
        {/* 1. What is it? */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#626A73] mb-1">
            What is it?
          </div>
          <p className="text-sm font-medium text-[#17191C] leading-relaxed">
            {selectedComponent.whatIsIt}
          </p>
        </div>

        {/* 2. What does it do? */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#626A73] mb-1">
            What does it do?
          </div>
          <p className="text-sm text-[#626A73] leading-relaxed">
            {selectedComponent.whatDoesItDo}
          </p>
        </div>

        {/* 3. Why is it important? */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#626A73] mb-1">
            Why is it important?
          </div>
          <p className="text-sm text-[#626A73] leading-relaxed">
            {selectedComponent.whyDoesItMatter}
          </p>
        </div>

      </div>

      {/* Expandable Technical Details Disclosure */}
      <div className="border border-[#E4E7EB] rounded-xl overflow-hidden bg-[#F6F7F8]">
        <button
          onClick={() => {
            soundManager.playClick();
            setShowTechnicalDetails(!showTechnicalDetails);
          }}
          className="w-full px-4 py-3 text-left font-semibold text-xs text-[#17191C] flex items-center justify-between hover:bg-[#E4E7EB]/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#245DFF]" />
            <span>Technical Details</span>
          </span>
          <ChevronDown className={`w-4 h-4 text-[#626A73] transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`} />
        </button>

        {showTechnicalDetails && (
          <div className="px-4 pb-4 pt-1 bg-white border-t border-[#E4E7EB] space-y-2 text-xs">
            {selectedComponent.technicalDetails ? (
              Object.entries(selectedComponent.technicalDetails).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 border-b border-[#F6F7F8] last:border-none">
                  <span className="text-[#626A73] font-medium">{key}</span>
                  <span className="font-semibold text-[#17191C] text-right ml-2">{val}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic py-2">Technical specifications pending bench verification.</div>
            )}
          </div>
        )}
      </div>

      {/* Related Components */}
      {relatedComponents.length > 0 && (
        <div className="pt-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#626A73] mb-2">
            Related Components
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relatedComponents.map((rel) => (
              <button
                key={rel.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectComponent(rel);
                }}
                className="px-2.5 py-1 rounded-md bg-[#F6F7F8] border border-[#E4E7EB] hover:border-[#245DFF] text-[11px] font-medium text-[#17191C] transition-colors"
              >
                {rel.shortTag || rel.name} →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contributing Team Members */}
      {contributors.length > 0 && (
        <div className="pt-2 border-t border-[#E4E7EB]">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#626A73] mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#245DFF]" />
            <span>Engineered by Cyber Champs</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contributors.map((member) => (
              <span 
                key={member.id}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F6F7F8] text-[#17191C] border border-[#E4E7EB]"
              >
                {member.name}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
