import * as React from 'react';
import type { AppView, UserProfile, Carousel, SlideData, DesignPreferences, AppSettings } from './types';
import { AIModel } from './types';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { 
    generateCarouselContent, getAiAssistance, generateCaption, generateImage, 
    regenerateSlideContent, generateThreadFromCarousel, generateVideo, editImage, getDesignSuggestion 
} from './services/geminiService';

import { supabase } from './lib/supabaseClient';
import { translations } from './lib/translations';
import { SETTINGS_STORAGE_KEY, USER_STORAGE_KEY, HISTORY_STORAGE_KEY, DOWNLOADS_STORAGE_KEY, defaultSettings } from './lib/constants';

import { Header } from './components/Header';
import { MobileFooter } from './components/MobileFooter';
import { Footer } from './components/Footer';
import { LoginScreen } from './components/LoginScreen';
import { SignUpModal } from './components/SignUpModal';
import { SignInModal } from './components/SignInModal';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { Dashboard } from './components/Dashboard';
import { Generator } from './components/Generator';
import { SettingsModal } from './components/SettingsModal';
import { TutorialScreen } from './components/TutorialScreen';
import { AiAssistantModal } from './components/AiAssistantModal';
import { CaptionModal } from './components/CaptionModal';
import { ThreadModal } from './components/ThreadModal';
import { Loader } from './components/Loader';

export type TFunction = (key: string, params?: { [key: string]: any }) => string;

