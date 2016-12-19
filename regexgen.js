"use strict";

class Regexgen {
	constructor() {

		this.pattern_input; // the pattern
		this.current_index; // the current pointer/index in the pattern
		this.operators = "[]{}()-/|"; // special operator characters responsible for different behaviours
		this.quantifier_value; // stores the value specified in the pattern within the { }
		this.generated_value_list; // where output is stored, to be used in generation at the end of the generation process
		this.allow_duplicate_characters; // "Allow Duplicate Characters" setting on UI, can be set when generator is initialised
		this.generated_output; // the full output string
		this.error_output_id; // the default UI element where errors will be output (the reference to the element must be the ID)
	}

	createString(pattern, allow_duplicates = true, error_output_id = "warning") { // initial method that is called to start generating a random string
		this.current_index = -1
		this.generated_output = ""
		this.pattern_input = pattern;
		this.allow_duplicate_characters = allow_duplicates;
		this.quantifier_value = 1;
		this.generated_value_list = [];
		this.error_output_id = error_output_id;
		// assign default values before generation/
		// this fixes a problem with multiple generations with the same instance of the object

		this.operatorComparison();
		return this.outputString();
	};

	lookahead() { // return the next character in the string
		return this.pattern_input.charAt(this.current_index + 1);
	};

	next() { // increment the current_index value and return the character at that value in the string
		this.current_index += 1;
		return this.pattern_input.charAt(this.current_index);
	};

	current() { // return the character at the current_index position in the string
		return this.pattern_input.charAt(this.current_index);
	};

	last() { // return the character before the current_index position in the string
		return this.pattern_input.charAt(this.current_index - 1);
	};

	operatorComparison() { // main method which is used to determine whether the current character is an operator or not 
							// (the first character is usually an operator if trying to generate random strings)
		console.log("comparing")
		this.next();

		if (this.operators.includes(this.current()) == true) 
		{
			console.log("AFTER NEXT CALL: " + this.current_index);
			this.determineOperator(this.pattern_input.charAt(this.current_index));
		}
		else
		{
			console.log("current char: " + this.pattern_input.charAt(this.current_index));
			this.getLiteral();
			this.operatorComparison();
		}
	};

	determineOperator(operator) { // if an operator was found in operatorComparison, find out what operator it is and respond
		if (operator != "") {
			console.log("operator: " + operator);
			switch(operator) {
				case "[":
					this.getCharacterSet();
					this.operatorComparison();
					break;
				case "]":
					if (this.lookahead() != '{') {
						this.selectValueFromList(1, undefined, this.allow_duplicate_characters);	
					}
					this.operatorComparison();
					break;
				case "{":
					this.quantifier_value = this.getQuantifier();
					this.operatorComparison();
					break;
				case "}":
					this.selectValueFromList(this.quantifier_value, undefined, this.allow_duplicate_characters);
					this.quantifier_value = 1;
					this.operatorComparison();
					break;
				case '(':
					this.generateSequence();
					this.operatorComparison();
					break;
				case ')':
					console.log('end sequence')
					this.selectValueFromList(1, undefined, false);	
					this.operatorComparison();
					break;
				case '/':
					console.log('char break');
					this.next();
					this.getLiteral();
					this.operatorComparison();
					break;
				default:
					console.log("literal: " + operator);
					this.getLiteral();
					this.operatorComparison();
					break;
			}
		}
		else
		{
			console.log("reached end - value is '" + this.outputString() + "'.")
		}
	};

	getCharacterSet() { // if the operator was the start of a character class definition, begin reading the pattern, and react according to a set of comparisons
		do { // starts at the [ which was successfully read in the stage before this function
			var current_character = this.next();
			console.log("CHARACTER AT current_index: " + this.pattern_input.charAt(this.current_index));
			if (this.current() == '/') 
			{
				console.log('/ operator at current()')
				this.getPresetValues(this.next());
				this.generateRangeValue();
			} 
			else if (this.operators.includes(this.current()) == true && this.last() != '\\') // if the current character is an unbroken operator, throw error
			{
				//document.getElementById('warning').innerHTML += "<br />" + "Unexpected operator at position " + (this.current_index + 1) + ", operator '" + this.pattern_input.charAt(this.current_index) + "'.";
				throw new Error("Unexpected operator at position " + (this.current_index + 1) + ", operator '" + this.pattern_input.charAt(this.current_index) + "'.");
				break;
			}
			else if (this.lookahead() == '-' && current_character != '/') // if the next character is an unbroken '-' operator
			{
				console.log('unbroken operator \'-\' at lookahead()')
				var character_store;
				character_store = current_character; // take current character (left side of hyphen) and store it temp
				this.next(); // skip hyphen
				if (this.lookahead() == '\\') { // if character after hyphen is / break character
					this.next() // skip \
					current_character = this.next() // character after the /
				}
				else
				{
					current_character = this.next(); // assign the next character (right side of hyphen) and store it as the current character
				}
				console.log(character_store + " , " + current_character);
				this.generateRangeValue(character_store.charCodeAt(0), current_character.charCodeAt(0)); // generate_range_value(ascii value of left side , ascii value of right side)
			}
			else if (this.lookahead() != '-' && current_character != '\\') { // if the next character is not the "-" operator, and the current isn't a character break, then push current()
				this.generated_value_list.push(this.current());
			} 
		} while (this.lookahead() != ']')
	}

