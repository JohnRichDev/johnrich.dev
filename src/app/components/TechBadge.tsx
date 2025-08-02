import React from 'react';
import { IconType } from 'react-icons';

interface TechBadgeProps {
    name: string;
    icon: IconType;
}

const TechBadge: React.FC<TechBadgeProps> = ({ name, icon: Icon }) => (
    <span className="cursor-pointer select-none flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded">
        <Icon className="text-lg text-white" />
        <span>{name}</span>
    </span>
);

export default TechBadge;
