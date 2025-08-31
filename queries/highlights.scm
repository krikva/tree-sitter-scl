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
  "VAR_CONSTANT"
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
  "CONTINUE"
  "BREAK"
  "GOTO"
  "LABEL"
  "END_LABEL"
  "EXIT"
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
  "COUNTER"
  "S5TIME"
  "TIMER"
  "IEC_TIMER"
  "TON_TIME"
  "TOF_TIME"
  "TP_TIME"
  "ENO"
] @type.builtin

;; Built-in functions - using pattern matching on function calls
((function_call
  (identifier) @function.builtin)
 (#match? @function.builtin "^(?i)(ABS|SQR|SQRT|EXP|EXPD|LN|LOG|ACOS|ASIN|ATAN|COS|SIN|TAN|ROL|ROR|SHL|SHR|SEL|MAX|MIN|LIMIT|MUX|ROUND|TRUNC|TIME_TCK|CONCAT|VAL_STRG|STRG_VAL|S_CONV|bool_to_byte|bool_to_dword|bool_to_word|bool_to_int|bool_to_dint|byte_to_bool|byte_to_char|byte_to_dword|byte_to_int|byte_to_dint|byte_to_word|char_to_byte|char_to_int|char_to_string|char_to_wstring|date_to_dint|dint_to_bool|dint_to_byte|dint_to_word|dint_to_dword|dint_to_lword|dint_to_sint|dint_to_usint|dint_to_int|dint_to_uint|dint_to_udint|dint_to_ulint|dint_to_real|dint_to_lreal|dint_to_time|dint_to_date|dint_to_string|dint_to_wstring|dword_to_bool|dword_to_byte|dword_to_dint|dword_to_real|dword_to_word|dword_to_int|word_to_bool|word_to_byte|word_to_int|word_to_dint|word_to_dword|word_to_block_db|string_to_char|string_to_int|string_to_real|time_to_dint|int_to_bool|int_to_byte|int_to_word|int_to_dword|int_to_lword|int_to_sint|int_to_usint|int_to_uint|int_to_dint|int_to_udint|int_to_ulint|int_to_real|int_to_lreal|int_to_time|int_to_string|uint_to_bool|uint_to_byte|uint_to_word|uint_to_dword|uint_to_sint|uint_to_usint|uint_to_int|uint_to_dint|uint_to_real|uint_to_string|lint_to_bool|lint_to_sint|lint_to_int|lint_to_dint|lint_to_real|lint_to_string|real_to_dword|real_to_sint|real_to_int|real_to_dint|real_to_string|lreal_to_lint|lreal_to_real|lreal_to_string|bcd_to_int|bcd_to_dint|word_bcd_to_int|dword_bcd_to_dint|block_db_to_word)$"))

;; Boolean literals
[
  "TRUE"
  "FALSE"
] @constant.builtin.boolean

((identifier) @constant.builtin.boolean
 (#match? @constant.builtin.boolean "^(?i)(NULL)$"))

(boolean_literal) @constant.builtin.boolean

;; Numbers
(number) @constant.numeric

;; Strings
(string_literal) @string

;; Comments
(comment) @comment
(block_comment) @comment.block

;; Region name
(region
  name: (_) @comment)

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

;; Data block declarations
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

;; System attributes
((identifier) @attribute
 (#match? @attribute "^S7_"))

((identifier) @attribute
 (#match? @attribute "^(ExternalAccessible|ExternalVisible|ExternalWritable|LibVersion|InstructionName)$"))

;; Time literals
(time_literal) @constant.builtin
(date_literal) @constant.builtin
(date_time_literal) @constant.builtin
(byte_string_literal) @constant.builtin