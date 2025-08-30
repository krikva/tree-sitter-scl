; Indentation for SCL

[
  (function_block)
  (function)
  (data_block)
  (organization_block)
  (var_section)
  (var_input_section)
  (var_output_section)
  (var_in_out_section)
  (var_temp_section)
  (var_constant_section)
  (const_section)
  (type_section)
  (struct_declaration)
  (if_statement)
  (case_statement)
  (for_statement)
  (while_statement)
  (repeat_statement)
  (region)
] @indent

[
  "END_FUNCTION"
  "END_FUNCTION_BLOCK"
  "END_DATA_BLOCK"
  "END_ORGANIZATION_BLOCK"
  "END_VAR"
  "END_CONST"
  "END_TYPE"
  "END_STRUCT"
  "END_IF"
  "END_CASE"
  "END_FOR"
  "END_WHILE"
  "END_REPEAT"
  "END_REGION"
  "ELSE"
  "ELSIF"
] @outdent

(comment) @ignore
