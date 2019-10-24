const pathAlias = require("./webpack.alias");

module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: ["airbnb", "prettier"],
  env: {
    es6: true,
    node: true,
    browser: true
  },
  globals: {
    DEBUG: true
  },
  plugins: ["json", "prettier"],
  rules: {
    "prettier/prettier": ["error"],
    "jsx-a11y/label-has-for": 0, //it's deprecated and replaced by 'label-has-associated-control'
    "react/destructuring-assignment": 0,
    // "react/jsx-max-props-per-line": [1, { maximum: 1 }], //it doesn't work with prettier, you can remove prettier from rules: 'prettier/prettier'...
    // "react/jsx-first-prop-new-line": [1, "multiline"], //it doesn't work with prettier, you can remove prettier from rules: 'prettier/prettier'...
    "react/prop-types": 0,
    //"react/prefer-stateless-function": 0, //TODO: remove after testing
    "react/react-in-jsx-scope": 0,
    "react/jsx-wrap-multilines": [
      "error",
      { arrow: true, return: true, declaration: true }
    ],
    "no-underscore-dangle": 0,
    "no-unused-expressions": ["error", { allowShortCircuit: true }],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-alert": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-plusplus": 0,
    "class-methods-use-this": 0,
    "max-len": [
      "warn",
      {
        code: 120,
        tabWidth: 2,
        comments: 1000,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ]
  },
  settings: {
    "import/resolver": {
      alias: {
        map: Object.keys(pathAlias).map(key => [key, pathAlias[key]]),
        extensions: [".ts", ".js", ".jsx", ".tsx", ".json"]
      }
    }
  }
};
