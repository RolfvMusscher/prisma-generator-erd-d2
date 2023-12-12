import { D2Generator } from './d2-generator';
import { DMMF, GeneratorOptions } from "@prisma/generator-helper";

describe('D2Generator', () => {
    test('Generate method should return a valid schema', () => {
        // Mock data for testing
        const mockDmmf: DMMF.Document = {
            datamodel: {
                models: [
                    {
                        name: 'User',
                        fields: [
                            { name: 'id', type: 'Int', isId: true, isUnique: true },
                            { name: 'name', type: 'String', isUnique: false },
                        ],
                    } ,
                    {
                        name: 'Post',
                        fields: [
                            { name: 'id', type: 'Int', isId: true, isUnique: true },
                            { name: 'title', type: 'String', isUnique: false },
                            { name: 'userId', type: 'Int', isUnique: false, kind: 'object', relationFromFields: ['userId'] },
                        ],
                    } ,
                ],
            },
            schemaPath: '',
        }  as unknown as DMMF.Document;

        const mockOptions: GeneratorOptions = {
            generator: {
                name: 'd2generator',
                output: { fromEnvVar : 'output', value : 'diagram.d2' },
            },
            otherGenerators: [],
            dmmf: mockDmmf,
        } as unknown as GeneratorOptions;

        const generator = new D2Generator(mockOptions);
        const generatedSchema = generator.Generate();

        // Add your assertion here, for example, you can check if the generated schema contains specific strings.
        expect(generatedSchema).toContain('User');
        expect(generatedSchema).toContain('Post');
        expect(generatedSchema).toContain('foreign_key');
    });

    // Add more tests as needed
});
