#include "tree_sitter/alloc.h"
#include "tree_sitter/parser.h"
#include <string.h>
#include <assert.h>

// Minimal stub scanner for SCL

typedef struct {
  uint8_t dummy;
} Scanner;

void *tree_sitter_scl_external_scanner_create() {
  Scanner *scanner = (Scanner *)ts_calloc(1, sizeof(Scanner));
  return scanner;
}

void tree_sitter_scl_external_scanner_destroy(void *payload) {
  Scanner *scanner = (Scanner *)payload;
  ts_free(scanner);
}

unsigned tree_sitter_scl_external_scanner_serialize(void *payload, char *buffer) {
  // No state to serialize
  return 0;
}

void tree_sitter_scl_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  // No state to deserialize
}

bool tree_sitter_scl_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  // No external tokens handled
  return false;
}
