;; Keywords
[
  "FUNCTION_BLOCK"
  "FUNCTION"
  "END_FUNCTION_BLOCK"
  "END_FUNCTION"
  "DATA_BLOCK"
  "END_DATA_BLOCK"
  "ORGANIZATION_BLOCK"
  "END_ORGANIZATION_BLOCK"
  "VERSION"
  "BEGIN"
  "VAR"
  "VAR_INPUT"
  "VAR_OUTPUT"
  "VAR_IN_OUT"
  "VAR_TEMP"
  "END_VAR"
  "CONST"
  "END_CONST"
  "TYPE"
  "END_TYPE"
  "AT"
  "STRUCT"
  "END_STRUCT"
  "ARRAY"
  "OF"
  "IF"
  "THEN"
  "ELSIF"
  "ELSE"
  "END_IF"
  "CASE"
  "END_CASE"
  "FOR"
  "TO"
  "BY"
  "DO"
  "END_FOR"
  "WHILE"
  "END_WHILE"
  "REPEAT"
  "UNTIL"
  "END_REPEAT"
  "RETURN"
  "REGION"
  "END_REGION"
] @keyword

;; Operators
[
  ":="
  "+"
  "-"
  "*"
  "/"
  ">"
  ">="
  "<"
  "<="
  "="
  "<>"
  "MOD"
  "DIV"
  "OR"
  "XOR"
  "AND"
  "NOT"
  ".."
] @operator

;; Punctuation
[
  "{"
  "}"
  "("
  ")"
  "["
  "]"
  ","
  ";"
  ":"
  "."
  "#"
] @punctuation.delimiter

;; Data types
[
  "BOOL"
  "BYTE"
  "WORD"
  "DWORD"
  "CHAR"
  "SINT"
  "INT"
  "DINT"
  "LINT"
  "USINT"
  "UINT"
  "UDINT"
  "ULINT"
  "REAL"
  "LREAL"
  "TIME"
  "DATE"
  "TIME_OF_DAY"
  "TOD"
  "DATE_AND_TIME"
  "DT"
  "DTL"
  "STRING"
  "WSTRING"
  "ANY"
  "POINTER"
  "VOID"
] @type.builtin

;; Boolean literals
[
  "TRUE"
  "FALSE"
] @constant.builtin.boolean

(boolean_literal) @constant.builtin.boolean

;; Numbers
(number) @constant.numeric

;; Strings
(string_literal) @string

;; Comments
(comment) @comment
(block_comment) @comment.block

;; Function declarations
(function
  (string (identifier) @function.definition))
(function
  (identifier) @function.definition)

;; Function block declarations
(function_block
  (string (identifier) @function.definition))
(function_block
  (identifier) @function.definition)

;; Function block declarations
(data_block
  (string (identifier) @function.definition))
(data_block
  (identifier) @function.definition)

;; Function calls
(function_call
  (identifier) @function.call)

;; Case elements
(case_value) @constant

;; For Loop elements
(for_statement
  (identifier) @variable)

;; Variable declarations
(variable_declaration
  (identifier) @variable)

;; Variable access
(variable_access
  (variable_base
    (identifier) @variable))

(variable_selector
  (identifier) @property)

;; Time literals
(time_literal) @constant.builtin
(date_literal) @constant.builtin
(date_time_literal) @constant.builtin
(byte_string_literal) @constant.builtin