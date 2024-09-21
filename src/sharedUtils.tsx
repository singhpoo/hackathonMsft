// common.tsx
import React from 'react';
import {
    Text,
    Spinner,
    SpinnerSize,
    Stack,
    IconButton,
    Modal,
    mergeStyles,
    IIconProps,
    ITextStyles,
    IStackTokens,
    DefaultPalette,
    Label,
} from '@fluentui/react';

// Enhanced Common Styles
export const styles = {
    container: mergeStyles({
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: DefaultPalette.neutralLighterAlt,
    }),
    header: mergeStyles({
        backgroundColor: DefaultPalette.themePrimary,
        color: DefaultPalette.white,
        padding: '16px',
        fontSize: '24px',
        fontWeight: 'bold',
    }),
    content: mergeStyles({
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100vh - 56px)', // Subtracting header height
        overflow: 'hidden',
    }),
    column: mergeStyles({
        flex: 1,
        padding: '20px',
        height: '100%',
        overflow: 'auto',
        backgroundColor: DefaultPalette.white,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        margin: '10px',
        borderRadius: '4px',
    }),
    pre: mergeStyles({
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxHeight: '300px',
        overflowY: 'auto',
        overflowX: 'hidden',
        border: `1px solid ${DefaultPalette.neutralLight}`,
        padding: '10px',
        margin: '10px 0',
        backgroundColor: DefaultPalette.neutralLighterAlt,
        borderRadius: '4px',
    }),
    fullScreenPre: mergeStyles({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: DefaultPalette.white,
        padding: '20px',
        overflowY: 'auto',
    }),
    closeButton: mergeStyles({
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1001,
    }),
    button: mergeStyles({
        maxWidth: '200px',
        margin: '10px 0',
    }),
    fileInput: mergeStyles({
        marginBottom: '10px',
    }),
};

// Common Icons
export const icons: Record<string, IIconProps> = {
    expand: { iconName: 'FullScreen' },
    close: { iconName: 'Cancel' },
};

// Common Components
export const ContentViewer: React.FC<{
    content: string;
    title: string;
    onExpand: () => void;
}> = ({ content, title, onExpand }) => (
    <Stack>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <Text variant="large" styles={headerTextStyles}>{title}</Text>
            <IconButton
                iconProps={icons.expand}
                onClick={onExpand}
                ariaLabel={`Expand ${title.toLowerCase()}`}
            />
        </Stack>
        <div className={styles.pre}>{content}</div>
    </Stack>
);

export const FullScreenModal: React.FC<{
    isOpen: boolean;
    onDismiss: () => void;
    content: string;
    title: string;
}> = ({ isOpen, onDismiss, content, title }) => (
    <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        isBlocking={false}
        styles={{ main: { minWidth: '80%', minHeight: '80%' } }}
    >
        <div className={styles.fullScreenPre}>
            <IconButton
                className={styles.closeButton}
                iconProps={icons.close}
                onClick={onDismiss}
                ariaLabel="Close full screen"
            />
            <Text variant="xLarge" styles={headerTextStyles}>{title}</Text>
            <pre>{content}</pre>
        </div>
    </Modal>
);

export const FileUploader: React.FC<{
    id: string;
    label: string;
    accept: string;
    multiple: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, accept, multiple, onChange }) => (
    <Stack className={styles.fileInput}>
        <Label htmlFor={id} styles={labelStyles}>{label}</Label>
        <input
            type="file"
            id={id}
            accept={accept}
            multiple={multiple}
            onChange={onChange}
            style={{ marginTop: '5px' }}
            {...(multiple ? { webkitdirectory: "", directory: "" } : {})}
        />
    </Stack>
);

export const ProcessingIndicator: React.FC = () => (
    <Stack horizontal verticalAlign="center" tokens={stackTokens}>
        <Spinner size={SpinnerSize.small} />
        <Text styles={processingTextStyles}>Processing files...</Text>
    </Stack>
);

export const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target) {
                resolve(event.target.result as string);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

// Styles for text elements
const headerTextStyles: ITextStyles = {
    root: {
        fontWeight: 'bold',
        color: DefaultPalette.themePrimary,
    }
};

const labelStyles: ITextStyles = {
    root: {
        fontWeight: 'semibold',
        color: DefaultPalette.neutralPrimary,
    }
};

const processingTextStyles: ITextStyles = {
    root: {
        marginLeft: '10px',
        color: DefaultPalette.themePrimary,
    }
};

// Stack tokens
const stackTokens: IStackTokens = {
    childrenGap: 10,
};