	getLiteral() { // output a literal character, skipping any generation
		this.buildGeneratedString(this.pattern_input.charAt(this.current_index));
	}

	getQuantifier() { // get the value within the curly brackets, if present
		var start_value = this.current_index + 1;
		var quantifier_value = "";
		console.log("getting quantifier");
		do {
			if (this.operators.includes(this.lookahead()) == false) 
			{
				quantifier_value+= this.next();
			}
			else if (this.lookahead() == "") {
				throw new Error("Quantifier not closed.");	
			}
			else
			{
				this.next();
				quantifier_value = 1;
				throw new Error("Unexpected character at position " + (this.current_index + 1) + ", character '" + this.pattern_input.charAt(this.current_index) + "'.");				
			}
		} while (this.lookahead() != '}')

		if (this.allow_duplicate_characters == false && quantifier_value > this.generated_value_list.length)
		{
			/*
			document.getElementById('warning').innerHTML += "<br />Character quantifier at position " + start_value + " reduced from " + 
															quantifier_value + " to " + this.generated_value_list.length + 
															". Toggle 'Allow Duplicate Characters' to generate the full amount.";
			*/
			this.outputWarning("<br />Character quantifier at position " + start_value + " reduced from " + 
						  quantifier_value + " to " + this.generated_value_list.length + 
						  ". Toggle 'Allow Duplicate Characters' to generate the full amount.")
			quantifier_value = this.generated_value_list.length;
		}

		console.log('quantifier_value: ' + quantifier_value);

		if (quantifier_value == 0) {
			this.outputWarning("<br /> No value was returned. <br />Character quantifier at position " + start_value + " is 0.")
			/*document.getElementById('warning').innerHTML += "<br /> No value was returned. <br />Character quantifier at position " + start_value + " is 0.";*/		
		}

		return parseInt(quantifier_value);
	}

	generateRangeValue(firstvalue, secondvalue, character_index = firstvalue) {	// generate all possible values in the user defined range (defined with '-' character)
		if (firstvalue > secondvalue) // swap values if the firstvalue is the largest value
		{
			var store = firstvalue;
			firstvalue = secondvalue;
			secondvalue = store;
			character_index = firstvalue;
			console.log("values swapped!");
		}

		if (character_index <= secondvalue && character_index >= firstvalue) { // if character_index is within the range specified
			//console.log(character_index)
			this.generated_value_list.push(String.fromCharCode(character_index));
			this.generateRangeValue(firstvalue, secondvalue, parseInt(character_index+=1));
		}
	}

	getPresetValues(character) { // determine what set of pre-defined values will be used when generating with the '\' symbol, then call generatePresetValues
		console.log("initialise preset");
		var preset_characters;
		switch(character) { // may be a good idea to look this hardcode over...
			case "w": //word characters
			{
				preset_characters = "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
				break;
			}
			case "p": //punctuation characters
			{
				preset_characters = "{}[](),./\\\'\":;?!*&@`~'";
				break;
			}
			case "d": //digits
			{
				preset_characters = "0123456789";
				break;
			}
			case "c": //lower case characters
			{
				preset_characters = "abcdefghijklmnopqrstuvwxyz";
				break;
			}
			case "u": //upper case characters
			{
				preset_characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
				break;
			}
			case "l": //letter characters
			{
				preset_characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
				break;
			}
			case "h": //hex digits (lower case only)
			{
				preset_characters = "0123456789abcdfabcdf";
				break;
			}
			case "H": //hex digits
			{
				preset_characters = "0123456789ABCDFabcdf";
				break;
			}
			case "o": //octal digits
			{
				preset_characters = "01234567";
				break;
			}
			default:
			{
				preset_characters = "";
				/*document.getElementById('warning').innerHTML += "<br />Invalid preset range. \'/" + character + "\' is not a valid preset.";*/
				this.outputWarning("<br />Invalid preset range. \'/" + character + "\' is not a valid preset.");
				break;
			}
		}
		this.generatePresetValues(preset_characters);
	}

