module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base', 'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    //me retorne erro se tiver linha mto grande
    "prettier/prettier": "error",
    //para nao obrigar a palavra this na classe
    "class-methods-use-this": "off",
    //permitir assinalar parametros
    "no-param-reassing": "off",
    // nao usar o camelcase
    "camelcase": "off",
    //o next nos middlewares para nao ter problema
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  },
};
