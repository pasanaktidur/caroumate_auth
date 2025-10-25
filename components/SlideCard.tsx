import * as React from 'react';
import type { SlideData, DesignPreferences, TextStyle, Position } from '../types';
import { DesignStyle } from '../types';
import type { TFunction } from '../App';
import { LoaderIcon } from './icons';
import { fontClassMap, aspectRatioClassMap, positionClassMap, positionAlignmentMap } from '../lib/constants';

export const SlideCard: React.FC<{
    slide: SlideData;
    preferences: DesignPreferences;
    isSelected: boolean;
    onClick: () => void;
    isGeneratingImage: boolean;
    t: TFunction;
    slideIndex: number;
    totalSlides: number;
}> = ({ slide, preferences, isSelected, onClick, isGeneratingImage, t, slideIndex, totalSlides }) => {
    
    const finalPrefs = React.useMemo(() => {
        const slideOverrides = {
            backgroundColor: slide.backgroundColor,
            fontColor: slide.fontColor,
            backgroundImage: slide.backgroundImage,
            backgroundOpacity: slide.backgroundOpacity,
            headlineStyle: slide.headlineStyle,
            bodyStyle: slide.bodyStyle,
            headlineColor: slide.headlineColor,
            bodyColor: slide.bodyColor,
        };

        const globalFontColor = preferences.fontColor;
        const slideFontColor = slideOverrides.fontColor ?? globalFontColor;

        return {
            ...preferences,
            backgroundColor: slideOverrides.backgroundColor ?? preferences.backgroundColor,
            fontColor: slideFontColor,
            backgroundImage: slideOverrides.backgroundImage ?? preferences.backgroundImage,
            backgroundOpacity: slideOverrides.backgroundOpacity ?? preferences.backgroundOpacity,
            headlineStyle: { ...preferences.headlineStyle, ...(slideOverrides.headlineStyle || {}) },
            bodyStyle: { ...preferences.bodyStyle, ...(slideOverrides.bodyStyle || {}) },
            headlineColor: slideOverrides.headlineColor ?? slideFontColor,
            bodyColor: slideOverrides.bodyColor ?? slideFontColor,
        };
    }, [slide, preferences]);

    const font = fontClassMap[finalPrefs.font] || 'font-sans';
    const aspectRatioClass = aspectRatioClassMap[finalPrefs.aspectRatio] || 'aspect-square';

    const getDynamicStyles = (style: TextStyle, type: 'headline' | 'body') => {
        const cssStyle: React.CSSProperties = {
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            textDecorationLine: style.textDecorationLine,
            textAlign: style.textAlign,
            textTransform: style.textTransform,
        };
        if (style.fontSize) {
            const maxRem = style.fontSize;

            // Set a hard minimum font size for mobile readability.
            const minRem = type === 'headline' ? 0.75 : 0.6; // 12px for headline, 9.6px for body

            // Calculate a responsive preferred value. 
            // This is designed to scale the font size smoothly between the min and max rems,
            // typically reaching the max size around a 1200px viewport width.
            // The formula is derived from (maxRem * 16px/rem) / 1200px-viewport * 100vw = (maxRem * 4/3)vw
            const preferredVw = maxRem * (4 / 3);
            
            // Use clamp() to ensure the font size is fluid but stays within the defined min/max bounds.
            cssStyle.fontSize = `clamp(${minRem}rem, ${preferredVw.toFixed(2)}vw, ${maxRem}rem)`;
        }
        if (style.textStroke && style.textStroke.width > 0 && style.textStroke.color) {
            const w = style.textStroke.width;
            const c = style.textStroke.color;
            cssStyle.textShadow = `
                -${w}px -${w}px 0 ${c},
                 ${w}px -${w}px 0 ${c},
                -${w}px  ${w}px 0 ${c},
                 ${w}px  ${w}px 0 ${c},
                -${w}px 0 0 ${c},
                 ${w}px 0 0 ${c},
                 0 -${w}px 0 ${c},
                 0  ${w}px 0 ${c}
            `;
        }
        return cssStyle;
    };
    
    const headlineStyles = getDynamicStyles(finalPrefs.headlineStyle, 'headline');
    const bodyStyles = getDynamicStyles(finalPrefs.bodyStyle, 'body');

    const backgroundElement = React.useMemo(() => {
        if (finalPrefs.backgroundImage) {
            return finalPrefs.backgroundImage.startsWith('data:video')
                ? <video src={finalPrefs.backgroundImage} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                : <img src={finalPrefs.backgroundImage} alt="Slide background" className="absolute inset-0 w-full h-full object-cover" />;
        }
    
        let styleBgClass = '';
        switch (finalPrefs.style) {
            case DesignStyle.COLORFUL: styleBgClass = `bg-gradient-to-br from-pink-300 to-indigo-400`; break;
            case DesignStyle.VINTAGE: styleBgClass = 'bg-yellow-50 dark:bg-yellow-900/20'; break;
            case DesignStyle.MODERN: styleBgClass = 'bg-white dark:bg-gray-800'; break;
            case DesignStyle.CORPORATE: styleBgClass = 'bg-white dark:bg-gray-800'; break;
            case DesignStyle.ARTISTIC: styleBgClass = 'bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-900'; break;
        }
    
        if (styleBgClass) {
            return <div className={`absolute inset-0 w-full h-full ${styleBgClass}`}></div>;
        }
    
        return <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: finalPrefs.backgroundColor }}></div>;
    }, [finalPrefs.backgroundImage, finalPrefs.style, finalPrefs.backgroundColor]);
    
    const borderClasses = React.useMemo(() => {
        switch (finalPrefs.style) {
            case DesignStyle.MINIMALIST: return '';
            case DesignStyle.BOLD: return 'border-4 border-gray-900 dark:border-gray-200';
            case DesignStyle.ELEGANT: return 'border border-gray-300 dark:border-gray-600 shadow-md dark:shadow-xl dark:shadow-black/20';
            case DesignStyle.COLORFUL: return `border-4 border-transparent`;
            case DesignStyle.VINTAGE: return 'border-2 border-yellow-800 dark:border-yellow-600';
            case DesignStyle.MODERN: return 'border-b-4 border-gray-300 dark:border-gray-600';
            case DesignStyle.CORPORATE: return 'border-l-4 border-blue-600 dark:border-blue-400';
            case DesignStyle.ARTISTIC: return '';
            default: return 'border border-gray-200 dark:border-gray-700';
        }
    }, [finalPrefs.style]);
    
    const isArtistic = finalPrefs.style === DesignStyle.ARTISTIC;

    const containerStyle: React.CSSProperties = {
        color: isArtistic ? '#FFFFFF' : finalPrefs.fontColor,
        backgroundColor: 'transparent',
    };

    return (
        <div
            data-carousel-slide={slide.id}
            onClick={onClick}
            className={`w-64 sm:w-72 flex-shrink-0 relative rounded-lg cursor-pointer transition-all duration-300 transform overflow-hidden ${borderClasses} ${font} ${aspectRatioClass} ${isSelected ? 'ring-4 ring-primary-500 ring-offset-2 scale-105 shadow-2xl shadow-primary-600/50' : 'hover:scale-102'}`}
            style={containerStyle}
        >
            {isGeneratingImage && (
                <div className="absolute inset-0 bg-black/60 rounded-md z-30 flex flex-col items-center justify-center space-y-2">
                    <LoaderIcon className="w-12 h-12" />
                    <span className="text-sm text-white">{t('generatingVisual')}</span>
                </div>
            )}
            
            {/* Background Layer */}
            <div className="absolute inset-0 -z-10" style={{ opacity: finalPrefs.backgroundOpacity }}>
                {backgroundElement}
            </div>

            {/* Content Wrapper */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center overflow-hidden">
                {/* Content Layer */}
                <div className="z-10 flex flex-col items-center">
                    <h2 className="font-bold leading-tight mb-4" style={{...headlineStyles, color: finalPrefs.headlineColor, lineHeight: '1.2' }}>{slide.headline}</h2>
                    <p className="" style={{ ...bodyStyles, color: finalPrefs.bodyColor, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{slide.body}</p>
                </div>
            </div>
            
            {/* Branding Text */}
            {finalPrefs.brandingText && (
                <div className={`absolute z-20 pointer-events-none ${positionClassMap[finalPrefs.brandingStyle.position]} ${positionAlignmentMap[finalPrefs.brandingStyle.position]}`}>
                    <p style={{ 
                        color: finalPrefs.brandingStyle.color, 
                        opacity: finalPrefs.brandingStyle.opacity,
                        fontSize: `${finalPrefs.brandingStyle.fontSize ?? 0.7}rem`,
                    }}>{finalPrefs.brandingText}</p>
                </div>
            )}

            {/* Slide Number */}
            {finalPrefs.slideNumberStyle?.show && totalSlides > 0 && (
                <div className={`absolute z-20 pointer-events-none ${positionClassMap[finalPrefs.slideNumberStyle.position]}`}>
                    <p style={{
                        color: finalPrefs.slideNumberStyle.color,
                        opacity: finalPrefs.slideNumberStyle.opacity,
                        fontSize: `${finalPrefs.slideNumberStyle.fontSize ?? 0.7}rem`,
                    }} className="font-sans">
                        {slideIndex + 1} / {totalSlides}
                    </p>
                </div>
            )}
        </div>
    );
};