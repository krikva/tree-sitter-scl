/**
 * @file tree sitter parser for siemens scl
 * @author krikva
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "scl",

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

  // Case insensitive
  word: $ => $.identifier,



  rules: {
    source_file: $ => repeat(choice(
      $.program_organization_unit,
      $.variable_declaration_section,
      $.statement
    )),

    program_organization_unit: $ => choice(
      $.function_block,
      $.function,
      $.data_block,
      $.organization_block
    ),

    // Function block definition
    function_block: $ => seq(
      'FUNCTION_BLOCK',
      optional($.string),
      $.identifier,
      repeat($.variable_declaration_section),
      optional(seq(
        $.statement_list,
      )),
      'END_FUNCTION_BLOCK'
    ),

    // Function definition
    function: $ => seq(
      'FUNCTION',
      optional($.string),
      $.identifier,
      optional(seq(
        ':',
        $.data_type
      )),
      repeat($.variable_declaration_section),
      optional(seq(
        $.statement_list,
      )),
      'END_FUNCTION'
    ),

    // Data block definition
    data_block: $ => seq(
      'DATA_BLOCK',
      optional($.string),
      $.identifier,
      repeat($.variable_declaration_section),
      optional(seq(
        $.statement_list,
      )),
      'END_DATA_BLOCK'
    ),

    // Organization block (specific to Siemens PLC)
    organization_block: $ => seq(
      'ORGANIZATION_BLOCK',
      optional($.string),
      $.identifier,
      repeat($.variable_declaration_section),
      optional(seq(
        $.statement_list,
      )),
      'END_ORGANIZATION_BLOCK'
    ),

    // Variable declaration sections
    variable_declaration_section: $ => choice(
      $.var_section,
      $.var_input_section,
      $.var_output_section,
      $.var_in_out_section,
      $.var_temp_section,
      $.var_constant_section,
      $.const_section,
      $.type_section
    ),

    var_section: $ => seq(
      'VAR',
      repeat($.variable_declaration),
      'END_VAR'
    ),

    var_input_section: $ => seq(
      'VAR_INPUT',
      repeat($.variable_declaration),
      'END_VAR'
    ),

    var_output_section: $ => seq(
      'VAR_OUTPUT',
      repeat($.variable_declaration),
      'END_VAR'
    ),

    var_in_out_section: $ => seq(
      'VAR_IN_OUT',
      repeat($.variable_declaration),
      'END_VAR'
    ),

    var_temp_section: $ => seq(
      'VAR_TEMP',
      repeat($.variable_declaration),
      'END_VAR'
    ),

    var_constant_section: $ => seq(
      'VAR_CONSTANT',
      repeat($.variable_declaration),
      'END_VAR'
    ),

    const_section: $ => seq(
      'CONST',
      repeat($.variable_declaration),
      'END_CONST'
    ),

    type_section: $ => seq(
      'TYPE',
      repeat(choice(
        $.type_declaration,
        $.struct_declaration
      )),
      'END_TYPE'
    ),

    // Variable declaration
    variable_declaration: $ => seq(
      $.identifier,
      optional($.at_directive),
      ':',
      choice(
        $.data_type,
        $.array_declaration,
        $.struct_declaration
      ),
      optional(seq(
        ':=',
        $.expression
      )),
      ';'
    ),

    at_directive: $ => seq(
      'AT',
      $.memory_address
    ),

    memory_address: $ => /\w+/,

    // Type declaration
    type_declaration: $ => seq(
      $.identifier,
      ':',
      choice(
        $.data_type,
        $.array_declaration,
        $.struct_declaration
      ),
      ';'
    ),

    // Struct definition
    struct_declaration: $ => seq(
      'STRUCT',
      repeat($.variable_declaration),
      'END_STRUCT'
    ),

    // Array declaration
    array_declaration: $ => seq(
      'ARRAY',
      '[',
      $.range,
      repeat(seq(',', $.range)),
      ']',
      'OF',
      $.data_type
    ),

    range: $ => seq(
      $.expression,
      '..',
      $.expression
    ),

    // Data types
    data_type: $ => choice(
      // Primitive types
      'BOOL',
      'BYTE',
      'WORD',
      'DWORD',
      'CHAR',
      'SINT',
      'INT',
      'DINT',
      'LINT',
      'USINT',
      'UINT',
      'UDINT',
      'ULINT',
      'REAL',
      'LREAL',
      'TIME',
      'DATE',
      'TIME_OF_DAY',
      'TOD',
      'DATE_AND_TIME',
      'DT',
      'DTL',
      'STRING',
      'WSTRING',
      'ANY',
      'POINTER',
      'VOID',
      // User defined types
      $.identifier
    ),

    // Statement list
    statement_list: $ => repeat1($.statement),

    statement: $ => choice(
      $.assignment_statement,
      $.if_statement,
      $.case_statement,
      $.for_statement,
      $.while_statement,
      $.repeat_statement,
      $.function_call_statement,
      $.return_statement,
      $.region,
      ';'
    ),

    // Assignment statement
    assignment_statement: $ => seq(
      $.variable_access,
      ':=',
      $.expression,
      ';'
    ),

    // If statement
    if_statement: $ => seq(
      'IF',
      $.expression,
      'THEN',
      optional($.statement_list),
      repeat($.elsif_clause),
      optional($.else_clause),
      'END_IF',
      ';'
    ),

    elsif_clause: $ => seq(
      'ELSIF',
      $.expression,
      'THEN',
      optional($.statement_list)
    ),

    else_clause: $ => seq(
      'ELSE',
      optional($.statement_list)
    ),

    // Case statement
    case_statement: $ => seq(
      'CASE',
      $.expression,
      'OF',
      repeat1($.case_element),
      optional($.else_case),
      'END_CASE',
      ';'
    ),

    // Apply right associativity to ensure case elements consume all statements
    // until the next case label or END_CASE
    case_element: $ => prec.right(seq(
      choice(
        $.case_value,
        $.case_range
      ),
      ':',
      repeat1($.statement)
    )),

    case_value: $ => $.expression,

    case_range: $ => seq(
      $.expression,
      '..',
      $.expression
    ),

    else_case: $ => seq(
      'ELSE',
      optional($.statement_list)
    ),

    // For statement
    for_statement: $ => seq(
      'FOR',
      $.identifier,
      ':=',
      $.expression,
      'TO',
      $.expression,
      optional(seq(
        'BY',
        $.expression
      )),
      'DO',
      optional($.statement_list),
      'END_FOR',
      ';'
    ),

    // While statement
    while_statement: $ => seq(
      'WHILE',
      $.expression,
      'DO',
      optional($.statement_list),
      'END_WHILE',
      ';'
    ),

    // Repeat statement
    repeat_statement: $ => seq(
      'REPEAT',
      optional($.statement_list),
      'UNTIL',
      $.expression,
      'END_REPEAT',
      ';'
    ),

    // Return statement
    return_statement: $ => seq(
      'RETURN',
      ';'
    ),

    // Region
    region: $ => seq(
      'REGION',
      optional($.string_literal),
      optional($.statement_list),
      'END_REGION'
    ),

    // Function call as a statement
    function_call_statement: $ => seq(
      $.function_call,
      ';'
    ),

    // Function call
    function_call: $ => seq(
      $.identifier,
      '(',
      optional(seq(
        $.function_argument,
        repeat(seq(',', $.function_argument))
      )),
      ')'
    ),

    function_argument: $ => choice(
      seq(optional(seq($.identifier, ':=')), $.expression),
      seq($.identifier, '=>', $.variable_access)
    ),

    // Variable access
    variable_access: $ => seq(
      $.variable_base,
      repeat($.variable_selector)
    ),

    // Removed $.function_call here to avoid ambiguity with expression containing function_call
    variable_base: $ => $.identifier,

    variable_selector: $ => choice(
      seq('.', $.identifier),
      seq('[', $.expression, ']'),
      seq('#', $.identifier)
    ),

    // Expressions
    expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.parenthesized_expression,
      $.variable_access,
      $.function_call,
      $.literal
    ),

    binary_expression: $ => choice(
      prec.left(2, seq($.expression, '+', $.expression)),
      prec.left(2, seq($.expression, '-', $.expression)),
      prec.left(3, seq($.expression, '*', $.expression)),
      prec.left(3, seq($.expression, '/', $.expression)),
      prec.left(3, seq($.expression, 'MOD', $.expression)),
      prec.left(3, seq($.expression, 'DIV', $.expression)),
      prec.left(1, seq($.expression, 'OR', $.expression)),
      prec.left(1, seq($.expression, 'XOR', $.expression)),
      prec.left(1, seq($.expression, 'AND', $.expression)),
      prec.left(1, seq($.expression, '>', $.expression)),
      prec.left(1, seq($.expression, '>=', $.expression)),
      prec.left(1, seq($.expression, '<', $.expression)),
      prec.left(1, seq($.expression, '<=', $.expression)),
      prec.left(1, seq($.expression, '=', $.expression)),
      prec.left(1, seq($.expression, '<>', $.expression))
    ),

    unary_expression: $ => choice(
      prec(4, seq('-', $.expression)),
      prec(4, seq('+', $.expression)),
      prec(4, seq('NOT', $.expression))
    ),

    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    // Literals
    literal: $ => choice(
      $.number,
      $.string_literal,
      $.boolean_literal,
      $.time_literal,
      $.date_literal,
      $.date_time_literal,
      $.byte_string_literal
    ),

    number: $ => choice(
      // Integer literals
      /[0-9]+/,
      // Hex literals
      /16#[0-9A-Fa-f][0-9A-Fa-f_]*/,
      // Binary literals
      /2#[01][01_]*/,
      // Floating point literals
      /[0-9]+\.[0-9]+(E[+-]?[0-9]+)?/
    ),

    boolean_literal: $ => choice(
      'TRUE',
      'FALSE'
    ),

    time_literal: $ => /[tT]#(([0-9]+d)?([0-9]+h)?([0-9]+m)?([0-9]+s)?([0-9]+ms)?)/,

    date_literal: $ => /[dD]#[0-9]{4}-[0-9]{2}-[0-9]{2}/,

    date_time_literal: $ => /DT#[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?/,

    byte_string_literal: $ => /BYTE#[0-9A-Fa-f][0-9A-Fa-f_]*/,

    string_literal: $ => seq(
      "'",
      repeat(choice(
        token.immediate(/[^'\\]/),
        $.escape_sequence
      )),
      "'"
    ),

    escape_sequence: $ => token.immediate(
      seq('\\', /['"\\nrt]/)
    ),

    // Comments
    comment: $ => choice(
      $.line_comment,
      $.block_comment
    ),

    line_comment: $ => token(seq('//', /.*/)),

    block_comment: $ => token(seq(
      '(*',
      /[^*]*\*+([^)*][^*]*\*+)*/,
      ')'
    )),

    // Identifier
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    string: $ => seq(
      '"',
      $.identifier,
      '"'
    )
  }
});