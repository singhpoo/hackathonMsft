import React, { useState } from 'react';
import { Nav, INavLinkGroup, Stack } from '@fluentui/react';
import TestGenerator from "./TestGenerator";
import CodeGenerator from './CodeGenerator';

const HomePage: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<string>('test-generator');

    const navLinkGroups: INavLinkGroup[] = [
        {
            links: [
                {
                    name: 'Test Generator',
                    key: 'test-generator',
                    icon: 'FolderOpen',
                    url: '',
                },
                {
                    name: 'Code Generator',
                    key: 'code-generator',
                    icon: 'Design',
                    url: '',
                },
            ],
        },
    ];

    const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: any) => {
        if (item) {
            setSelectedKey(item.key);
        }
    };

    return (
        <Stack horizontal>
            <Nav
                groups={navLinkGroups}
                selectedKey={selectedKey}
                onLinkClick={onLinkClick}
                styles={{
                    root: {
                        width: 200,
                        height: '100vh',
                        boxSizing: 'border-box',
                        border: '1px solid #eee',
                        overflowY: 'auto',
                    },
                }}
            />
            <Stack.Item grow styles={{ root: { padding: 20 } }}>
                {selectedKey === 'test-generator' && <TestGenerator />}
                {selectedKey === 'code-generator' && <CodeGenerator />}
            </Stack.Item>
        </Stack>
    );
}

export default HomePage;