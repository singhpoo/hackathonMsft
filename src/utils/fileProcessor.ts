export const processFolder = async (fileList: FileList): Promise<string> => {
    let context = '';

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = await readFileContent(file);
            context += `// File: ${file.name}\n${content}\n\n`;
        }
    }
    console.log('Processed context:', context);
    return context;
};

const readFileContent = (file: File): Promise<string> => {
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