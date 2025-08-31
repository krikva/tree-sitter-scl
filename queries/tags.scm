;; Functions
(function
  (string (identifier) @name)) @definition.function

(function
  (identifier) @name) @definition.function

;; Function blocks
(function_block
  (string (identifier) @name)) @definition.function

(function_block
  (identifier) @name) @definition.function

;; Data blocks
(data_block
  (string (identifier) @name)) @definition.module

;; Organization blocks
(organization_block
  (string (identifier) @name)) @definition.module

;; Variables
(variable_declaration
  (identifier) @name) @definition.variable

;; Types
(type_declaration
  (identifier) @name) @definition.type

;; Struct types
(struct_declaration) @definition.type

;; Array type
(array_declaration) @definition.type

;; String type declarations
(string_declaration) @definition.type

;; Function calls
(function_call
  (identifier) @name) @reference.call

;; Variable reference
(variable_access
  (variable_base
    (identifier) @name)) @reference.variable

;; Region definitions (for code folding)
(region) @definition.region
