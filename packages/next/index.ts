import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "@minimaltech/eslint-react";

const configs = [...reactPlugin, nextPlugin.configs.recommended];

export = configs
