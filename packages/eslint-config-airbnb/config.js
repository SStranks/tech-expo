// import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';

const EslintFlatCompat = new FlatCompat();

export const AirBnbConfig = EslintFlatCompat.extends('airbnb');
export const AirBnbBaseConfig = EslintFlatCompat.extends('airbnb-base');
export const AirBnbTypescriptConfig = EslintFlatCompat.extends('airbnb-typescript');
export const AirBnbTypescriptBaseConfig = EslintFlatCompat.extends('airbnb-typescript/base');
