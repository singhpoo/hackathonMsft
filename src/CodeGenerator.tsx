// CodeGenerator.tsx
import React, { useState, useCallback } from 'react';
import {
    PrimaryButton,
    Stack,
    Image,
    ImageFit,
    Text,
} from '@fluentui/react';
import { callOpenAI } from './utils/openAIWrapper';
import {
    styles,
    ContentViewer,
    FullScreenModal,
    FileUploader,
    ProcessingIndicator,
    readFileContent
} from './sharedUtils';

const CodeGenerator: React.FC = () => {
    const [context, setContext] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [figma, setFigma] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [fullScreenContent, setFullScreenContent] = useState({ title: '', content: '' });

    const handleFolderUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setIsProcessing(true);
            const processFiles = async (fileList: FileList): Promise<string> => {
                let processedContext = '';
                for (let i = 0; i < fileList.length; i++) {
                    const file = fileList[i];
                    if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
                        const content = await readFileContent(file);
                        processedContext += `// File: ${file.name}\n${content}\n\n`;
                    }
                }
                return processedContext;
            };

            processFiles(files).then((processedContext) => {
                setContext(processedContext);
                setIsProcessing(false);
            });
        }
    }, []);

    const handleFigmaUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setFigma(content);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleSubmit = async () => {
        const aiResponse = await callOpenAI(context);
        setResponse(aiResponse);
    };

    const showFullScreen = (title: string, content: string) => {
        setFullScreenContent({ title, content });
        setIsFullScreen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Code Generator
            </div>
            <div className={styles.content}>
                <div className={styles.column}>
                    <Stack tokens={{ childrenGap: 20 }}>
                        <FileUploader
                            id="folder-input"
                            label="Select folder:"
                            accept=".ts,.tsx"
                            multiple={true}
                            onChange={handleFolderUpload}
                        />
                        <FileUploader
                            id="figma-input"
                            label="Upload Figma:"
                            accept="image/*"
                            multiple={false}
                            onChange={handleFigmaUpload}
                        />
                        <PrimaryButton
                            onClick={handleSubmit}
                            disabled={isProcessing || !context}
                            className={styles.button}
                        >
                            Generate Component
                        </PrimaryButton>
                        {isProcessing && <ProcessingIndicator />}
                        {context && (
                            <ContentViewer
                                content={context}
                                title="Processed Context:"
                                onExpand={() => showFullScreen('Processed Context', context)}
                            />
                        )}
                        {figma && (
                            <Stack>
                                <Text variant="large">Uploaded Figma:</Text>
                                <Image src={figma} alt="Uploaded Figma" imageFit={ImageFit.contain} width="100%" />
                            </Stack>
                        )}
                    </Stack>
                </div>
                <div className={styles.column}>
                    <ContentViewer
                        content={response}
                        title="OpenAI Response:"
                        onExpand={() => showFullScreen('OpenAI Response', response)}
                    />
                </div>
            </div>
            <FullScreenModal
                isOpen={isFullScreen}
                onDismiss={() => setIsFullScreen(false)}
                content={fullScreenContent.content}
                title={fullScreenContent.title}
            />
        </div>
    );
};

export default CodeGenerator;