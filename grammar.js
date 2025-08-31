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
    $.block_comment,
  ],

  // Case insensitive
  word: $ => $.identifier,

  conflicts: $ => [
    [$.statement_list, $.statement],
    [$.statement_list, $.statement, $.region],
    [$.function_block, $.statement_list, $.statement],
    [$.function_block, $.statement_list],
    [$.function, $.statement_list, $.statement],
    [$.function, $.statement_list],
    [$.string_declaration, $.data_type]
  ],

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
    function_block: $ => prec.right(seq(
      'FUNCTION_BLOCK',
      choice($.string, $.identifier),
      repeat(choice(
        $.configuration_block,
        $.version_declaration,
        $.comment,
        $.block_comment,
        $.variable_declaration_section
      )),
      optional('BEGIN'),
      optional($.statement_list),
      'END_FUNCTION_BLOCK',
      optional(';')
    )),

    // Function definition
    function: $ => prec.right(seq(
      'FUNCTION',
      choice($.string, $.identifier),
      optional(seq(':', $.data_type)),
      repeat(choice(
        $.configuration_block, 
        $.version_declaration,
        $.comment, 
        $.block_comment,
        $.variable_declaration_section
      )),
      optional('BEGIN'),
      optional($.statement_list),
      'END_FUNCTION',
      optional(';')
    )),

    // Data block definition
    data_block: $ => seq(
      'DATA_BLOCK',
      $.string,
      $.configuration_block,
      $.version_declaration,
      repeat(choice($.comment, $.variable_declaration_section)),
      'BEGIN',
      optional($.statement_list),
      'END_DATA_BLOCK'
    ),

    // Organization block (specific to Siemens PLC)
    organization_block: $ => seq(
      'ORGANIZATION_BLOCK',
      $.string,
      $.configuration_block,
      $.version_declaration,
      repeat(choice($.comment, $.variable_declaration_section)),
      'BEGIN',
      optional($.statement_list),
      'END_ORGANIZATION_BLOCK'
    ),

    // Configuration block
    configuration_block: $ => seq(
      '{',
      repeat(seq(
        $.identifier,
        ':=',
        choice($.string_literal, $.number, $.boolean_literal),
        optional(';')
      )),
      '}'
    ),

    // Version declaration
    version_declaration: $ => seq(
      'VERSION', ':', $.number
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
        $.struct_declaration,
        $.string_declaration
      ),
      optional(seq(
        ':=',
        $.expression
      )),
      ';',
      optional($.comment)
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
        $.struct_declaration,
        $.string_declaration
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

    // string declaration
    string_declaration: $ => seq(
      'STRING',
      optional(seq(
        '[',
        $.number,
        ']'
      ))
    ),

    // Range for array dimensions
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
    statement_list: $ => prec.right(repeat1(
      choice(
        $.statement,
        $.comment,
        $.block_comment
      )
    )),

    statement: $ => choice(
      $.assignment_statement,
      $.variable_declaration_statement, // Added variable declaration as a statement
      $.if_statement,
      $.case_statement,
      $.for_statement,
      $.while_statement,
      $.repeat_statement,
      $.function_call_statement,
      $.return_statement,
      $.region,
      $.comment, // Allow comments as statements
      ';'
    ),
    
    // Variable declaration as a statement
    variable_declaration_statement: $ => seq(
      $.identifier,
      ':',
      choice(
        $.data_type,
        $.array_declaration,
        $.struct_declaration,
        $.string_declaration
      ),
      optional(seq(
        ':=',
        $.expression
      )),
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
    if_statement: $ => prec.right(seq(
      'IF',
      $.expression,
      'THEN',
      optional($.statement_list),
      repeat($.elsif_clause),
      optional($.else_clause),
      'END_IF',
      optional(';')
    )),

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
    case_statement: $ => prec.right(seq(
      'CASE',
      $.expression,
      'OF',
      repeat1($.case_element),
      optional($.else_case),
      'END_CASE',
      optional(';')
    )),

    case_element: $ => prec.right(seq(
      choice(
        $.case_value,
        $.case_range
      ),
      ':',
      optional($.statement_list)
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
    for_statement: $ => prec.right(seq(
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
      optional(';')
    )),

    // While statement
    while_statement: $ => prec.right(seq(
      'WHILE',
      $.expression,
      'DO',
      optional($.statement_list),
      'END_WHILE',
      optional(';')
    )),

    // Repeat statement
    repeat_statement: $ => prec.right(seq(
      'REPEAT',
      optional($.statement_list),
      'UNTIL',
      $.expression,
      'END_REPEAT',
      optional(';')
    )),

    // Return statement
    return_statement: $ => seq(
      'RETURN',
      ';'
    ),

    // Region
    region: $ => prec.right(seq(
      'REGION',
      optional(choice(
        $.string_literal, 
        $.identifier,
        // Allow region names that are multiple words (as seen in the examples)
        /[a-zA-Z_][a-zA-Z0-9_ ]+/,
        $.comment
      )),
      optional($.statement_list),
      'END_REGION',
      optional(';')
    )),

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
    literal: $ => prec(1, choice(
      $.number,
      $.string_literal,
      $.boolean_literal,
      $.time_literal,
      $.date_literal,
      $.date_time_literal,
      $.byte_string_literal
    )),

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

    // Ensure time literals are properly tokenized and only appear inside literals
    time_literal: $ => prec(0, token(/[tT]#[0-9]+([mM][sS]|[dDhHmMsS])/)),

    date_literal: $ => token(/[dD]#[0-9]{4}-[0-9]{2}-[0-9]{2}/),

    date_time_literal: $ => token(/DT#[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?/),

    byte_string_literal: $ => token(/BYTE#[0-9A-Fa-f][0-9A-Fa-f_]*/),

    // Define string literals with support for escape sequences
    string_literal: $ => token(choice(
      // Single quoted strings with escape sequences
      /'(?:[^'\\]|\\.)*'/,
      // Double quoted strings with escape sequences
      /"(?:[^"\\]|\\.)*"/
    )),

    // Comments
    comment: $ => token(seq('//', /.*/)),
    block_comment: $ => token(seq('(*', /[\s\S]*?\*\)/)),

    // Identifier
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    string: $ => seq(
      '"',
      $.identifier,
      '"'
    )
  }
});
