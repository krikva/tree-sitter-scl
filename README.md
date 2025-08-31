# tree-sitter-scl
Siemens SCL grammar for tree-sitter

> **⚠️ DISCLAIMER: This project is currently in testing phase and may contain incomplete features or bugs. Use in production environments with caution.**

## About SCL
SCL (Structured Control Language) is a high-level textual programming language used in Siemens SIMATIC STEP 7 and TIA Portal for programming PLCs (Programmable Logic Controllers).

## Standards and Specifications
SCL is based on the international standard IEC 61131-3, which defines programming languages for programmable controllers. SCL specifically follows the Structured Text (ST) language specification from this standard, with Siemens-specific extensions and adaptations.

Key standards and specifications:
- IEC 61131-3: International standard for PLC programming languages
- Siemens implementation follows the ST (Structured Text) component of this standard
- Contains Siemens-specific extensions to the ST language

## Features
This Tree-sitter grammar provides syntax highlighting, code folding, and other language features for SCL files in compatible editors:

- Syntax highlighting for SCL keywords, operators, and literals
- Code folding for blocks (IF, CASE, FUNCTION, etc.)
- Symbol navigation (functions, data blocks, variables)
- Smart indentation support
- Code regions for better organization
- Proper handling of string literals and comments

## Installation and Usage

### For Neovim Users

1. Make sure you have [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) installed.
2. Add this repository to your parser configurations:

```lua
require('nvim-treesitter.configs').setup {
  parser_install_dir = "/path/to/parser/location",
  ensure_installed = { "scl" },
  highlight = {
    enable = true,
  },
  indent = {
    enable = true,
  },
}

-- Register SCL parser
local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
parser_config.scl = {
  install_info = {
    url = "https://github.com/yourusername/tree-sitter-scl",
    files = { "src/parser.c" },
    branch = "main",
    generate_requires_npm = true,
    requires_generate_from_grammar = true,
  },
  filetype = "scl",
}
```

3. Run `:TSInstall scl` to install the parser.

### For Helix Editor

Add this to your `languages.toml`:

```toml
[[language]]
name = "scl"
scope = "source.scl"
injection-regex = "scl"
file-types = ["scl"]
roots = []
comment-token = "//"
language-server = { command = "none" }
indent = { tab-width = 4, unit = "    " }
grammar = "scl"
```

### For VSCode

This grammar can be used with the [Tree Sitter Syntax Highlight](https://marketplace.visualstudio.com/items?itemName=amaanq.tree-sitter-syntax-highlight) extension for VSCode.

## References
- [Siemens SCL Programming Manual](https://support.industry.siemens.com)
- [IEC 61131-3 Standard](https://webstore.iec.ch/publication/4552)
- [VSCode SCL Extension](https://github.com/Gunders89/vscode-scl) - This extension was used as the basis for creating this tree-sitter parser

## Contributing
Contributions are welcomed to assist in making this parser more robust and complete. Whether you're fixing bugs, improving documentation, or adding new features, your help is appreciated.

Ways to contribute:
- Report bugs or issues you encounter
- Submit pull requests with grammar improvements
- Add test cases for different SCL constructs
- Improve documentation and examples
- Suggest new features or enhancements

Please feel free to open issues or pull requests on GitHub to get started.
