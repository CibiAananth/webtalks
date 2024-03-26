import { defineCodeRunnersSetup } from '@slidev/types'
import manifestSchema from '../helpers/manifest-schema';

export default defineCodeRunnersSetup(() => {
  return {
    async json(code) {
      const data = JSON.parse(code);
      const element = document.createElement("div");

      const Ajv = (await import("ajv")).default;
      const ajv = new Ajv();

      const valid = ajv.validate(manifestSchema, data);

      if (!valid) {
        // Prettify and format error messages as HTML
        const errorsHtml = ajv?.errors?.map(error =>
          `<div class="text-red-500 bg-red-500 p-2 rounded-lg">${error.instancePath} ${error.message}</div>`
        ).join('');
        element.innerHTML = `<div class="validation-errors">${errorsHtml}</div>`
      } else {
        element.innerHTML = `<div class="text-green-500 p-2 rounded-lg">Manifest is valid</div>`
      }

      return { element };
    },
  }
})
