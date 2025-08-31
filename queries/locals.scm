;; Local scopes
(function) @local.scope
(function_block) @local.scope
(organization_block) @local.scope
(data_block) @local.scope
(for_statement) @local.scope
(while_statement) @local.scope
(repeat_statement) @local.scope
(if_statement) @local.scope
(case_statement) @local.scope

;; Variable definitions
(var_section) @local.scope
(var_input_section) @local.scope
(var_output_section) @local.scope
(var_in_out_section) @local.scope
(var_temp_section) @local.scope
(var_constant_section) @local.scope

;; Parameters
(function_argument
  (identifier) @local.definition) 

;; Variable declarations
(variable_declaration
  (identifier) @local.definition)

;; Variable declarations in statements
(variable_declaration_statement
  (identifier) @local.definition)

;; For loop variable
(for_statement
  (identifier) @local.definition)

;; Variable reference
(variable_access
  (variable_base
    (identifier) @local.reference))
