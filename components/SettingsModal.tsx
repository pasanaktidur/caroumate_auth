import * as React from 'react';
import type { AppSettings, BrandKit } from '../types';
import { AIModel, FontChoice } from '../types';
import type { TFunction } from '../App';
import { defaultSettings } from '../lib/constants';
import { PaletteIcon } from './icons';
import { FontSelector, ColorInput, PositionSelector } from './ui';

export const SettingsModal: React.FC<{
    currentSettings: AppSettings;
    onClose: () => void;
    onSave: (settings: AppSettings) => void;
    t: TFunction;
    onShowTutorial: () => void;
}> = ({ currentSettings, onClose, onSave, t, onShowTutorial }) => {
    const [settings, setSettings] = React.useState(currentSettings);
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        onSave(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    
    const handleBrandKitChange = (field: keyof BrandKit, value: any) => {
        setSettings(prev => ({
            ...prev,
            brandKit: { ...(prev.brandKit || defaultSettings.brandKit!), [field]: value }
        }));
    };

    const handleBrandKitColorChange = (field: keyof BrandKit['colors'], value: string) => {
        setSettings(prev => ({
            ...prev,
            brandKit: {
                ...(prev.brandKit || defaultSettings.brandKit!),
                colors: { ...(prev.brandKit?.colors || defaultSettings.brandKit!.colors), [field]: value }
            }
        }));
    };

    const handleBrandKitFontChange = (field: keyof BrandKit['fonts'], value: FontChoice) => {
        setSettings(prev => ({
            ...prev,
            brandKit: {
                ...(prev.brandKit || defaultSettings.brandKit!),
                fonts: { ...(prev.brandKit?.fonts || defaultSettings.brandKit!.fonts), [field]: value }
            }
        }));
    };
    
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleBrandKitChange('logo', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBrandingStyleChange = (updates: Partial<BrandKit['brandingStyle']>) => {
        setSettings(prev => ({
            ...prev,
            brandKit: { 
                ...(prev.brandKit || defaultSettings.brandKit!), 
                brandingStyle: {
                    ...(prev.brandKit?.brandingStyle || defaultSettings.brandKit!.brandingStyle!),
                    ...updates
                }
            }
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[75vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center px-6 pt-4 pb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('settingsTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto px-6 space-y-6">
                    {/* AI Settings */}
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">AI Settings</h3>
                        {/* AI Model */}
                        <div>
                            <label htmlFor="aiModel" className="block text-sm font-medium">{t('aiModelLabel')}</label>
                            <select
                                id="aiModel"
                                value={settings.aiModel}
                                onChange={e => setSettings({ ...settings, aiModel: e.target.value as AIModel })}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            >
                                {Object.values(AIModel).map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('aiModelHint')}</p>
                        </div>
                         {/* API Key */}
                        <div className="mt-4">
                            <label htmlFor="apiKey" className="block text-sm font-medium">{t('apiKeyLabel')}</label>
                            <input
                                type="password"
                                id="apiKey"
                                value={settings.apiKey}
                                onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                                placeholder={t('apiKeyPlaceholder')}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {t('apiKeyHint')} <span onClick={onShowTutorial} className="cursor-pointer underline text-primary-600 dark:text-primary-400">{t('apiKeyHintGuide')}</span>
                            </p>
                        </div>
                         {/* System Prompt */}
                        <div className="mt-4">
                            <label htmlFor="systemPrompt" className="block text-sm font-medium">{t('systemPromptLabel')}</label>
                             <textarea
                                id="systemPrompt"
                                value={settings.systemPrompt}
                                onChange={e => setSettings({ ...settings, systemPrompt: e.target.value })}
                                placeholder={t('systemPromptPlaceholder')}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                rows={3}
                            />
                            <button onClick={() => setSettings({...settings, systemPrompt: defaultSettings.systemPrompt})} className="mt-1 text-xs text-primary-600 hover:underline">{t('setDefaultButton')}</button>
                        </div>
                    </div>

                    {/* Brand Kit */}
                    <div>
                         <h3 className="text-lg font-semibold border-b pb-2 mb-3">{t('brandKitTitle')}</h3>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('brandKitSubtitle')}</p>
                         <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                               <ColorInput id="primaryColor" label={t('brandKitPrimaryColor')} value={settings.brandKit?.colors.primary ?? '#FFFFFF'} onChange={v => handleBrandKitColorChange('primary', v)} />
                               <ColorInput id="secondaryColor" label={t('brandKitSecondaryColor')} value={settings.brandKit?.colors.secondary ?? '#00C2CB'} onChange={v => handleBrandKitColorChange('secondary', v)} />
                               <ColorInput id="textColor" label={t('brandKitTextColor')} value={settings.brandKit?.colors.text ?? '#111827'} onChange={v => handleBrandKitColorChange('text', v)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                    <label htmlFor="headlineFont" className="block text-sm font-medium">{t('brandKitHeadlineFont')}</label>
                                    <FontSelector
                                        id="headlineFont"
                                        value={settings.brandKit?.fonts.headline ?? FontChoice.POPPINS}
                                        onChange={font => handleBrandKitFontChange('headline', font)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bodyFont" className="block text-sm font-medium">{t('brandKitBodyFont')}</label>
                                    <FontSelector
                                        id="bodyFont"
                                        value={settings.brandKit?.fonts.body ?? FontChoice.SANS}
                                        onChange={font => handleBrandKitFontChange('body', font)}
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">{t('brandKitLogo')}</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {settings.brandKit?.logo ? (
                                        <img src={settings.brandKit.logo} alt="Brand Logo" className="w-16 h-16 object-contain rounded-md bg-gray-200 dark:bg-gray-600"/>
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                                            <PaletteIcon className="w-8 h-8 text-gray-400"/>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} id="logo-upload" className="hidden"/>
                                    <button type="button" onClick={() => document.getElementById('logo-upload')?.click()} className="px-3 py-2 border border-gray-300 rounded-md text-sm">{t('brandKitUploadLogo')}</button>
                                    {settings.brandKit?.logo && <button type="button" onClick={() => handleBrandKitChange('logo', '')} className="text-red-500 text-sm">{t('removeButton')}</button>}
                                </div>
                            </div>
                             <div className="space-y-3">
                                <label htmlFor="brandKitBrandingText" className="block text-sm font-medium">{t('brandKitBrandingText')}</label>
                                <input id="brandKitBrandingText" type="text" value={settings.brandKit?.brandingText ?? ''} onChange={e => handleBrandKitChange('brandingText', e.target.value)} placeholder={t('settingsBrandingPlaceholder')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                <div className="grid grid-cols-3 gap-4 items-end">
                                    <ColorInput 
                                        id="brandKitBrandingColor" 
                                        label={t('brandingColorLabel')}
                                        value={settings.brandKit?.brandingStyle?.color ?? '#000000'}
                                        onChange={v => handleBrandingStyleChange({ color: v })}
                                    />
                                    <div>
                                        <label htmlFor="brandKitBrandingOpacity" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('brandingOpacityLabel')}</label>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <input
                                                id="brandKitBrandingOpacity"
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={settings.brandKit?.brandingStyle?.opacity ?? 0.75}
                                                onChange={e => handleBrandingStyleChange({ opacity: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-center">
                                                {Math.round((settings.brandKit?.brandingStyle?.opacity ?? 0.75) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                     <div>
                                        <label htmlFor="brandKitBrandingSize" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('brandingSizeLabel')}</label>
                                        <input
                                            type="number"
                                            id="brandKitBrandingSize"
                                            value={settings.brandKit?.brandingStyle?.fontSize ? settings.brandKit.brandingStyle.fontSize * 10 : ''}
                                            onChange={e => handleBrandingStyleChange({ fontSize: parseFloat(e.target.value) / 10 })}
                                            className="mt-1 block w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            step="1"
                                            min="5"
                                            max="30"
                                        />
                                    </div>
                                </div>
                                <PositionSelector
                                    label={t('brandingPositionLabel')}
                                    value={settings.brandKit?.brandingStyle?.position ?? 'bottom-right'}
                                    onChange={v => handleBrandingStyleChange({ position: v })}
                                    t={t}
                                />
                            </div>
                         </div>
                    </div>

                </div>
                <div className="flex justify-end items-center px-6 pt-4 pb-4 border-t dark:border-gray-600 flex-shrink-0">
                    <div className="flex space-x-2">
                        <button onClick={onClose} className="px-4 py-2 border rounded-md">{t('cancelButton')}</button>
                        <button onClick={handleSave} className="px-4 py-2 border border-transparent rounded-md text-white bg-primary-600 hover:bg-primary-700">
                            {saved ? t('savedButton') : t('saveButton')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};