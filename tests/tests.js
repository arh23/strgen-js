try {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        console.log("node");
        var strgen_class = require("../strgen.js");
        var stringGenerator = new strgen_class();
    } else {
        console.log("browser");
        var stringGenerator = new Strgen();
    }
} catch(e) {
    console.log(e);
}

function testRun(assert, regex, regexMatch, canBeEmpty = false) {
    if (regexMatch == undefined) 
    {
        var regexString = regex.toString().slice(1, -1);

        stringGenerator.pattern = regexString;
        var generatedString = stringGenerator.createString();

        assert.equal(stringGenerator.pattern, regexString, "'" + regexString + "' assigned to stringGenerator.pattern");
        if (!canBeEmpty) {
            assert.notEqual(generatedString, "", "generatedString should not be empty");
        }
        assert.equal(regex.test(generatedString), true, "checking string '" + generatedString + "' matches pattern '" + regexString + "'");
    }
    else if (regexMatch != undefined) 
    {
        var regexString = regex.toString().slice(1, -1);
        var regexMatchString = regexMatch.toString().slice(1, -1);

        stringGenerator.pattern = regexString;
        generatedString = stringGenerator.createString();

        assert.equal(stringGenerator.pattern, regexString, "'" + regexString + "' assigned to stringGenerator.pattern");
        if (!canBeEmpty) {
            assert.notEqual(generatedString, "", "generatedString should not be empty");
        }
        assert.equal(regexMatch.test(generatedString), true, "checking string '" + generatedString + "' matches pattern '" + regexMatchString + "'");
    }
}

function testErrors(assert, regex, errorType) {
    var regexString = regex.toString().slice(1, -1);

    stringGenerator.pattern = regexString;
    var generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.error_list.length, 1, "an error/warning is in the list");
    console.log(stringGenerator.store_errors)
    console.log(stringGenerator.error_list)
    assert.equal(stringGenerator.error_list[0].state, errorType, "checking if the error/warning has the state '" + errorType +"'");
}

QUnit.test("Parameter default values", function(assert) {
    assert.equal(stringGenerator.pattern, "", "generator uses empty string for pattern by default");
    assert.equal(stringGenerator.allow_duplicate_characters, true, "allow_duplicate_characters is set to true by default");
    assert.equal(stringGenerator.allow_multiple_instances, true, "allow_multiple_instances is set to true by default");
    assert.equal(stringGenerator.ignore_duplicate_case, false, "ignore_duplicate_case is set to false by default");
    assert.equal(stringGenerator.allow_logging, false, "allow_logging is set to false by default");
    assert.equal(stringGenerator.reporting_type, "full", "reporting_type is set to full by default");
    assert.equal(stringGenerator.error_output_id, "warning", "error_output_id set to ID 'warning' by default");
    assert.equal(stringGenerator.store_errors, false, "store_errors is set to false by default");
    assert.equal(stringGenerator.symbol_quantifier_max, 10, "symbol_quantifier_max set to 10 by default");
});

QUnit.module("String generation tests", function( hooks ) {

    hooks.before(function() {
        stringGenerator.reporting_type = "none";
    });

    QUnit.test( "Generate string using a range", function(assert) {   
        testRun(assert, /[a-z]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\w test", function(assert) {
        testRun(assert, /[\w]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\p test", function(assert) {
        testRun(assert, /[\p]{10}/, /[{}[\](),.\/\\:;\?!\*&@~`'"]{10}/); // [{}[](),.\/\\\'\":;?!*&@\`~\'
    });

    QUnit.test( "Generate string using a range preset - \\d test", function(assert) {
        testRun(assert, /[\d]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\c test", function(assert) {
        testRun(assert, /[\c]{10}/, /[a-z]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\u test", function(assert) {
        testRun(assert, /[\u]{10}/, /[A-Z]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\l test", function(assert) {
        testRun(assert, /[\l]{10}/, /[A-Za-z]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\h test", function(assert) {
        testRun(assert, /[\h]{10}/, /[0-9a-fa-f]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\H test", function(assert) {
        testRun(assert, /[\H]{10}/, /[0-9A-Fa-f]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\o test", function(assert) {
        testRun(assert, /[\o]{10}/, /[0-7]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\s test", function(assert) {
        testRun(assert, /[\s]/);
    });

    QUnit.test( "Generate string using an OR sequence", function(assert) {
        testRun(assert, /(test1|test2)/);
    });

    QUnit.test( "Generate string using an AND sequence", function(assert) {
        testRun(assert, /(test1&test2)/, /\b[tes12]{10}\b/);
    });

    QUnit.test( "Generate string using character ranges and quantifiers in a sequence", function(assert) {
        testRun(assert, /([a-zA-Z]+&[0-9]+|[A-Z]|[0-9]{4})/, /([a-zA-Z0-9]+|[A-Z]|[0-9]{4})/);
    });

    QUnit.test( "Generate string using a quantifier range - comma test", function(assert) {
        testRun(assert, /[a-z]{5,10}/);
    });

    QUnit.test( "Generate string using a quantifier range - colon test", function(assert) {
        testRun(assert, /[a-z]{5:10}/, /[a-z]{5,10}/);
    });

    QUnit.test( "Generate string using a quantifier range - dash test", function(assert) {
        testRun(assert, /[a-z]{5-10}/, /[a-z]{5,10}/);
    });

    QUnit.test( "Generate string using a quantifier range - no first value test", function(assert) {
        testRun(assert, /[a-z]{:10}/, /[a-z]{0,10}/, true);
    });

    QUnit.test( "Generate string using a symbol quantifier - ? test", function(assert) {
        testRun(assert, /[a-z]?/, /[a-z]?/, true);
    });

    QUnit.test( "Generate string using a symbol quantifier - * test", function(assert) {
        testRun(assert, /[a-z]*/, /[a-z]*/, true);
    });

    QUnit.test( "Generate string using a symbol quantifier - + test", function(assert) {
        testRun(assert, /[a-z]+/, /[a-z]+/);
    });
});

QUnit.module("Error and warning tests", function( hooks ) {

    hooks.before(function() {
        stringGenerator.reporting_type = "none";
        stringGenerator.store_errors = true;
        stringGenerator.allow_duplicate_characters = false;
    });

    hooks.after(function() {
        stringGenerator.store_errors = false; 
        stringGenerator.allow_duplicate_characters = true;
    });

    QUnit.test( "Create an error and check the list", function(assert) {
        testErrors(assert, /[a-z]{10/, "error");
    });

    QUnit.test( "Create a warning and check the list", function(assert) {
        testErrors(assert, /[a-z]{27}/, "warning");
    });
});