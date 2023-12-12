import { DMMF, GeneratorOptions } from "@prisma/generator-helper";

export class D2Generator {
    d2Schema: string = '';
    
    constructor(readonly options: GeneratorOptions) {
        
    }

    public Generate() {
        this.d2Schema = '';

        let result : string = '';
        for (const model of this.options.dmmf.datamodel.models) {
           result += this.WriteTable(model);
        }

        result += this.WriteRelations(this.options.dmmf.datamodel.models);
        return result;

    }

    public WriteRelations(models: DMMF.Model[]) : string {
        const foundRelations : string[] = [];
        models.forEach((model)=> {
            model.fields.forEach((candidateField) => {
                if (candidateField.kind == 'object') {
                    candidateField.relationFromFields?.forEach(
                        (relation) => {
                            foundRelations.push(`${model.name}.${relation} -> ${candidateField.type}`)
                        }
                    )
                    
                }
            })
        })
        return foundRelations.join('\n')
    }

    public WriteTable(model: DMMF.Model) : string {
        return `
${model.name}: {
    shape: sql_table
    ${model.fields.map((field) => {
        return this.WriteColumn(
            field, 
            model.fields.find((candidate) => {
                if (candidate.relationFromFields) {
                    const relationContainsOrField = candidate.relationFromFields.find((relation) => relation == field.name);
                    if (relationContainsOrField) {
                        return candidate;
                    }    
                }
                return undefined;
            }) ? true : false
             )
    }).join('\n\t')}
}
        `
    }

    public WriteColumn(field : DMMF.Field, isForeignKey: boolean) : string {
        let constraints : string[] =[];
        if (field.isId) {
            constraints.push('primary_key');
        }
        if (isForeignKey) {
            constraints.push('foreign_key');
        }
        if (field.isUnique) {
            constraints.push('unique');
        }

        let constraint : string | undefined;
        if (constraints.length > 0) {
            constraint = `{ constraint: [${constraints.join('; ')}] }`
        }

        return `${field.name}: ${field.type} ${constraint ?? ''}`;
    } 
    
    
}
