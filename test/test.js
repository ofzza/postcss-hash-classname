var fs = require('fs');
var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');


describe('postcss-classname', function () {
  var opts = { hashType: 'md5', digestType: 'base32' };
  it('change class name', function () {
    opts.maxLength = 6;
    opts.dist = './dist/';
    opts.outputName = 'test1';
    var processor = postcss([ plugin(opts) ]);
    var testcss = '.test{}';
    var testcssLength = testcss.replace('{}', '').length;
    var result = processor.process(testcss).css.replace('{}', '');
    expect(result.length).to.equal(testcssLength + opts.maxLength + 1); // 1 means '.'
  });

  it('not class didnt change', function () {
    opts.dist = './dist/';
    opts.outputName = 'test2';
    var processor = postcss([plugin(opts)]);
    var testcss1 = '#id{}';
    var testcss2 = 'body{}';
    expect(processor.process(testcss1).css).to.equal(testcss1);
    expect(processor.process(testcss2).css).to.equal(testcss2);
  });

  it('test from file', function() {
    opts.dist = './dist/';
    opts.outputName = 'style';
    var css = fs.readFileSync('./test/test.css', 'utf8');
    var expected = fs.readFileSync('./test/test-expected.css', 'utf8');
    var processor = postcss([plugin(opts)]);
    var result = processor.process(css).css;
    expect(result).to.equal(expected);
  })
});
