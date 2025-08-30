;; Locals / scope definitions for SCL

;; Variable declarations introduce local bindings
(variable_declaration (identifier) @local.definition)

;; Parameters (in VAR_INPUT / VAR_IN_OUT / VAR_OUTPUT sections)
(var_input_section (variable_declaration (identifier) @local.parameter))
(var_in_out_section (variable_declaration (identifier) @local.parameter))
(var_output_section (variable_declaration (identifier) @local.parameter))

;; References
(variable_access (variable_base (identifier) @local.reference))
(function_call (identifier) @local.reference)
