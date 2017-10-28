# Regexgen

Generate random strings using a pattern system based on regex.

Credits go to:
- **Paul Wolf** for help with this project, and provision of the original Python implementation (https://github.com/paul-wolf/strgen).

## Tests

[![Build Status](https://travis-ci.org/arh23/regexgen.svg?branch=node-branch)](https://travis-ci.org/arh23/regexgen)

View the QUnitJS tests [here](https://arh23.github.io/regexgen/tests/tests.html).

## Documentation

This documentation will guide you through the different operators and functionality of the pattern system.

### Usage

Regexgen can be used as an external script, or with the UI packaged with this repo.

When using Regexgen in existing code, a new object instance will need to be created, and a pattern assigned to the class variable (optionally, parameter variables can also be set. Then, the createString() method will be called. See below:

~~~~
var examplePattern = "[a-z]{10}"
var stringGenerator = new Regexgen();

stringGenerator.pattern = examplePattern; // required parameter
stringGenerator.allow_duplicate_characters = true; // optional parameters
stringGenerator.allow_logging = false;
stringGenerator.reporting_type = "less";
stringGenerator.error_output_id = "error";

var generated_string = stringGenerator.createString();
~~~~

This will create a random string based on the pattern provided. 

There are multiple parameters/variables which affect the way in which Regexgen handles string generation:

- *pattern* - required - the regex-styled pattern string required to generate the random string.

- *allow_duplicate_characters* - optional - boolean to specify whether or not Regexgen should use the same character twice in a range/set of characters. *True* by default.

- *allow_logging* - optional - boolean to specify whether every significant action during the generation process should be logged or not. *False* by default. Has the potential to cause performance issues. The log is accessible via the browser console, or can be accessed directly from the Regexgen object. For example, using the example object defined above, you will be able to access the logs using: *stringGenerator.generator_log*.

- *reporting_type* -  optional - string to specify the level of detail the messages posted before and after string generation. To show the pattern at the start, and the final string generated at the end of generation, use "full". To show a message stating when generation has started and finished, use "less". To show nothing, use "none". Any invalid values assigned to this parameter will be set to the "none" state. If *allow_logging* has been set to *true*, this will be set to full. Set to *full* by default.

- *error_output_id* - optional - string to reference the ID of the element where warning and error messages should be printed on a UI. Uses element ID *warning* by default.


See below for more information regarding patterns and other features:

### Pattern format

#### Specific ranges

Use a hyphen to define a range of different values of your choosing, or use text outside to denote fixed text. For example:

*[1-9]*

This would return values such as '4' or something similar. The range *[1-9]* will generate a value equal to or between 1 and 9.

This range can be used to match any types of value, including letter, numbers and symbols. 

Providing the '-' symbol has been used between two valid characters, any character that is between the specified characters (including the specified) will be returned.

#### Pre-defined ranges

The following will pick a character from a predefined set of characters:

- \w - word characters</li>
- \p - punctuation characters</li>
- \d - digits</li>
- \c - lower case characters</li>
- \u - upper case characters</li>
- \l - letters</li>
- \h - hex digits</li>
- \H - hex digits (lower and upper case)</li>
- \p - octal digits</li><br>

For example:

*[\w]*

This will return any letter (upper and lower case), digit character, or underscore. You can use multiple pre-defined ranges at once, to increase the probability of a character being returned.

#### Fixed text

Fixed text can be used outside of the character class definition. For example:

*test [1-9] message*

This would return values such as 'test 4 message' or something similar. The fixed text will remain constant and *[1-9]* will generate a value equal to or between 1 and 9.

#### Fixed text ranges

Fixed text can be used within a character class definition, to generate a random value from a specified set of characters. For example:

*[awh]*

This would return values 'a', 'w' or 'h' for each character of the random string.

#### Quantifiers

Use { and } with a whole number to specify how many characters will be generated for a specific range, for example:

*[1-9]{3}[a-z]{10}*

This would generate 3 values between 1 and 9, and 10 characters between a and z.

You can also use a range of quantifiers, for example:

*[a-z]{4:8} or [a-z]{4-8}*

This will generate a string containing characters a to z with a length of between 4 and 8 characters (inclusive). A colon or dash can be used as shown above. 

#### Sequences

Sequences, denoted by ( and ) allow the specification of whole word values to be used in the generator.

The operators for sequences are different:

- The | operator - this will pick one value in a list of values.
  For example: *(value1|value2|value3)* can result in either *value1*, *value2* or *value3*.

- The & operator - this will merge and shuffle multiple values.
  For example: *(value1&value2&value3)* can result in values such as *3llevveuaa2v1luuae* etc.

Sequences do not use quantifiers to generate values.