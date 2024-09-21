import axios from 'axios';

const OPENAI_API_KEY = 'your_openai_api_key_here';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const callOpenAI = async (context: string): Promise<string> => {
    const systemPrompt = "You are a helpful assistant that analyzes TypeScript code and generates unit tests for TSX files.";

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: context }
                ],
                functions: [
                    {
                        name: "generate_test_file",
                        description: "Generate a unit test file for a TSX component",
                        parameters: {
                            type: "object",
                            properties: {
                                filename: {
                                    type: "string",
                                    description: "The name of the TSX file (e.g., 'Component.tsx')"
                                },
                                testContent: {
                                    type: "string",
                                    description: "The content of the test file"
                                }
                            },
                            required: ["filename", "testContent"]
                        }
                    }
                ],
                function_call: "auto"
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const result = response.data.choices[0].message;

        if (result.function_call && result.function_call.name === "generate_test_file") {
            const { filename, testContent } = JSON.parse(result.function_call.arguments);
            return `<${filename}.test.tsx>\n\`\`\`typescript\n${testContent}\n\`\`\`\n</${filename}.test.tsx>`;
        } else {
            return result.content;
        }
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return 'Error occurred while processing the request.';
    }
};