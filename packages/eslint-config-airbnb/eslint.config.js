import AirBnB from 'eslint-config-airbnb';
import AirBnBBase from 'eslint-config-airbnb-base';
import AirBnBTypescript from 'eslint-config-airbnb-typescript';
import { FlatCompat } from '@eslint/eslintrc';

const EslintFlatCompat = new FlatCompat();

export const AirBnbConfig = EslintFlatCompat.extends(AirBnB);
export const AirBnbBaseConfig = EslintFlatCompat.extends(AirBnBBase);
export const AirBnbTypescriptConfig = EslintFlatCompat.extends(AirBnBTypescript);
