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

function testRun(assert, regex, regexMatch) {
    if (regexMatch == undefined) 
    {
        var regexString = regex.toString().slice(1, -1);

        stringGenerator.pattern = regexString;
        var generatedString = stringGenerator.createString();

        assert.equal(stringGenerator.pattern, regexString, "'" + regexString + "' assigned to stringGenerator.pattern");
        assert.notEqual(generatedString, "", "generatedString should not be empty");
        assert.equal(regex.test(generatedString), true, "checking string '" + generatedString + "' matches pattern '" + regexString + "'");
    }
    else if (regexMatch != undefined) 
    {
        var regexString = regex.toString().slice(1, -1);
        var regexMatchString = regexMatch.toString().slice(1, -1);

        stringGenerator.pattern = regexString;
        generatedString = stringGenerator.createString();

        assert.equal(stringGenerator.pattern, regexString, "'" + regexString + "' assigned to stringGenerator.pattern");
        assert.notEqual(generatedString, "", "generatedString should not be empty");
        assert.equal(regexMatch.test(generatedString), true, "checking string '" + generatedString + "' matches pattern '" + regexMatchString + "'");
    }
}

QUnit.test("Parameter default values", function(assert) {
    assert.equal(stringGenerator.pattern, "", "generator uses empty string for pattern by default");
    assert.equal(stringGenerator.allow_duplicate_characters, true, "allow_duplicate_characters is set to true by default");
    assert.equal(stringGenerator.allow_logging, false, "allow_logging is set to false by default");
    assert.equal(stringGenerator.reporting_type, "full", "reporting_type set to full by default");
    assert.equal(stringGenerator.error_output_id, "warning", "error_output_id set to ID 'warning' by default");
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
        testRun(assert, /[\c]{10}/, /[abcdefghijklmnopqrstuvwxyz]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\u test", function(assert) {
        testRun(assert, /[\u]{10}/, /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\l test", function(assert) {
        testRun(assert, /[\l]{10}/, /[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\h test", function(assert) {
        testRun(assert, /[\h]{10}/, /[0123456789abcdfabcdf]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\H test", function(assert) {
        testRun(assert, /[\H]{10}/, /[0123456789ABCDFabcdf]{10}/);
    });

    QUnit.test( "Generate string using a range preset - \\o test", function(assert) {
        testRun(assert, /[\o]{10}/, /[01234567]{10}/);
    });

    QUnit.test( "Generate string using an OR sequence", function(assert) {
        testRun(assert, /(test1|test2)/);
    });

    QUnit.test( "Generate string using an AND sequence", function(assert) {
        testRun(assert, /(test1&test2)/, /\b[tes12]{10}\b/);
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
});

QUnit.module("Warnings", function( hooks ) {

    hooks.before(function() {
        stringGenerator.allow_duplicate_characters = false;        
        stringGenerator.pattern = "[a-z]{100}";
    });

    QUnit.test("Display a warning on the ID provided", function(assert) {
        generatedString = stringGenerator.createString();

        assert.notEqual(document.getElementById("warning").innerHTML, "", "check if the 'warning' div is not empty");
        assert.equal(stringGenerator.error_list.length, 0, "check if the warning/error list is empty");
        document.getElementById("warning").innerHTML = "";
    });

    QUnit.test("Store a warning in the errors/warnings list", function(assert) {
        stringGenerator.store_errors = true;
        stringGenerator.error_output_id = "none";

        generatedString = stringGenerator.createString();

        assert.equal(stringGenerator.error_list.length, 1, "check if the warning/error list contains one entry");
        assert.equal(document.getElementById("warning").innerHTML, "", "check if the 'warning' div is empty");
    });

    QUnit.test("Do not store or display warnings, when store_errors is false and the ID does not exist (warning will be printed to console)", function(assert) {
        stringGenerator.store_errors = false;
        stringGenerator.error_output_id = "none";

        generatedString = stringGenerator.createString();

        assert.equal(stringGenerator.error_list.length, 0, "check if the warning/error list is empty");
        assert.equal(document.getElementById("warning").innerHTML, "", "check if the 'warning' div is empty");
    });
});