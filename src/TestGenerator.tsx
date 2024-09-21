// TestGenerator.tsx
import React, { useState, useCallback } from 'react';
import {
    PrimaryButton,
    Stack,
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

const TestGenerator: React.FC = () => {
    const [context, setContext] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
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
                Test Generator
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
                        <PrimaryButton
                            onClick={handleSubmit}
                            disabled={isProcessing || !context}
                            className={styles.button}
                        >
                            Generate Tests
                        </PrimaryButton>
                        {isProcessing && <ProcessingIndicator />}
                        {context && (
                            <ContentViewer
                                content={context}
                                title="Processed Context:"
                                onExpand={() => showFullScreen('Processed Context', context)}
                            />
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

export default TestGenerator;