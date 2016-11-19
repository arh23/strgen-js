##Regexgen Documentation


###Specific ranges

Use a hyphen to define a range of different values of your choosing, or use text outside to denote fixed text. For example:
[1-9]
This would return values such as '4' or something similar. The range <i> [1-9] </i> will generate a value equal to or between 1 and 9.
This range can be used to match any types of value, including letter, numbers and symbols. 
Providing the '-' symbol has been used between two valid characters, any character that is between the specified characters (including the specified) will be returned.

###Pre-defined ranges

The following will pick a character from a predefined set of characters:</p>

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

[/w]

This will return any letter (upper and lower case), digit character, or underscore. You can use multiple pre-defined ranges at once, to increase the probability of a character being returned.</p>

			<div class="accordion_icon"></div>
			<h4>Fixed text</h4> <br>

			<div class="content_body">
				<br><p>Fixed text can be used outside of the character class definition. For example:</p><br>

				<p><i>test [1-9] message</i></p><br>

				<p>This would return values such as '<i>test 4 message</i>' or something similar. The fixed text will remain constant and <i> [1-9] </i> will generate a value equal to or between 1 and 9.</p>
			</div>
		</div>

		<div class="content"> 
			<div class="accordion_icon"></div>
			<h4>Fixed text ranges</h4> <br> 

			<div class="content_body">
				<br><p>Fixed text can be used within a character class definition, to generate a random value from a specified set of characters. For example:</p><br>

				<p><i>[awh]</i></p><br>

				<p>This would return values 'a', 'w' or 'h' for each character of the random string.</p>
			</div>
		</div>

		<div class="content"> 
			<div class="accordion_icon"></div>
			<h4>Quantifiers</h4> <br>

			<div class="content_body">
				<br><p>Use { and } with a whole number to specify how many characters will be generated for a specific range, for example:</p><br>

				<p><i>[1-9]{3}[a-z]{10}</i></p><br>

				<p>This would generate 3 values between 1 and 9, and 10 characters between a and z.</p>
			</div>
		</div>

		<div class="content">
			<div class="accordion_icon"></div>
			<h4>Sequences</h4> <br>

			<div class="content_body">
				<br><p>Sequences, denoted by ( and ) allow the specification of whole word values to be used in the generator.</p> <br>

				<p>The operators for sequences are different:</p>
				<ul>
					<li> The | operator - this will pick one value in a list of values. <br>
					For example: <i>(value1|value2|value3)</i> can result in either <i>value1</i>, <i>value2</i> or <i>value3</i>.</li>
					<li> The & operator - this will merge and shuffle multiple values. <br>
					For example: <i>(value1&value2&value3)</i> can result in values such as <i>3llevveuaa2v1luuae</i> etc.</li>
				</ul><br>

				<p>Sequences do not use quantifiers to generate values.</p>
			</div>
		</div>

		<div class="content">
			<div class="accordion_icon"></div>
			<h4>Additional controls</h4> <br>

			<div class="content_body">
				<br><b>Allow Duplicate Characters</b> <br>

				<p>This allows the same character to be used in the string. When disabled, the character is added to the resulting string, and then removed from the list used to store and select values valid for the current part of the template. </p> <br>

				<p>As a result of the character removal, if the quantifier is greater than the max number of characters the script can randomly select from, then the quantifier is reduced to equal the maximum, to avoid problems when generating strings with this option disabled.</p>
			</div>
		</div>
	</section>

</body>

</html>