export default {
  type: "object",
  properties: {
    manifest_version: { type: "integer" },
    name: { type: "string" },
    version: { type: "string" },
    description: { type: "string" },
    icons: { type: "object" },
  },
  required: ["manifest_version", "name", "version", "description", "icons"],
  additionalProperties: true,
};