	generatePresetValues(preset_values, character_index = 0) { // split the preset_characters string and push each individual character into the values array
		if (character_index < preset_values.length) {
			this.generated_value_list.push(preset_values.charAt(character_index));
			this.generatePresetValues(preset_values, character_index+=1);
		}
	}

	generateSequence() { // split each value in the sequence and push it to the generated_value_list array
		var string_value = "";
		var last_operator;
		console.log('generating sequence')

		while(this.current() != ')') {
			if (this.lookahead() == '|' || this.lookahead() == ')' || this.lookahead() == '&') 
			{
				console.log(string_value);
				if (this.lookahead() == '|' || last_operator == '|' && this.lookahead() == ')')
				{
					last_operator = '|';

					this.generated_value_list.push(string_value);
					string_value = "";

					if (this.lookahead() == ')') { break; } else { this.next(); }
				}
				else if (this.lookahead() == '&' || last_operator == '&' && this.lookahead() == ')')
				{
					last_operator = "&";

					// to do: split string and place characters in generated_value_list array individually

					var temp_string;

					if (temp_string == undefined) {
						temp_string = string_value;
						string_value = "";
					} else {
						temp_string += string_value;

						console.log("Temp String: " + temp_string);

						string_value = "";
					}

					if (this.lookahead() == ')') { 
						var output_string = "";
						var temp_string_length = temp_string.length;
						var temp_string_array = temp_string.split("");

						for (var index = 0; index < temp_string_length; index++) {
							var randvalue = Math.floor(Math.random() * temp_string_array.length);

							console.log("temp_string: " + temp_string);
							console.log("current output: " + output_string);
							console.log("selected char: " + temp_string_array[randvalue]);
							console.log("rand_value:" + randvalue);

							output_string += temp_string_array[randvalue];
							temp_string_array.splice(randvalue, 1);
						}

						this.generated_value_list.push(output_string);

						break; 
					} else { 
						this.next(); 
					}
				}
				else if (this.lookahead() == ')' && last_operator == undefined) {
					if (string_value == "") {
						/*document.getElementById('warning').innerHTML += "<br />Unbroken Sequence starting at position " + (this.current_index + 1) + " does not contain any values."*/
						this.outputWarning("<br />Unbroken Sequence starting at position " + (this.current_index + 1) + " does not contain any values.");
					} else {
						this.generated_value_list.push(string_value);
						/*document.getElementById('warning').innerHTML += "<br />Sequence starting at position " + ((this.current_index + 1) - string_value.length) + " only contains one value."*/
						this.outputWarning("<br />Sequence starting at position " + ((this.current_index + 1) - string_value.length) + " only contains one value.")			
					}

					break;
				}
			}
			else 
			{
				string_value += this.lookahead();
				this.next();	
			}
		}

		console.log("array: " + this.generated_value_list.toString());
		console.log("current: " + this.current());
	}

	selectValueFromList(defined_no_of_chars, character_index = 0, allow_duplicates = false) { // pick a random value from the generated_value_list and do this quantifier_value number of times
		//var error_bool = false;
		if (character_index < this.quantifier_value) {
			//console.log("character_index= " + character_index);
			var randvalue = Math.floor(Math.random() * this.generated_value_list.length)
			if (this.generated_value_list[randvalue] != undefined) {
				this.buildGeneratedString(this.generated_value_list[randvalue]); // store value in generated_output
			}
			else
			{
				if (this.generated_output == "") {
					throw new Error("No value was returned. Please check the template.");					
				}

			}

			if (allow_duplicates == false)
			{
				this.generated_value_list.splice(randvalue, 1);
			}
			this.selectValueFromList(this.quantifier_value, character_index+=1, allow_duplicates);
		}
		else
		{
			console.log("remaining array values: " + this.generated_value_list.toString());
			this.generated_value_list = [];
		}
	}

	buildGeneratedString(output) { // construct the generated string as every value is selected, and store it in generated_output
		this.generated_output += output;
	}

	outputString() { // output the completed string at the end of execution
		return this.generated_output;
	}

	outputWarning(message) {
		if (document.getElementById(this.error_output_id)) {
			document.getElementById(this.error_output_id).innerHTML += message;
		}
		else {
			console.error(message);
		}
	}
}