export default function App() {
    const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme') as 'light' | 'dark';
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });
    
    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const [language, setLanguage] = React.useState<keyof typeof translations>('id');
    
    // --- State Initialization ---
    const [user, setUser] = React.useState<UserProfile | null>(null);
    const [view, setView] = React.useState<AppView>('LOGIN');

    const [previousView, setPreviousView] = React.useState<AppView>('DASHBOARD');
    
    const [carouselHistory, setCarouselHistory] = React.useState<Carousel[]>(() => {
        try {
            const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch { return []; }
    });
    
    const [downloadCount, setDownloadCount] = React.useState<number>(() => {
        try {
            const savedCount = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
            return savedCount ? JSON.parse(savedCount) : 0;
        } catch { return 0; }
    });

    const [currentCarousel, setCurrentCarousel] = React.useState<Carousel | null>(null);
    const [selectedSlideId, setSelectedSlideId] = React.useState<string | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isGeneratingImageForSlide, setIsGeneratingImageForSlide] = React.useState<string | null>(null);
    const [isGeneratingVideoForSlide, setIsGeneratingVideoForSlide] = React.useState<string | null>(null);
    const [isDownloading, setIsDownloading] = React.useState(false);
    const [generationMessage, setGenerationMessage] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isCaptionModalOpen, setIsCaptionModalOpen] = React.useState(false);
    const [isGeneratingCaption, setIsGeneratingCaption] = React.useState(false);
    const [generatedCaption, setGeneratedCaption] = React.useState<string>('');
    const [currentTopic, setCurrentTopic] = React.useState('');
    const [regeneratingPart, setRegeneratingPart] = React.useState<{ slideId: string; part: 'headline' | 'body' } | null>(null);
    const [isThreadModalOpen, setIsThreadModalOpen] = React.useState(false);
    const [isGeneratingThread, setIsGeneratingThread] = React.useState(false);
    const [generatedThread, setGeneratedThread] = React.useState('');
    const [isSuggestingDesign, setIsSuggestingDesign] = React.useState(false);
    
    const [authModal, setAuthModal] = React.useState<'signup' | 'signin' | null>(null);
    const [authError, setAuthError] = React.useState<string | null>(null);
    const [postLoginError, setPostLoginError] = React.useState<string | null>(null);


    const openAuthModal = (modal: 'signup' | 'signin') => {
        setAuthError(null);
        setPostLoginError(null);
        setAuthModal(modal);
    };

    const closeAuthModal = () => {
        setAuthError(null);
        setAuthModal(null);
    };


    const [settings, setSettings] = React.useState<AppSettings>(() => {
        try {
            const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
            const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
            // Deep merge to ensure brandKit and its nested properties are not lost if not present in saved settings
            return {
                ...defaultSettings,
                ...parsedSettings,
                brandKit: {
                    ...defaultSettings.brandKit,
                    ...(parsedSettings.brandKit || {}),
                    colors: { ...defaultSettings.brandKit!.colors, ...(parsedSettings.brandKit?.colors || {}) },
                    fonts: { ...defaultSettings.brandKit!.fonts, ...(parsedSettings.brandKit?.fonts || {}) },
                    brandingStyle: { ...defaultSettings.brandKit!.brandingStyle, ...(parsedSettings.brandKit?.brandingStyle || {}) },
                }
            };
        } catch (error) {
            console.error("Could not load settings:", error);
            return defaultSettings;
        }
    });

    const handleLanguageChange = () => {
        setLanguage(lang => lang === 'en' ? 'id' : 'en');
    };
    
    const t: TFunction = React.useCallback((key: string, params?: { [key: string]: any }) => {
        let text = (translations[language] as any)[key] || key;
        if (params) {
            Object.keys(params).forEach(pKey => {
                const regex = new RegExp(`{{${pKey}}}`, 'g');
                text = text.replace(regex, String(params[pKey]));
            });
        }
        return text;
    }, [language]);

    // --- Supabase Auth Listener ---
    React.useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                setPostLoginError(null); // Clear any previous login errors on a new session event
                // Check if a profile exists for this user.
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    // Profile exists, set the user state and view.
                    const userProfile: UserProfile = {
                        name: profile.full_name || session.user.email,
                        email: session.user.email!,
                        picture: profile.avatar_url || '',
                        niche: profile.niche || [],
                        profileComplete: profile.profile_complete || false,
                    };
                    setUser(userProfile);
                    setView(userProfile.profileComplete && userProfile.niche.length > 0 ? 'DASHBOARD' : 'PROFILE_SETUP');
                } else if (profileError && profileError.code === 'PGRST116') {
                    // Profile does not exist (PGRST116: no rows found), this is a new user.
                    // Create a basic profile for them automatically.
                    const newProfileData = {
                        id: session.user.id,
                        full_name: session.user.user_metadata.full_name || session.user.email,
                        avatar_url: session.user.user_metadata.avatar_url,
                        email: session.user.email,
                        profile_complete: false,
                    };

                    const { error: insertError } = await supabase.from('profiles').insert(newProfileData);

                    if (insertError) {
                        console.error("Error creating new user profile:", insertError);
                        await supabase.auth.signOut();
                        setPostLoginError(t('errorProfileFetch'));
                        setView('LOGIN');
                    } else {
                        // Successfully created profile, now set state and direct to setup.
                        const userProfile: UserProfile = {
                            name: newProfileData.full_name,
                            email: newProfileData.email!,
                            picture: newProfileData.avatar_url || '',
                            niche: [],
                            profileComplete: false,
                        };
                        setUser(userProfile);
                        setView('PROFILE_SETUP');
                    }
                } else if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    await supabase.auth.signOut();
                    setPostLoginError(t('errorProfileFetch'));
                    setView('LOGIN');
                }
            } else {
                // No session, user is logged out.
                setUser(null);
                setView('LOGIN');
            }
        });

        return () => subscription.unsubscribe();
    }, [t]);

    // --- Data Persistence Effects ---
    React.useEffect(() => {
        const saveHistoryWithAutoTrim = (historyToSave: Carousel[]) => {
            if (historyToSave.length === 0) {
                try {
                    localStorage.setItem(HISTORY_STORAGE_KEY, '[]');
                } catch (e) { console.error("Could not clear carousel history:", e); }
                return;
            }

            // Sanitize history to remove large base64 data before saving.
            const sanitizedHistory = historyToSave.map(carousel => ({
                ...carousel,
                slides: carousel.slides.map(slide => {
                    const newSlide = { ...slide };
                    if (newSlide.backgroundImage && newSlide.backgroundImage.startsWith('data:video')) {
                        delete newSlide.backgroundImage;
                    }
                    return newSlide;
                })
            }));

            try {
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sanitizedHistory));
            } catch (error: any) {
                if (
                    error.name === 'QuotaExceededError' ||
                    (error.code && (error.code === 22 || error.code === 1014)) ||
                    (error.message && error.message.toLowerCase().includes('quota'))
                ) {
                    console.warn(
                        `LocalStorage quota exceeded even after sanitization. History has ${historyToSave.length} items. ` +
                        `Removing the oldest carousel and retrying...`
                    );
                    if (historyToSave.length > 1) {
                        saveHistoryWithAutoTrim(historyToSave.slice(0, -1)); 
                    } else {
                        console.error(
                            "Could not save carousel history: The single most recent carousel is too large to fit in localStorage.",
                            error
                        );
                        setError(t('errorHistoryTooLarge'));
                    }
                } else {
                    console.error("Could not save carousel history due to an unknown error:", error);
                }
            }
        };

        saveHistoryWithAutoTrim(carouselHistory);
    }, [carouselHistory, t]);
    
    const parseAndDisplayError = React.useCallback((error: any): string => {
        let errorMessage = error.message || t('errorUnknown');

        // Case 1: The error from Gemini API is a JSON string
        if (errorMessage.startsWith('{') && errorMessage.endsWith('}')) {
            try {
                const errorObj = JSON.parse(errorMessage);
                if (errorObj.error) {
                    const { code, message, status, details } = errorObj.error;

                    if (code === 429 || status === "RESOURCE_EXHAUSTED") {
                        const helpLinkDetails = details?.find((d: any) => d['@type'] === 'type.googleapis.com/google.rpc.Help');
                        const helpLink = helpLinkDetails?.links?.[0]?.url;
                        return t('errorQuotaExceeded', {
                            link: helpLink || 'https://ai.google.dev/gemini-api/docs/rate-limits'
                        });
                    }
                    
                    const lowerMessage = message?.toLowerCase() || '';
                    if (code === 400 && (lowerMessage.includes('api key not valid') || lowerMessage.includes('permission denied'))) {
                         return t('errorInvalidApiKey');
                    }
                    
                    return message || errorMessage;
                }
            } catch (e) {
                // Not a valid JSON, fall through to general checks.
            }
        }
        
        // Case 2: For other errors (not JSON), check for common substrings.
        const lowerCaseMessage = errorMessage.toLowerCase();
        
        if (lowerCaseMessage.includes('api key not valid') || lowerCaseMessage.includes('permission denied')) {
            return t('errorInvalidApiKey');
        }

        if (lowerCaseMessage.includes('api key is not configured')) {
            return t('errorApiKeyNotConfigured');
        }
        
        if (errorMessage.includes("AI did not return an image from your prompt.")) {
            return t('errorImageGen');
        }

        return errorMessage;
    }, [t]);

    const handleSaveSettings = (newSettings: AppSettings) => {
        setSettings(newSettings);
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
        } catch (error) {
            console.error("Could not save settings:", error);
        }
        setIsSettingsOpen(false);
    };

    const handleSignUp = async (formData: any) => {
        setAuthError(null);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name || formData.username,
                        username: formData.username,
                    }
                }
            });

            if (error) {
                setAuthError(error.message);
                return;
            }
            // onAuthStateChange will handle setting user and view
            alert('Sign-up successful! Please check your email to confirm your account.');
            closeAuthModal();
        } catch (e: any) {
            console.error("Sign up failed", e);
            setAuthError(e.message || "An unexpected error occurred during sign up.");
        }
    };
    
    const handleSignIn = async (formData: any) => {
        setAuthError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setAuthError(error.message);
                return;
            }
            // onAuthStateChange will handle setting user and view
            closeAuthModal();
        } catch (e: any) {
            console.error("Sign in failed", e);
            setAuthError(e.message || "An unexpected error occurred during sign in.");
        }
    };

    const handleSignInWithGoogle = async () => {
        setAuthError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });

            if (error) {
                setAuthError(error.message);
                console.error("Google Sign In Error:", error.message);
            }
            // Supabase handles the redirect. The page will navigate away and then back.
            // The onAuthStateChange listener will handle the session when the user returns.
        } catch (e: any) {
            console.error("Google Sign in failed", e);
            setAuthError(e.message || "An unexpected error occurred during Google sign in.");
        }
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        // onAuthStateChange handles setting user to null and view to 'LOGIN'
        setCarouselHistory([]);
        setDownloadCount(0);
        setCurrentCarousel(null);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        localStorage.removeItem(DOWNLOADS_STORAGE_KEY);
    };

    const handleProfileSetup = async (profile: Omit<UserProfile, 'profileComplete'>) => {
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
            console.error("No active session found for profile setup.");
            return;
        }

        const cleanedProfile = {
            ...profile,
            niche: profile.niche.filter(n => n.trim() !== ''),
        };

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: session.data.session.user.id,
                full_name: cleanedProfile.name,
                niche: cleanedProfile.niche,
                profile_complete: true,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            console.error("Error saving profile:", error);
            // Handle error UI if needed
        } else {
             setUser({ ...cleanedProfile, profileComplete: true });
             setView('DASHBOARD');
        }
    };
    
    const goToDashboard = () => {
        if (view === 'LOGIN' || view === 'PROFILE_SETUP') return;
        if (currentCarousel) {
            // Save the latest changes to history before switching views
            setCarouselHistory(prev => {
                const index = prev.findIndex(c => c.id === currentCarousel.id);
                if (index !== -1) {
                    const newHistory = [...prev];
                    newHistory[index] = currentCarousel;
                    return newHistory;
                }
                return prev;
            });
        }
        setCurrentCarousel(null);
        setView('DASHBOARD');
    }

    const startNewCarousel = () => {
        setCurrentCarousel(null);
        setSelectedSlideId(null);
        setView('GENERATOR');
    };

    const handleEditCarousel = (carouselId: string) => {
        const carouselToEdit = carouselHistory.find(c => c.id === carouselId);
        if (carouselToEdit) {
            setCurrentCarousel(carouselToEdit);
            setCurrentTopic(carouselToEdit.title);
            setSelectedSlideId(carouselToEdit.slides[0]?.id || null);
            setView('GENERATOR');
        }
    };
    
    const handleDeleteCarousel = (carouselId: string) => {
        if (window.confirm(t('deleteCarouselConfirm'))) {
            setCarouselHistory(prev => prev.filter(c => c.id !== carouselId));
        }
    };

    const handleClearHistory = () => {
        if (window.confirm(t('clearHistoryConfirm'))) {
            setCarouselHistory([]);
        }
    };
    
    const executeImageGenerationForAllSlides = async (carousel: Carousel, settings: AppSettings): Promise<Carousel> => {
        let updatedCarousel = carousel;
        for (let i = 0; i < carousel.slides.length; i++) {
            const slide = carousel.slides[i];
            setGenerationMessage(t('generatingImageMessage', { current: i + 1, total: carousel.slides.length }));
            setIsGeneratingImageForSlide(slide.id);
            try {
                const imageUrl = await generateImage(slide.visual_prompt, carousel.preferences.aspectRatio, settings);
                // Create new slides array with the new image
                const newSlides = updatedCarousel.slides.map(s => s.id === slide.id ? { ...s, backgroundImage: imageUrl } : s);
                // Update the local carousel variable for the next iteration
                updatedCarousel = { ...updatedCarousel, slides: newSlides };
                // Update the state to reflect changes in the UI
                setCurrentCarousel(updatedCarousel);
            } catch (imageErr) {
                console.error(`Failed to generate image for slide ${i + 1}:`, imageErr);
                // Optionally set an error state on the slide itself, for now we just log and continue
            }
        }
        return updatedCarousel;
    };


    const handleGenerateCarousel = React.useCallback(async (topic: string, niche: string, preferences: DesignPreferences, magicCreate: boolean) => {
        if (!user) return;
        
        if (!settings.apiKey) {
            setError(t('errorApiKeyNotConfigured'));
            return;
        }

        setIsGenerating(true);
        setError(null);
        setCurrentCarousel(null);
        setCurrentTopic(topic);
        
        let newCarousel: Carousel | null = null;

        try {
            setGenerationMessage(t('generatingContentMessage'));
            const nicheToUse = niche || (user.niche.length > 0 ? user.niche[0] : 'General');
            const slidesContent = await generateCarouselContent(topic, nicheToUse, preferences, settings);

            const initialSlides: SlideData[] = slidesContent.map(s => ({ ...s, id: crypto.randomUUID() }));
            
            newCarousel = {
                id: crypto.randomUUID(),
                title: topic,
                createdAt: new Date().toISOString(),
                slides: initialSlides,
                category: nicheToUse,
                preferences,
            };
            
            setCurrentCarousel(newCarousel);
            setSelectedSlideId(initialSlides[0]?.id ?? null);

            if (magicCreate) {
                const finalCarousel = await executeImageGenerationForAllSlides(newCarousel, settings);
                setCarouselHistory(prev => [finalCarousel, ...prev]);
            } else {
                 setCarouselHistory(prev => [newCarousel!, ...prev]);
            }

        } catch (err: any) {
            setError(parseAndDisplayError(err));
        } finally {
            setIsGenerating(false);
            setGenerationMessage('');
            setIsGeneratingImageForSlide(null);
        }
    }, [user, settings, t, parseAndDisplayError]);

    const handleGenerateImageForSlide = async (slideId: string) => {
        if (!currentCarousel) return;
        const slide = currentCarousel.slides.find(s => s.id === slideId);
        if (!slide) return;
    
        setIsGeneratingImageForSlide(slideId);
        setError(null);
    
        try {
            const imageUrl = await generateImage(slide.visual_prompt, currentCarousel.preferences.aspectRatio, settings);
            handleUpdateSlide(slideId, { backgroundImage: imageUrl });
        } catch (err: any) {
            setError(parseAndDisplayError(err));
        } finally {
            setIsGeneratingImageForSlide(null);
        }
    };
    
    const handleGenerateAllImages = async () => {
        if (!currentCarousel) return;
        setIsGenerating(true);
        setError(null);
        try {
            const finalCarousel = await executeImageGenerationForAllSlides(currentCarousel, settings);
            // Update history with the newly generated images
            setCarouselHistory(prev => {
                const index = prev.findIndex(c => c.id === finalCarousel.id);
                if (index > -1) {
                    const newHistory = [...prev];
                    newHistory[index] = finalCarousel;
                    return newHistory;
                }
                return prev; // Should not happen if carousel is current
            });
        } catch(err: any) {
            setError(parseAndDisplayError(err));
        } finally {
            setIsGenerating(false);
            setGenerationMessage('');
            setIsGeneratingImageForSlide(null);
        }
    };

    const handleRegenerateContent = async (slideId: string, part: 'headline' | 'body') => {
        if (!currentCarousel || regeneratingPart) return;
    
        const slide = currentCarousel.slides.find(s => s.id === slideId);
        if (!slide) return;

        if (!settings.apiKey) {
            setError(t('errorApiKeyNotConfigured'));
            return;
        }
    
        setRegeneratingPart({ slideId, part });
        setError(null);
    
        try {
            const newText = await regenerateSlideContent(currentCarousel.title, slide, part, settings);
            handleUpdateSlide(slideId, { [part]: newText });
        } catch (err: any) {
            setError(parseAndDisplayError(err));
        } finally {
            setRegeneratingPart(null);
        }
    };

    const handleGenerateCaption = async () => {
        if (!currentCarousel) return;
        setIsCaptionModalOpen(true);
        
        if (!settings.apiKey) {
            setError(t('errorApiKeyNotConfigured'));
            setIsGeneratingCaption(false);
            setGeneratedCaption('');
            return;
        }

        setIsGeneratingCaption(true);
        setGeneratedCaption('');
        setError(null);
        try {
            const caption = await generateCaption(currentCarousel, settings);
            setGeneratedCaption(caption);
        } catch (err: any) {
            setError(parseAndDisplayError(err));
            // Also set error inside the modal if needed
        } finally {
            setIsGeneratingCaption(false);
        }
    };

    const handleGenerateThread = async () => {
        if (!currentCarousel) return;
        setIsThreadModalOpen(true);
        
        if (!settings.apiKey) {
            setError(t('errorApiKeyNotConfigured'));
            setIsGeneratingThread(false);
            setGeneratedThread('');
            return;
        }

        setIsGeneratingThread(true);
        setGeneratedThread('');
        setError(null);
        try {
            const thread = await generateThreadFromCarousel(currentCarousel, settings);
            setGeneratedThread(thread);
        } catch (err: any) {
            setError(parseAndDisplayError(err));
        } finally {
            setIsGeneratingThread(false);
        }
    };

    const handleGenerateVideoForSlide = async (slideId: string) => {
        if (!currentCarousel) return;
        const slide = currentCarousel.slides.find(s => s.id === slideId);
        if (!slide) return;

        try {
            const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
            if (!hasKey) {
                await (window as any).aistudio?.openSelectKey();
            }
        } catch (e) {
            console.error("AI Studio helper not available.", e);
        }
    
        setIsGeneratingVideoForSlide(slideId);
        setGenerationMessage(t('generatingVideoMessage'));
        setError(null);
    
        try {
            const videoUrl = await generateVideo(slide.visual_prompt, currentCarousel.preferences.aspectRatio, settings);
            handleUpdateSlide(slideId, { backgroundImage: videoUrl });
        } catch (err: any) {
             const parsedError = parseAndDisplayError(err);
            if (parsedError.includes("Requested entity was not found.")) {
                setError(t('errorVeoKeyNotFound'));
            } else {
                setError(parsedError);
            }
        } finally {
            setIsGeneratingVideoForSlide(null);
            setGenerationMessage('');
        }
    };

    const handleEditImageForSlide = async (slideId: string, editPrompt: string) => {
        if (!currentCarousel || !editPrompt) return;
        const slide = currentCarousel.slides.find(s => s.id === slideId);
        if (!slide?.backgroundImage || !slide.backgroundImage.startsWith('data:image')) return;

        setIsGeneratingImageForSlide(slideId);
        setError(null);
        
        try {
            const [meta, base64Data] = slide.backgroundImage.split(',');
            const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/png';
            const newImageUrl = await editImage(base64Data, mimeType, editPrompt, settings);
            handleUpdateSlide(slideId, { backgroundImage: newImageUrl });
        } catch (err: any) {
            setError(parseAndDisplayError(err));
        } finally {
            setIsGeneratingImageForSlide(null);
        }
    };
    
    const handleGetDesignSuggestion = async () => {
        if (!currentCarousel) return;
        
        setIsSuggestingDesign(true);
        setError(null);
        
        try {
            const suggestion = await getDesignSuggestion(currentCarousel.title, currentCarousel.category, settings);
            handleUpdateCarouselPreferences({ ...suggestion }, currentTopic);
        } catch (err: any) {
            setError(parseAndDisplayError(err));
        } finally {
            setIsSuggestingDesign(false);
        }
    };

    const handleDownloadCarousel = async () => {
        if (!currentCarousel) return;
        setIsDownloading(true);
        setError(null);
        try {
            const zip = new JSZip();
            const slideElements = document.querySelectorAll('[data-carousel-slide]');
            
            const slideOrderMap = new Map(currentCarousel.slides.map((slide, index) => [slide.id, index]));
            const orderedElements = Array.from(slideElements).sort((a, b) => {
                const idA = a.getAttribute('data-carousel-slide') || '';
                const idB = b.getAttribute('data-carousel-slide') || '';
                return Number(slideOrderMap.get(idA) ?? 99) - Number(slideOrderMap.get(idB) ?? 99);
            });

            for (let i = 0; i < orderedElements.length; i++) {
                const element = orderedElements[i] as HTMLElement;
                const slideId = element.getAttribute('data-carousel-slide');
                const slide = currentCarousel.slides.find(s => s.id === slideId);
                if (!slide) continue;

                const visualUrl = slide.backgroundImage ?? currentCarousel.preferences.backgroundImage;
                const isVideo = visualUrl?.startsWith('data:video');
                
                if (isVideo) {
                    // Handle video slide
                    const videoResponse = await fetch(visualUrl);
                    const videoBlob = await videoResponse.blob();
                    const extension = videoBlob.type.split('/')[1] || 'mp4';
                    zip.file(`slide-${i + 1}.${extension}`, videoBlob);

                    const videoElement = element.querySelector('video');
                    if (videoElement) videoElement.style.visibility = 'hidden';

                    const overlayCanvas = await html2canvas(element, {
                        allowTaint: true,
                        useCORS: true,
                        backgroundColor: null,
                        scale: 2,
                    });
                    const overlayBlob = await new Promise<Blob | null>(resolve => overlayCanvas.toBlob(resolve, 'image/png'));
                    if (overlayBlob) {
                        zip.file(`slide-${i + 1}_overlay.png`, overlayBlob);
                    }

                    if (videoElement) videoElement.style.visibility = 'visible';
                } else {
                    // Handle image slide
                    const finalBgColor = slide?.backgroundColor ?? currentCarousel.preferences.backgroundColor;
                    const canvas = await html2canvas(element, {
                        allowTaint: true,
                        useCORS: true,
                        backgroundColor: visualUrl ? null : finalBgColor,
                        scale: 2,
                    });
                    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                    if (blob) {
                        zip.file(`slide-${i + 1}.png`, blob);
                    }
                }
            }

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            const safeTitle = currentCarousel.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.download = `${safeTitle || 'carousel'}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            const newCount = downloadCount + 1;
            setDownloadCount(newCount);
            localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(newCount));

        } catch (error) {
            console.error("Failed to download carousel:", error);
            setError(t('errorDownload'));
        } finally {
            setIsDownloading(false);
        }
    };

    const handleUpdateSlide = (slideId: string, updates: Partial<SlideData>) => {
        setCurrentCarousel(prev => {
            if (!prev) return null;
            const updatedSlides = prev.slides.map(s => s.id === slideId ? { ...s, ...updates } : s);
            const newCarousel = { ...prev, slides: updatedSlides };

            setCarouselHistory(prevHistory => {
                const index = prevHistory.findIndex(c => c.id === newCarousel.id);
                if (index !== -1) {
                    const newHistory = [...prevHistory];
                    newHistory[index] = newCarousel;
                    return newHistory;
                }
                return prevHistory;
            });

            return newCarousel;
        });
    };
    
    const handleUploadVisualForSlide = (e: React.ChangeEvent<HTMLInputElement>, slideId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const visualUrl = reader.result as string;
                handleUpdateSlide(slideId, { backgroundImage: visualUrl });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveVisualForSlide = (slideId: string) => {
        handleUpdateSlide(slideId, { backgroundImage: undefined });
    };

    const handleUpdateCarouselPreferences = (updates: Partial<DesignPreferences>, topicValue: string) => {
        setCurrentCarousel(prev => {
            if (prev) {
                const newCarousel = { ...prev, preferences: { ...prev.preferences, ...updates } };
                 setCarouselHistory(prevHistory => {
                    const index = prevHistory.findIndex(c => c.id === newCarousel.id);
                    if (index !== -1) {
                        const newHistory = [...prevHistory];
                        newHistory[index] = newCarousel;
                        return newHistory;
                    }
                    return prevHistory;
                });
                return newCarousel;
            }
            return {
                id: 'temp-' + crypto.randomUUID(),
                title: topicValue,
                createdAt: new Date().toISOString(),
                slides: [],
                category: user?.niche[0] || 'General',
                preferences: {
                    ...defaultSettings.brandKit!,
                    ...{
                        backgroundColor: '#FFFFFF',
                        fontColor: '#111827',
                        backgroundOpacity: 1,
                        style: 'Minimalist' as any,
                        font: 'Inter' as any,
                        aspectRatio: '1:1' as any,
                        backgroundImage: undefined,
                        brandingText: '',
                        brandingStyle: { color: '#111827', opacity: 0.75, position: 'bottom-right', fontSize: 0.7 },
                        headlineStyle: { fontSize: 1.4, fontWeight: 'bold', textAlign: 'center', textStroke: { color: '#000000', width: 0 } },
                        bodyStyle: { fontSize: 0.8, textAlign: 'center', textStroke: { color: '#000000', width: 0 } },
                        slideNumberStyle: { show: false, color: '#FFFFFF', opacity: 0.8, position: 'top-right', fontSize: 0.7 },
                    },
                    ...updates,
                },
            };
        });
    };
    
    const handleClearSlideOverrides = (property: keyof SlideData) => {
        setCurrentCarousel(prev => {
            if (!prev) return null;
            const updatedSlides = prev.slides.map(slide => {
                const newSlide = { ...slide };
                delete newSlide[property];
                return newSlide;
            });
            return { ...prev, slides: updatedSlides };
        });
    };

    const handleApplyBrandKit = () => {
        if (!settings.brandKit) return;
    
        const { colors, fonts, brandingText, brandingStyle } = settings.brandKit;
    
        const mainFont = fonts.body || 'Inter' as any;
    
        handleUpdateCarouselPreferences({
            backgroundColor: colors.primary,
            fontColor: colors.text,
            font: mainFont,
            brandingText: brandingText,
            brandingStyle: brandingStyle,
            headlineStyle: {
                ...currentCarousel?.preferences.headlineStyle,
            },
            bodyStyle: {
                ...currentCarousel?.preferences.bodyStyle,
            }
        }, currentTopic);
        
        handleClearSlideOverrides('backgroundColor');
        handleClearSlideOverrides('fontColor');
    };

    const handleMoveSlide = (slideId: string, direction: 'left' | 'right') => {
        if (!currentCarousel) return;
        const slides = [...currentCarousel.slides];
        const index = slides.findIndex(s => s.id === slideId);
        if (index === -1) return;

        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= slides.length) return;
        
        [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
        setCurrentCarousel({ ...currentCarousel, slides });
    };

    const handleApplyAssistantSuggestion = (suggestion: string, type: 'hook' | 'cta') => {
        if (!selectedSlideId) {
            console.warn("No slide selected to apply suggestion.");
            return;
        }

        const fieldToUpdate = type === 'hook' ? 'headline' : 'body';
        handleUpdateSlide(selectedSlideId, { [fieldToUpdate]: suggestion });
        setIsAssistantOpen(false); // Close modal after applying.
    };

    const selectedSlide = React.useMemo(() => {
        return currentCarousel?.slides.find(s => s.id === selectedSlideId);
    }, [currentCarousel, selectedSlideId]);
    
    const mostUsedCategory = React.useMemo(() => {
        if (carouselHistory.length === 0) return 'N/A';
        const categoryCounts = carouselHistory.reduce((acc, carousel) => {
            acc[carousel.category] = (acc[carousel.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }, [carouselHistory]);

    const renderContent = () => {
        switch (view) {
            case 'LOGIN': return <LoginScreen onSignUpClick={() => openAuthModal('signup')} onSignInClick={() => openAuthModal('signin')} t={t} error={postLoginError} />;
            case 'PROFILE_SETUP': return user ? <ProfileSetupModal user={user} onSetupComplete={handleProfileSetup} t={t} /> : <div className="flex-grow flex items-center justify-center"><Loader text={t('initializingProfile')} /></div>;
            case 'DASHBOARD': return (
                <Dashboard
                    onNewCarousel={startNewCarousel}
                    onShowTutorial={() => setView('TUTORIAL')}
                    history={carouselHistory}
                    onEdit={handleEditCarousel}
                    onDelete={handleDeleteCarousel}
                    onClearHistory={handleClearHistory}
                    t={t}
                    downloadCount={downloadCount}
                    mostUsedCategory={mostUsedCategory}
                />
            );
            case 'GENERATOR': return (
                <Generator
                    user={user!}
                    isGenerating={isGenerating}
                    generationMessage={generationMessage}
                    error={error}
                    onErrorDismiss={() => setError(null)}
                    onGenerate={handleGenerateCarousel}
                    currentCarousel={currentCarousel}
                    setCurrentCarousel={setCurrentCarousel}
                    selectedSlide={selectedSlide}
                    onSelectSlide={setSelectedSlideId}
                    onUpdateSlide={handleUpdateSlide}
                    onUpdateCarouselPreferences={handleUpdateCarouselPreferences}
                    onClearSlideOverrides={handleClearSlideOverrides}
                    onMoveSlide={handleMoveSlide}
                    onOpenAssistant={() => setIsAssistantOpen(true)}
                    onOpenCaption={handleGenerateCaption}
                    onOpenThread={handleGenerateThread}
                    onDownload={handleDownloadCarousel}
                    isDownloading={isDownloading}
                    isGeneratingImageForSlide={isGeneratingImageForSlide}
                    isGeneratingVideoForSlide={isGeneratingVideoForSlide}
                    onGenerateImageForSlide={handleGenerateImageForSlide}
                    onGenerateVideoForSlide={handleGenerateVideoForSlide}
                    onEditImageForSlide={handleEditImageForSlide}
                    onGenerateAllImages={handleGenerateAllImages}
                    onGetDesignSuggestion={handleGetDesignSuggestion}
                    isSuggestingDesign={isSuggestingDesign}
                    onRegenerateContent={handleRegenerateContent}
                    onUploadVisualForSlide={handleUploadVisualForSlide}
                    onRemoveVisualForSlide={handleRemoveVisualForSlide}
                    onApplyBrandKit={handleApplyBrandKit}
                    brandKitConfigured={!!settings.brandKit}
                    t={t}
                    regeneratingPart={regeneratingPart}
                />
            );
            case 'SETTINGS': return (
                <SettingsModal
                    currentSettings={settings}
                    onSave={(newSettings) => {
                        handleSaveSettings(newSettings);
                        setView(previousView);
                    }}
                    onClose={() => setView(previousView)}
                    t={t}
                    onShowTutorial={() => setView('TUTORIAL')}
                />
            );
            case 'TUTORIAL': return (
                <TutorialScreen
                    onBack={() => setView('DASHBOARD')}
                    content={translations[language].tutorial}
                />
            );
            default: return <LoginScreen onSignUpClick={() => openAuthModal('signup')} onSignInClick={() => openAuthModal('signin')} t={t} error={postLoginError} />;
        }
    };

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            { user && view !== 'LOGIN' && (
                <Header
                    user={user}
                    onLogout={handleLogout}
                    onDashboard={goToDashboard}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    t={t}
                />
            )}
            <main className="flex-grow flex flex-col pb-16 md:pb-0 lg:overflow-y-auto">
                {renderContent()}
            </main>
            { user && view !== 'LOGIN' && <Footer /> }
            {isAssistantOpen && (
                <AiAssistantModal 
                    topic={currentTopic}
                    onClose={() => setIsAssistantOpen(false)}
                    settings={settings}
                    t={t}
                    parseError={parseAndDisplayError}
                    onApplySuggestion={handleApplyAssistantSuggestion}
                    selectedSlideId={selectedSlideId}
                />
            )}
            {isCaptionModalOpen && (
                <CaptionModal
                    topic={currentTopic}
                    onClose={() => setIsCaptionModalOpen(false)}
                    isLoading={isGeneratingCaption}
                    caption={generatedCaption}
                    error={error}
                    t={t}
                />
            )}
            {isThreadModalOpen && (
                <ThreadModal
                    onClose={() => {
                        setIsThreadModalOpen(false);
                        setError(null);
                    }}
                    isLoading={isGeneratingThread}
                    threadContent={generatedThread}
                    error={error}
                    t={t}
                />
            )}
            {isSettingsOpen && (
                <SettingsModal
                    currentSettings={settings}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={handleSaveSettings}
                    t={t}
                    onShowTutorial={() => {
                        setIsSettingsOpen(false);
                        setView('TUTORIAL');
                    }}
                />
            )}
            {user && user.profileComplete && (
                <MobileFooter
                    currentView={view}
                    onNavigate={(targetView) => {
                        if (targetView === 'DASHBOARD') {
                            goToDashboard();
                        } else if (targetView === 'SETTINGS') {
                            setPreviousView(view);
                            setView('SETTINGS');
                        } else {
                            setView(targetView);
                        }
                    }}
                    t={t}
                />
            )}
            {authModal === 'signup' && (
                <SignUpModal
                    onClose={closeAuthModal}
                    onSignUp={handleSignUp}
                    onSwitchToSignIn={() => openAuthModal('signin')}
                    onSignInWithGoogle={handleSignInWithGoogle}
                    t={t}
                    error={authError}
                />
            )}
            {authModal === 'signin' && (
                <SignInModal
                    onClose={closeAuthModal}
                    onSignIn={handleSignIn}
                    onSwitchToSignUp={() => openAuthModal('signup')}
                    onSignInWithGoogle={handleSignInWithGoogle}
                    t={t}
                    error={authError}
                />
            )}
        </div>
    );
}