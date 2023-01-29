module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "no-duplicate-imports": 1,
    "no-self-compare": 2,
    "no-template-curly-in-string": 1,
    "no-unmodified-loop-condition": 2,
    "no-unreachable-loop": 1,
    "no-unused-private-class-members": 1,
    "require-atomic-updates": 2,
    "block-scoped-var": 2,
    "default-case-last": 2,
    "default-param-last": 1,
    "dot-notation": 1,
    eqeqeq: 1,
    "id-denylist": [2, "undefined"],
    "no-array-constructor": 1,
    "no-bitwise": 1,
    "no-case-declarations": 2,
    "no-else-return": 1,
    "no-eq-null": 2,
    "no-floating-decimal": 1,
    "no-implicit-coercion": 1,
    "no-invalid-this": 2,
    "no-labels": 1,
    "no-lone-blocks": 1,
    "no-lonely-if": 1,
    "no-loop-func": 2,
    "no-multi-assign": 1,
    "no-nested-ternary": 1,
    "no-new": 1,
    "no-new-object": 1,
    "no-new-wrappers": 2,
    "no-param-reassign": 2,
    "no-plusplus": 2,
    "no-return-assign": 1,
    "no-return-await": 2,
    "no-sequences": 1,
    "no-throw-literal": 2,
    "no-unused-expressions": 1,
    "no-useless-call": 1,
    "no-useless-concat": 1,
    "no-useless-rename": 1,
    "no-useless-return": 1,
    "no-var": 2,
    "no-void": 1,
    "prefer-const": 1,
    "react/prop-types": 0,
    "react/boolean-prop-naming": 1,
    "react/button-has-type": 1,
    "react/default-props-match-prop-types": 1,
    "react/no-access-state-in-setstate": 2,
    "react/no-array-index-key": 1,
    "react/no-arrow-function-lifecycle": 2,
    "react/no-danger": 2,
    "react/no-invalid-html-attribute": 2,
    "react/no-multi-comp": [1, { ignoreStateless: true }],
    "react/no-redundant-should-component-update": 1,
    "react/no-this-in-sfc": 2,
    "react/no-typos": 1,
    "react/no-unsafe": 2,
    "react/no-unstable-nested-components": 2,
    "react/no-unused-class-component-methods": 1,
    "react/no-unused-prop-types": 1,
    "react/no-unused-state": 1,
    "react/no-will-update-set-state": 2,
    "react/prefer-stateless-function": 1,
    "react/self-closing-comp": 1,
    "react/style-prop-object": 2,
    "react/void-dom-elements-no-children": 2,
    "react/jsx-props-no-spreading": 2,
    "react/jsx-pascal-case": 2,
    "react/jsx-no-useless-fragment": 1,
    "react/jsx-no-constructed-context-values": 1,
    "@typescript-eslint/ban-types": 1,
    "@typescript-eslint/no-empty-interface": 1,
    "@typescript-eslint/no-for-in-array": 1,
    "@typescript-eslint/no-invalid-void-type": 2,
    "@typescript-eslint/no-inferrable-types": 1,
    "@typescript-eslint/no-unnecessary-type-constraint": 1,
    "@typescript-eslint/no-unnecessary-type-assertion": 1,
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": 1,
    "@typescript-eslint/unified-signatures": 1,
    "@typescript-eslint/prefer-optional-chain": 1,
    "@typescript-eslint/prefer-nullish-coalescing": 1,
    "@typescript-eslint/prefer-literal-enum-member": 2,
    "@typescript-eslint/prefer-enum-initializers": 1,
    "@typescript-eslint/require-await": 1,
    "no-shadow": 0,
    "@typescript-eslint/no-shadow": 2,
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": 1,
  },
};
