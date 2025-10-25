import * as React from 'react';
// FIX: FontChoice is an enum used as a value, so it must be imported as a value, not a type.
import type { TextStyle, Position } from '../types';
import { FontChoice } from '../types';
import {
    ChevronDownIcon, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CaseIcon,
    AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon
} from './icons';
import { fontClassMap } from '../lib/constants';
import { TFunction } from '../App';

export const FontSelector: React.FC<{
    id: string;
    value: FontChoice;
    onChange: (value: FontChoice) => void;
}> = ({ id, value, onChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const handleSelect = (font: FontChoice) => {
        onChange(font);
        setIsOpen(false);
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                id={id}
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 relative w-full cursor-default rounded-md bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`block truncate ${fontClassMap[value]}`}>{value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </button>

            {isOpen && (
                <ul
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    role="listbox"
                    aria-labelledby={id}
                >
                    {Object.values(FontChoice).map((font) => (
                        <li
                            key={font}
                            className={`relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-primary-900/50 ${fontClassMap[font]}`}
                            id={`option-${id}-${font}`}
                            role="option"
                            aria-selected={font === value}
                            onClick={() => handleSelect(font)}
                        >
                            <span className={`block truncate ${font === value ? 'font-semibold' : 'font-normal'}`}>{font}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export const ApplyScopeControl: React.FC<{
    scope: 'all' | 'selected';
    setScope: (scope: 'all' | 'selected') => void;
    isDisabled: boolean;
    t: TFunction;
    fieldId: string;
}> = ({ scope, setScope, isDisabled, t, fieldId }) => (
    <div className="flex items-center space-x-4 mt-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('applyTo')}</span>
        <div className="flex items-center">
            <input
                id={`${fieldId}-scope-all`}
                type="radio"
                name={`${fieldId}-scope`}
                value="all"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor={`${fieldId}-scope-all`} className="ml-2 block text-xs text-gray-700 dark:text-gray-300">{t('applyToAll')}</label>
        </div>
        <div className="flex items-center">
            <input
                id={`${fieldId}-scope-selected`}
                type="radio"
                name={`${fieldId}-scope`}
                value="selected"
                checked={scope === 'selected'}
                onChange={() => setScope('selected')}
                disabled={isDisabled}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50"
            />
            <label htmlFor={`${fieldId}-scope-selected`} className="ml-2 block text-xs text-gray-700 dark:text-gray-300 disabled:opacity-50">{t('applyToSelected')}</label>
        </div>
    </div>
);

export const TextFormatToolbar: React.FC<{ style: TextStyle, onStyleChange: (newStyle: TextStyle) => void }> = ({ style, onStyleChange }) => {
    const toggleStyle = (key: keyof TextStyle, value: any, defaultValue: any) => {
        onStyleChange({ ...style, [key]: style[key] === value ? defaultValue : value });
    };

    const toggleDecoration = (value: 'underline' | 'line-through') => {
        const decorations = new Set((style.textDecorationLine || '').split(' ').filter(Boolean));
        if (decorations.has(value)) {
            decorations.delete(value);
        } else {
            decorations.add(value);
        }
        onStyleChange({ ...style, textDecorationLine: Array.from(decorations).join(' ') });
    };

    const isDecorationActive = (value: string) => (style.textDecorationLine || '').includes(value);

    return (
        <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-md border dark:border-gray-600">
            <button type="button" onClick={() => toggleStyle('fontWeight', 'bold', 'normal')} className={`p-1.5 rounded ${style.fontWeight === 'bold' ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><BoldIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => toggleStyle('fontStyle', 'italic', 'normal')} className={`p-1.5 rounded ${style.fontStyle === 'italic' ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><ItalicIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => toggleDecoration('underline')} className={`p-1.5 rounded ${isDecorationActive('underline') ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><UnderlineIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => toggleDecoration('line-through')} className={`p-1.5 rounded ${isDecorationActive('line-through') ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><StrikethroughIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => toggleStyle('textTransform', 'uppercase', 'none')} className={`p-1.5 rounded ${style.textTransform === 'uppercase' ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><CaseIcon className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div>
            <button type="button" onClick={() => onStyleChange({ ...style, textAlign: 'left' })} className={`p-1.5 rounded ${style.textAlign === 'left' ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><AlignLeftIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => onStyleChange({ ...style, textAlign: 'center' })} className={`p-1.5 rounded ${style.textAlign === 'center' ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><AlignCenterIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => onStyleChange({ ...style, textAlign: 'right' })} className={`p-1.5 rounded ${style.textAlign === 'right' ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><AlignRightIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => onStyleChange({ ...style, textAlign: 'justify' })} className={`p-1.5 rounded ${style.textAlign === 'justify' ? 'bg-primary-200 dark:bg-primary-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><AlignJustifyIcon className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div>
            <input
                type="number"
                value={style.fontSize ? style.fontSize * 10 : ''}
                onChange={e => onStyleChange({ ...style, fontSize: parseFloat(e.target.value) / 10 })}
                className="w-12 p-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
                step="1"
                min="5"
                max="100"
                placeholder="Size"
                aria-label="Font size"
            />
        </div>
    );
};

export const TextStrokeControl: React.FC<{
    style: TextStyle;
    onStyleChange: (newStyle: TextStyle) => void;
}> = ({ style, onStyleChange }) => {
    const stroke = style.textStroke ?? { color: '#000000', width: 0 };

    const handleStrokeChange = (newStroke: { color: string; width: number; }) => {
        onStyleChange({ ...style, textStroke: newStroke });
    };

    return (
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-md border dark:border-gray-600">
            <span className="text-xs font-medium px-2 text-gray-600 dark:text-gray-300">Border</span>
            <input
                type="color"
                value={stroke.color}
                onChange={(e) => handleStrokeChange({ ...stroke, color: e.target.value })}
                className="w-7 h-6 p-0 border-none rounded cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Text border color"
                disabled={stroke.width === 0}
            />
            <input
                type="number"
                value={stroke.width}
                onChange={e => handleStrokeChange({ ...stroke, width: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                className="w-12 p-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
                step="1"
                min="0"
                max="10"
                aria-label="Text border width"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">px</span>
        </div>
    );
};

export const ColorInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}> = ({ id, label, value, onChange }) => {
    const [textValue, setTextValue] = React.useState(value);

    React.useEffect(() => {
        setTextValue(value);
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setTextValue(newText);
        if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(newText)) {
            onChange(newText);
        }
    };
    
    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
            <div className="mt-1 flex items-center space-x-2">
                <input
                    type="color"
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                    aria-label={`${label} color picker`}
                />
                <input
                    type="text"
                    value={textValue}
                    onChange={handleTextChange}
                    className="block w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    aria-label={`${label} hex code`}
                />
            </div>
        </div>
    );
};

export const PositionSelector: React.FC<{
    label: string;
    value: Position;
    onChange: (value: Position) => void;
    t: TFunction;
}> = ({ label, value, onChange, t }) => {
    const positions: Position[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
    const positionLabels: { [key in Position]: string } = {
        'top-left': 'Top Left',
        'top-right': 'Top Right',
        'bottom-left': 'Bottom Left',
        'bottom-right': 'Bottom Right',
        'top-center': 'Top Center',
        'bottom-center': 'Bottom Center',
    };

    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
            <div className="grid grid-cols-3 gap-2">
                {positions.map(pos => (
                    <button
                        type="button"
                        key={pos}
                        onClick={() => onChange(pos)}
                        className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                            value === pos
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white dark:bg-gray-700 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                        {positionLabels[pos]}
                    </button>
                ))}
            </div>
        </div>
    );
};