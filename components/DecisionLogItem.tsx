import React from 'react';

interface DecisionLogItemProps {
    name: string;
    caseId: string;
    type: 'spare' | 'death';
}

const DecisionLogItem = React.memo(function DecisionLogItem({ name, caseId, type }: DecisionLogItemProps) {
    return (
        <div className="decision-log-item flex items-center justify-between px-4 py-3 transition-colors cursor-default">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">{name}</span>
                <span className="text-[9px] text-slate-500 uppercase">Case #{caseId}</span>
            </div>
            <span className="text-lg">{type === 'spare' ? '😀' : '💀'}</span>
        </div>
    );
});

export default DecisionLogItem;
