# strgen-js

Generate random strings using a pattern system based on regular expressions.

Developed alongside the UI project, [strgen-ui](https://github.com/arh23/strgen-ui).

Credits go to:
- **Paul Wolf** for help with this project, and provision of the [original Python implementation](https://github.com/paul-wolf/strgen).

## Tests

[![Build Status](https://travis-ci.org/arh23/strgen-js.svg?branch=node-branch)](https://travis-ci.org/arh23/strgen-js)

View the QUnitJS tests [here](https://arh23.github.io/strgen-js/tests/tests.html).

## Documentation

This documentation will guide you through the different operators and functionality of the pattern system.

### Usage

Strgen can be used as an external script, or with the UI packaged with this repo.

When using Strgen in existing code, a new object instance will need to be created, and a pattern assigned to the class variable (optionally, parameter variables can also be set). Then, the createString() method will be called. See below:

~~~~
var example_pattern = "[a-z]{10}";
var stringGenerator = new Strgen();

// required parameter
stringGenerator.pattern = example_pattern; 

// optional parameters
stringGenerator.allow_duplicate_characters = false; 
stringGenerator.allow_multiple_instances = true;
stringGenerator.ignore_duplicate_case = false;
stringGenerator.allow_logging = false;
stringGenerator.reporting_type = "less";
stringGenerator.print_to_console = false;
stringGenerator.error_output_id = "error";
stringGenerator.store_errors = true;
stringGenerator.symbol_quantifier_max = 25;

var generated_string = stringGenerator.createString();
~~~~

This will create a random string based on the pattern provided. 

There are multiple parameters/variables which affect the way in which Strgen handles string generation:

- *pattern* - required - the regex-styled pattern string required to generate the random string.

- *allow_duplicate_characters* - optional - boolean to specify if Strgen should use the same character twice (or more) in a range/set of characters. *True* by default.

- *allow_multiple_instances* - optional - boolean to specify if Strgen should generate a string with multiple instances of a character, IF the character has been specified multiple times in the pattern. For example, if character "A" has been selected, all instances of "A" will be removed from the values list, if this parameter has been set to *false*. *True* by default. Requires *allow_duplicate_characters* to be false.

- *ignore_duplicate_case* - optional - boolean to specify if Strgen should ignore case, when multiple instances are not allowed. For example, if character "A" has been selected, all instances of "A" and "a" will be removed from the values list, if this parameter has been set to *true*. *False* by default. Requires *allow_multiple_characters* to be false.

- *allow_logging* - optional - boolean to specify whether every significant action during the generation process should be logged or not. *False* by default. Has the potential to cause performance issues. The log is accessible via the browser console, or can be accessed directly from the Strgen object. For example, using the example object defined above, you will be able to access the logs using: *stringGenerator.generator_log*.

- *reporting_type* - optional - string to specify the level of detail the messages posted before and after string generation. To show the pattern at the start, and the final string generated at the end of generation, use "full". To show a message stating when generation has started and finished, use "less". To show nothing, use "none". Any invalid values assigned to this parameter will be set to the "none" state. If *allow_logging* has been set to *true*, this will be set to full. Set to *full* by default.

- *print_to_console* - optional - boolean to specify if the log and other output should be printed to the console after generation. Setting this to *false* will prevent printing to the console (except for situations where an error has occurred, or if no valid warning element has been specified for *error_output_id* AND *store_errors* is *false*). *True* by default.

- *error_output_id* - optional - string to reference the ID of the element where warning and error messages should be printed on a UI. Uses element ID *warning* by default.

- *store_errors* - optional - boolean to specify whether all errors and warnings should be stored in a list of objects or not. Each object in the list will contain two properties, *msg* and *state*. *msg* is the string to describe what the error/warning is, *state* is either "error" or "warning". *False* by default.

- *symbol_quantifier_max* - optional - number to specify the maximum value a symbol quantifier can generate. *10* by default.

- *preset* - optional - list of objects containing the presets used with pre-defined ranges. See the pre-defined ranges section for default values, object structure and changing the preset values of a preset.

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
- \p - octal digits</li>
- \s - white space

For example:

*[\w]*

This will return any letter (upper and lower case), digit character, or underscore. You can use multiple pre-defined ranges at once, to increase the probability of a character being returned.

The predefined set of characters for each of the presets above can be modified via the *preset* list of objects. For example:

~~~~
    {preset_code:"c", value:"abcdefghijklmnopqrstuvwxyz"}
~~~~

To modify one of the presets (in this example, we are modifying *\c*):

~~~~
    stringGenerator.preset[3].value = "abcd";
~~~~

The indexes and corresponding *preset_code* values are as follows:

| preset_code | List index |
|-------------|------------|
| w           | 0          |
| p           | 1          |
| d           | 2          |
| c           | 3          |
| u           | 4          |
| l           | 5          |
| h           | 6          |
| H           | 7          |
| p           | 8          |
| s           | 9          |

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

*[a-z]{4:8} or [a-z]{4-8} or [a-z]{4,8}*

This will generate a string containing characters a to z with a length of between 4 and 8 characters (inclusive). A colon, dash or comma can be used as shown above.

##### Symbol quantifiers

The typical symbol regular expression quantifiers (?, \* and +) can be used to generate strings. For example:

*a+* will generate a string made up of between 1 and 10 'a' characters.

*abc\** can generate strings such as *abccc* or *ab*, etc.

*[abc]\** can generate *babcbcccbb* or *ccba*, etc.

The other symbol quantifiers act in the same way as their regular expression counterparts.

By default, the max number of characters that can be generated is 10, when using \* and +. This can be changed by assigning the desired value to *symbol_quantifier_max*.

#### Sequences

Sequences, denoted by ( and ) allow the specification of whole word values to be used in the generator.

The operators for sequences are different:

- The | operator - this will pick one value in a list of values.
  For example: *(value1|value2|value3)* can result in either *value1*, *value2* or *value3*.

- The & operator - this will merge and shuffle multiple values.
  For example: *(value1&value2&value3)* can result in values such as *3llevveuaa2v1luuae* etc.

Sequences do not use quantifiers to generate values.

You can also use character ranges and quantifiers in sequences, for example:

*([a-zA-Z]+&[0-9]+|[A-Z]|[0-9]{4})* - this can result in either *6OIsv0x66434Lf0OJ33*, *Q* or *2215*.