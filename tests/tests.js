var Regexgen = require('../regexgen.js');
var stringGenerator = new Regexgen();

QUnit.test( "Parameter default values", function(assert) {
    assert.equal(stringGenerator.pattern, "", "generator uses empty string for pattern by default");
    assert.equal(stringGenerator.allow_duplicate_characters, true, "allow_duplicate_characters is set to true by default");
    assert.equal(stringGenerator.allow_logging, false, "allow_logging is set to false by default");
    assert.equal(stringGenerator.reporting_type, "full", "reporting_type set to full by default");
    assert.equal(stringGenerator.error_output_id, "warning", "error_output_id set to ID 'warning' by default");
});

QUnit.test( "Generate string using a range", function(assert) {
    stringGenerator.reporting_type = "none";
    
    var regex = /[a-z]{10}/
    var regexString = regex.toString().slice(1, -1);

    stringGenerator.pattern = regexString;
    var generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.pattern, regexString, `'${regexString}' assigned to stringGenerator.pattern`);
    assert.notEqual(generatedString, "", "generatedString should not be empty");
    assert.equal(regex.test(generatedString), true, `checking string '${generatedString}' matches pattern '${regexString}'`);
});

QUnit.test( "Generate string using a range preset", function(assert) {
    var regex = /[\w]{10}/
    var regexString = regex.toString().slice(1, -1);

    stringGenerator.pattern = regexString;
    var generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.pattern, regexString, `'${regexString}' assigned to stringGenerator.pattern`);
    assert.notEqual(generatedString, "", "generatedString should not be empty");
    assert.equal(regex.test(generatedString), true, `checking string '${generatedString}' matches pattern '${regexString}'`);
});

QUnit.test( "Generate string using an OR sequence", function(assert) {
    var regex = /(test1|test2)/
    var regexString = regex.toString().slice(1, -1);

    stringGenerator.pattern = regexString;
    var generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.pattern, regexString, `'${regexString}' assigned to stringGenerator.pattern`);
    assert.notEqual(generatedString, "", "generatedString should not be empty");
    assert.equal(regex.test(generatedString), true, `checking string '${generatedString}' matches pattern '${regexString}'`);
});

QUnit.test( "Generate string using an AND sequence", function(assert) {
    var regex = /(test1&test2)/
    var regexString = regex.toString().slice(1, -1);
    var regexMatch = /\b(t|e|s|1|2){10}\b/
    var regexMatchString = regexMatch.toString().slice(1, -1);

    stringGenerator.pattern = regexString;
    var generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.pattern, regexString, `'${regexString}' assigned to stringGenerator.pattern`);
    assert.notEqual(generatedString, "", "generatedString should not be empty");
    assert.equal(regexMatch.test(generatedString), true, `checking string '${generatedString}' matches pattern '${regexMatchString}'`);
});

QUnit.test( "Generate string using a quantifier range", function(assert) {
    var regex = /[a-z]{5,10}/
    var regexString = regex.toString().slice(1, -1);
    var regexMatch = /[a-z{5,10}]/
    var regexMatchString = regexString;

    stringGenerator.pattern = regexString;
    var generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.pattern, regexString, `'${regexString}' assigned to stringGenerator.pattern`);
    assert.notEqual(generatedString, "", "generatedString should not be empty");
    assert.equal(regex.test(generatedString), true, `checking string '${generatedString}' matches pattern '${regexString}'`);

    regex = /[a-z]{5:10}/
    regexString = regex.toString().slice(1, -1);

    stringGenerator.pattern = regexString;
    generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.pattern, regexString, `'${regexString}' assigned to stringGenerator.pattern`);
    assert.notEqual(generatedString, "", "generatedString should not be empty");
    assert.equal(regexMatch.test(generatedString), true, `checking string '${generatedString}' matches pattern '${regexMatchString}'`);

    regex = /[a-z]{5-10}/
    regexString = regex.toString().slice(1, -1);

    stringGenerator.pattern = regexString;
    generatedString = stringGenerator.createString();

    assert.equal(stringGenerator.pattern, regexString, `'${regexString}' assigned to stringGenerator.pattern`);
    assert.notEqual(generatedString, "", "generatedString should not be empty");
    assert.equal(regexMatch.test(generatedString), true, `checking string '${generatedString}' matches pattern '${regexMatchString}'`);
});