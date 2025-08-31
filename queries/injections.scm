;; Comment injections
((comment) @injection.content
 (#set! injection.language "comment"))

((block_comment) @injection.content
 (#set! injection.language "comment"))

;; String literal injections - useful for embedded SQL or other languages
((string_literal) @injection.content
 (#match? @injection.content "^'\\s*SELECT\\s+")
 (#set! injection.language "sql"))
