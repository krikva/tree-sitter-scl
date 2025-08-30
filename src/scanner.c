#include <tree_sitter/parser.h>
#include <ctype.h>
#include <string.h>
#include <wctype.h>

enum TokenType {
  CASE_INSENSITIVE_KEYWORD,
};

static inline bool is_alpha(int32_t c) {
  return iswalpha(c) || c == '_';
}

static inline bool is_alphanumeric(int32_t c) {
  return iswalnum(c) || c == '_';
}

// Properly implemented case insensitive match
static bool case_insensitive_match(const char *pattern, TSLexer *lexer) {
  for (unsigned i = 0; pattern[i]; i++) {
    if (towlower(lexer->lookahead) != towlower(pattern[i])) {
      return false;
    }
    lexer->advance(lexer, false);
  }
  return true;
}

static bool scan_case_insensitive_keyword(TSLexer *lexer) {
  while (iswspace(lexer->lookahead)) {
    lexer->advance(lexer, true);
  }
  
  lexer->result_symbol = CASE_INSENSITIVE_KEYWORD;
  
  if (is_alpha(lexer->lookahead)) {
    lexer->advance(lexer, false);
    while (is_alphanumeric(lexer->lookahead)) {
      lexer->advance(lexer, false);
    }
    return true;
  }
  
  return false;
}

bool tree_sitter_scl_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  // Skip whitespace
  while (isspace(lexer->lookahead)) {
    lexer->advance(lexer, true);
  }
  
  // Not implementing external tokens yet
  return false;
}

void *tree_sitter_scl_external_scanner_create() {
  return NULL;
}

void tree_sitter_scl_external_scanner_destroy(void *payload) {
  // No-op
}

unsigned tree_sitter_scl_external_scanner_serialize(void *payload, char *buffer) {
  return 0;
}

void tree_sitter_scl_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  // No-op
}
