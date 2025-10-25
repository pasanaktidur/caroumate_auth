import * as React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DownloadIcon, LoaderIcon } from './icons';
import { translations } from '../lib/translations';


export const TutorialScreen: React.FC<{
    onBack: () => void;
    content: typeof translations['en']['tutorial'];
}> = ({ onBack, content }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        const tutorialElement = document.getElementById('tutorial-content');
        if (tutorialElement) {
            try {
                const isDarkMode = document.documentElement.classList.contains('dark');
                const canvas = await html2canvas(tutorialElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save('CarouMate_User_Guide.pdf');
            } catch (error) {
                console.error("Error generating PDF:", error);
            }
        }
        setIsGeneratingPdf(false);
    };

    const renderContentItem = (item: any, index: number) => {
        switch (item.type) {
            case 'p':
                return <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: item.text }} />;
            case 'ol':
                return (
                    <ol key={index} className="list-decimal list-inside space-y-2 mb-4 pl-4">
                        {item.items.map((li: string, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
                    </ol>
                );
            case 'ul':
                 return (
                    <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4">
                        {item.items.map((li: string, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
                    </ul>
                );
            case 'dl':
                 return (
                    <dl key={index} className="space-y-4 mb-4">
                        {item.items.map((dlItem: { dt: string; dd: string | string[] }, i: number) => (
                            <div key={i}>
                                <dt className="font-semibold text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: dlItem.dt }} />
                                {Array.isArray(dlItem.dd) ? (
                                     <dd className="mt-1 ml-4 text-gray-600 dark:text-gray-400">
                                        <ul className="list-disc list-inside">
                                            {dlItem.dd.map((subItem, j) => <li key={j} dangerouslySetInnerHTML={{__html: subItem}}/>)}
                                        </ul>
                                     </dd>
                                ) : (
                                    <dd className="mt-1 ml-4 text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: dlItem.dd }} />
                                )}
                            </div>
                        ))}
                    </dl>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-primary-600 dark:text-primary-400 hover:underline">
                    &larr; {content.backToDashboard}
                </button>
                <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                >
                    {isGeneratingPdf ? <LoaderIcon className="w-4 h-4 mr-2 animate-spin"/> : <DownloadIcon className="w-4 h-4 mr-2"/>}
                    {isGeneratingPdf ? content.generatingPDF : content.downloadPDF}
                </button>
            </div>
            <div id="tutorial-content" className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-lg shadow-lg text-gray-700 dark:text-gray-300">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{content.content.welcome}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{content.content.intro}</p>
                
                {content.content.sections.map((section, index) => (
                    <div key={index} className="mb-8">
                        <h2 className="text-2xl font-semibold border-b-2 border-primary-500 pb-2 mb-4 text-gray-800 dark:text-gray-200">{section.title}</h2>
                        <div className="prose dark:prose-invert max-w-none">
                          {section.content.map(renderContentItem)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
