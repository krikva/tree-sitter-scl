// SCL Grammar for Tree-sitter
// Based on Siemens SCL language

module.exports = grammar({
  name: 'scl',

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

  // Case insensitive
  word: $ => $.identifier,

  // Add conflicts clause to resolve the case_element ambiguity
  conflicts: $ => [
    [$.case_element]
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
    function_block: $ => seq(
      caseInsensitive('FUNCTION_BLOCK'),
      optional($.string),
      $.identifier,
      repeat($.variable_declaration_section),
      optional(seq(
        $.statement_list,
      )),
      caseInsensitive('END_FUNCTION_BLOCK')
    ),

    // Function definition
    function: $ => seq(
      caseInsensitive('FUNCTION'),
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
      caseInsensitive('END_FUNCTION')
    ),

    // Data block definition
    data_block: $ => seq(
      caseInsensitive('DATA_BLOCK'),
      optional($.string),
      $.identifier,
      repeat($.variable_declaration_section),
      optional(seq(
        $.statement_list,
      )),
      caseInsensitive('END_DATA_BLOCK')
    ),

    // Organization block (specific to Siemens PLC)
    organization_block: $ => seq(
      caseInsensitive('ORGANIZATION_BLOCK'),
      optional($.string),
      $.identifier,
      repeat($.variable_declaration_section),
      optional(seq(
        $.statement_list,
      )),
      caseInsensitive('END_ORGANIZATION_BLOCK')
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
      caseInsensitive('VAR'),
      repeat($.variable_declaration),
      caseInsensitive('END_VAR')
    ),

    var_input_section: $ => seq(
      caseInsensitive('VAR_INPUT'),
      repeat($.variable_declaration),
      caseInsensitive('END_VAR')
    ),

    var_output_section: $ => seq(
      caseInsensitive('VAR_OUTPUT'),
      repeat($.variable_declaration),
      caseInsensitive('END_VAR')
    ),

    var_in_out_section: $ => seq(
      caseInsensitive('VAR_IN_OUT'),
      repeat($.variable_declaration),
      caseInsensitive('END_VAR')
    ),

    var_temp_section: $ => seq(
      caseInsensitive('VAR_TEMP'),
      repeat($.variable_declaration),
      caseInsensitive('END_VAR')
    ),

    var_constant_section: $ => seq(
      caseInsensitive('VAR_CONSTANT'),
      repeat($.variable_declaration),
      caseInsensitive('END_VAR')
    ),

    const_section: $ => seq(
      caseInsensitive('CONST'),
      repeat($.variable_declaration),
      caseInsensitive('END_CONST')
    ),

    type_section: $ => seq(
      caseInsensitive('TYPE'),
      repeat(choice(
        $.type_declaration,
        $.struct_declaration
      )),
      caseInsensitive('END_TYPE')
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
      caseInsensitive('AT'),
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
      caseInsensitive('STRUCT'),
      repeat($.variable_declaration),
      caseInsensitive('END_STRUCT')
    ),

    // Array declaration
    array_declaration: $ => seq(
      caseInsensitive('ARRAY'),
      '[',
      $.range,
      repeat(seq(',', $.range)),
      ']',
      caseInsensitive('OF'),
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
      caseInsensitive('BOOL'),
      caseInsensitive('BYTE'),
      caseInsensitive('WORD'),
      caseInsensitive('DWORD'),
      caseInsensitive('CHAR'),
      caseInsensitive('SINT'),
      caseInsensitive('INT'),
      caseInsensitive('DINT'),
      caseInsensitive('LINT'),
      caseInsensitive('USINT'),
      caseInsensitive('UINT'),
      caseInsensitive('UDINT'),
      caseInsensitive('ULINT'),
      caseInsensitive('REAL'),
      caseInsensitive('LREAL'),
      caseInsensitive('TIME'),
      caseInsensitive('DATE'),
      caseInsensitive('TIME_OF_DAY'),
      caseInsensitive('TOD'),
      caseInsensitive('DATE_AND_TIME'),
      caseInsensitive('DT'),
      caseInsensitive('DTL'),
      caseInsensitive('STRING'),
      caseInsensitive('WSTRING'),
      caseInsensitive('ANY'),
      caseInsensitive('POINTER'),
      caseInsensitive('VOID'),
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
      caseInsensitive('IF'),
      $.expression,
      caseInsensitive('THEN'),
      optional($.statement_list),
      repeat($.elsif_clause),
      optional($.else_clause),
      caseInsensitive('END_IF'),
      ';'
    ),

    elsif_clause: $ => seq(
      caseInsensitive('ELSIF'),
      $.expression,
      caseInsensitive('THEN'),
      optional($.statement_list)
    ),

    else_clause: $ => seq(
      caseInsensitive('ELSE'),
      optional($.statement_list)
    ),

    // Case statement
    case_statement: $ => seq(
      caseInsensitive('CASE'),
      $.expression,
      caseInsensitive('OF'),
      repeat1($.case_element),
      optional($.else_case),
      caseInsensitive('END_CASE'),
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
      caseInsensitive('ELSE'),
      optional($.statement_list)
    ),

    // For statement
    for_statement: $ => seq(
      caseInsensitive('FOR'),
      $.identifier,
      ':=',
      $.expression,
      caseInsensitive('TO'),
      $.expression,
      optional(seq(
        caseInsensitive('BY'),
        $.expression
      )),
      caseInsensitive('DO'),
      optional($.statement_list),
      caseInsensitive('END_FOR'),
      ';'
    ),

    // While statement
    while_statement: $ => seq(
      caseInsensitive('WHILE'),
      $.expression,
      caseInsensitive('DO'),
      optional($.statement_list),
      caseInsensitive('END_WHILE'),
      ';'
    ),

    // Repeat statement
    repeat_statement: $ => seq(
      caseInsensitive('REPEAT'),
      optional($.statement_list),
      caseInsensitive('UNTIL'),
      $.expression,
      caseInsensitive('END_REPEAT'),
      ';'
    ),

    // Return statement
    return_statement: $ => seq(
      caseInsensitive('RETURN'),
      ';'
    ),

    // Region
    region: $ => seq(
      caseInsensitive('REGION'),
      optional($.string_literal),
      optional($.statement_list),
      caseInsensitive('END_REGION')
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
      prec.left(3, seq($.expression, caseInsensitive('MOD'), $.expression)),
      prec.left(3, seq($.expression, caseInsensitive('DIV'), $.expression)),
      prec.left(1, seq($.expression, caseInsensitive('OR'), $.expression)),
      prec.left(1, seq($.expression, caseInsensitive('XOR'), $.expression)),
      prec.left(1, seq($.expression, caseInsensitive('AND'), $.expression)),
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
      prec(4, seq(caseInsensitive('NOT'), $.expression))
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
      caseInsensitive('TRUE'),
      caseInsensitive('FALSE')
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

function caseInsensitive(keyword) {
  return new RegExp(keyword.split('').map(
    letter => `[${letter.toLowerCase()}${letter.toUpperCase()}]`
  ).join(''));
}
