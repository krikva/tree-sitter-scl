;; Folding for SCL

;; Block-level folding
(function_block) @fold
(function) @fold
(data_block) @fold
(organization_block) @fold

;; Variable declaration sections
(var_section) @fold
(var_input_section) @fold
(var_output_section) @fold
(var_in_out_section) @fold
(var_temp_section) @fold
(var_constant_section) @fold
(const_section) @fold
(type_section) @fold

;; Struct definition
(struct_declaration) @fold

;; Control statements
(if_statement) @fold
(case_statement) @fold
(for_statement) @fold
(while_statement) @fold
(repeat_statement) @fold
(region) @fold
