#Regexgen

Generate random strings using a pattern system based on regex.

Implemented with JavaScript - my first project with the language. Please take heed of this, as there could be some logical or structuring issues/inefficiencies in the code.

Credits go to:
- **Paul Wolf** for help with this project, and provision of the original Python implementation (https://github.com/paul-wolf/strgen).

##Documentation

This documentation will guide you through the different operators and functionality of the pattern system.

###Specific ranges

Use a hyphen to define a range of different values of your choosing, or use text outside to denote fixed text. For example:

*[1-9]*

This would return values such as '4' or something similar. The range *[1-9]* will generate a value equal to or between 1 and 9.

This range can be used to match any types of value, including letter, numbers and symbols. 

Providing the '-' symbol has been used between two valid characters, any character that is between the specified characters (including the specified) will be returned.

###Pre-defined ranges

The following will pick a character from a predefined set of characters:

- /w - word characters</li>
- /p - punctuation characters</li>
- /d - digits</li>
- /c - lower case characters</li>
- /u - upper case characters</li>
- /l - letters</li>
- /h - hex digits</li>
- /H - hex digits (lower and upper case)</li>
- /p - octal digits</li><br>

For example:

*[/w]*

This will return any letter (upper and lower case), digit character, or underscore. You can use multiple pre-defined ranges at once, to increase the probability of a character being returned.

###Fixed text

Fixed text can be used outside of the character class definition. For example:

*test [1-9] message*

This would return values such as 'test 4 message' or something similar. The fixed text will remain constant and *[1-9]* will generate a value equal to or between 1 and 9.

###Fixed text ranges

Fixed text can be used within a character class definition, to generate a random value from a specified set of characters. For example:

*[awh]*

This would return values 'a', 'w' or 'h' for each character of the random string.

###Quantifiers

Use { and } with a whole number to specify how many characters will be generated for a specific range, for example:

*[1-9]{3}[a-z]{10}*

This would generate 3 values between 1 and 9, and 10 characters between a and z.

###Sequences

Sequences, denoted by ( and ) allow the specification of whole word values to be used in the generator.

The operators for sequences are different:

- The | operator - this will pick one value in a list of values.
  For example: *(value1|value2|value3)* can result in either *value1*, *value2* or *value3*.
- The & operator - this will merge and shuffle multiple values.
  For example: *(value1&value2&value3)* can result in values such as *3llevveuaa2v1luuae* etc.

Sequences do not use quantifiers to generate values.

###Additional controls and parameters

####Allow Duplicate Characters

This boolean parameter allows the same character to be used in the string. When set to false, the character is added to the resulting string, and then removed from the list used to store and select values valid for the current part of the template.

As a result of the character removal, if the quantifier is greater than the max number of characters the script can randomly select from, then the quantifier is reduced to equal the maximum, to avoid problems when generating strings when this parameter is set to false.
