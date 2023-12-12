import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import fs from "fs";
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { D2Generator } from './utils/d2-generator'

const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    const generator = new D2Generator(options);

    const file: string = options.generator.output?.value ?? "./Schema.d2";
    try {
      await fs.promises.mkdir(path.dirname(file), { recursive: true });
    } catch { }
    const generated = generator.Generate();
    await fs.writeFileSync(file, generated, "utf8");
    ;
  },
})
