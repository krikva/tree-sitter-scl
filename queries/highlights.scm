;; Highlighting for SCL

;; Keywords
(["FUNCTION" "function" 
  "FUNCTION_BLOCK" "function_block"
  "DATA_BLOCK" "data_block"
  "ORGANIZATION_BLOCK" "organization_block"
  "END_FUNCTION" "end_function"
  "END_FUNCTION_BLOCK" "end_function_block"
  "END_DATA_BLOCK" "end_data_block"
  "END_ORGANIZATION_BLOCK" "end_organization_block"
  "VAR" "var"
  "VAR_INPUT" "var_input"
  "VAR_OUTPUT" "var_output"
  "VAR_IN_OUT" "var_in_out"
  "VAR_TEMP" "var_temp"
  "VAR_CONSTANT" "var_constant"
  "CONST" "const"
  "TYPE" "type"
  "END_VAR" "end_var"
  "END_CONST" "end_const"
  "END_TYPE" "end_type"
  "STRUCT" "struct"
  "END_STRUCT" "end_struct"
  "ARRAY" "array"
  "OF" "of"
  "AT" "at"
  "IF" "if"
  "THEN" "then"
  "ELSIF" "elsif"
  "ELSE" "else"
  "END_IF" "end_if"
  "CASE" "case"
  "END_CASE" "end_case"
  "FOR" "for"
  "TO" "to"
  "BY" "by"
  "DO" "do"
  "END_FOR" "end_for"
  "WHILE" "while"
  "END_WHILE" "end_while"
  "REPEAT" "repeat"
  "UNTIL" "until"
  "END_REPEAT" "end_repeat"
  "RETURN" "return"
  "REGION" "region"
  "END_REGION" "end_region"] @keyword)

;; Data Types
([
  "BOOL" "bool"
  "BYTE" "byte"
  "WORD" "word"
  "DWORD" "dword"
  "CHAR" "char"
  "SINT" "sint"
  "INT" "int"
  "DINT" "dint"
  "LINT" "lint"
  "USINT" "usint"
  "UINT" "uint"
  "UDINT" "udint"
  "ULINT" "ulint"
  "REAL" "real"
  "LREAL" "lreal"
  "TIME" "time"
  "DATE" "date"
  "TIME_OF_DAY" "time_of_day"
  "TOD" "tod"
  "DATE_AND_TIME" "date_and_time"
  "DT" "dt"
  "DTL" "dtl"
  "STRING" "string"
  "WSTRING" "wstring"
  "ANY" "any"
  "POINTER" "pointer"
  "VOID" "void"] @type)

;; Operators
(["AND" "and"
  "OR" "or"
  "XOR" "xor"
  "NOT" "not"
  "MOD" "mod"
  "DIV" "div"] @keyword.operator)

;; Assignment operator
(assignment_statement ":=" @operator)

;; Identifiers
(identifier) @identifier

(variable_declaration 
  (identifier) @variable.declaration)

(variable_access 
  (variable_base 
    (identifier) @variable))

(function_call
  (identifier) @function)

;; Literals
(boolean_literal) @constant.builtin.boolean
(number) @constant.numeric
(string_literal) @string
(time_literal) @constant.numeric
(date_literal) @constant.numeric
(date_time_literal) @constant.numeric

;; Punctuation
["," ":" ";" "(" ")" "[" "]" "{" "}" ] @punctuation.delimiter
[".."] @punctuation.special

;; Comments
(comment) @comment
(line_comment) @comment
(block_comment) @comment
