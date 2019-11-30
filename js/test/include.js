/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// testInclude
// script to test the include.js file
quid.test.include = new function() 
{    
    // instance
    var $inst = this;
    var d = console.log;
    var dd = console.dir;
    var assert = console.assert;
    
    
    // trigger
    this.trigger = function() 
    {    
        // alias
        var arr = quid.arr;
        var bool = quid.bool;
        var browser = quid.browser;
        var date = quid.date;
        var dom = quid.dom;
        var event = quid.event;
        var func = quid.func;
        var html = quid.html;
        var json = quid.json;
        var nav = quid.nav;
        var node = quid.node;
        var number = quid.number;
        var obj = quid.obj;
        var request = quid.request;
        var scalar = quid.scalar;
        var selector = quid.selector;
        var str = quid.str;
        var uri = quid.uri;
        var validate = quid.validate;
        var vari = quid.vari;
        var xhr = quid.xhr;
        
        // arr
        assert(arr.is([]));
        assert(!arr.is({}));
        assert(!arr.is(arguments));
        assert(arr.isLike([]));
        assert(!arr.isLike({}));
        assert(!arr.isLike(function() { }));
        assert(arr.isLike(arguments));
        assert(!arr.isLike(2));
        assert(!arr.isLike('str'));
        assert(!arr.isLike(null));
        assert(arr.isEmpty([]));
        assert(arr.isNotEmpty([null]));
        assert(!arr.isNotEmpty([]));
        assert(arr.in(null,[null]));
        assert(!arr.in(true,[false]));
        assert(vari.isEqual(arr.slice(1,3,[2,4,6,8,10]),[4,6]));
        assert(vari.isEqual(arr.slice(1,undefined,[2,4,6,8,10]),[4,6,8,10]));
        assert(vari.isEqual(arr.slice(null,null,[2,4,6,8,10]),[2,4,6,8,10]));
        assert(vari.isEqual(arr.sliceStart(2,[2,4,6,8,10]),[6,8,10]));
        
        // bool
        assert(!bool.is('true'));
        assert(!bool.is(function() { }));
        assert(!bool.is(null));
        assert(!bool.is(1));
        assert(bool.is(true));
        
        // browser
        assert(bool.is(browser.isResponsive()));
        assert(bool.is(browser.isTouch()));
        assert(bool.is(browser.isOldIe()));
        assert(bool.is(browser.isUnsupported()));
        assert(bool.is(browser.allowsCookie()));
        
        // date
        assert(number.is(date.timestamp()));
        
        // dom
        
        // event
        var htmlNode = $("html").get(0);
        event.setFunc(htmlNode,'what',function(value) { $(this).data('OK',value); return true; });
        assert(func.is(event.getFunc(htmlNode,'what')));
        assert($(htmlNode).data('OK') == null);
        assert(event.isTriggerFuncEqual(true,'what',[htmlNode],'james'));
        assert($(htmlNode).data('OK') == 'james');
        assert(event.triggerFunc(htmlNode,'what','no') === true);
        assert(event.triggerFunc(htmlNode,'what','yes') === true);
        assert($(htmlNode).data('OK') === 'yes');
        event.setFunc(htmlNode,'what',function() { return false; });
        assert(event.triggerFunc(htmlNode,'what') === false);
        event.removeFunc(htmlNode,'what');
        assert(event.getFunc(htmlNode,'what') === undefined);
        
        // func
        assert(!func.is('test'));
        assert(func.is(function() { }));
        
        // html
        var htmlStr = quid.node.outerHtml($("html"));
        assert(html.parse(htmlStr).length === 1);
        assert(quid.obj.length(html.doc(htmlStr)) === 9);
        
        // json
        assert(json.encode({ok: 2}) === '{"ok":2}');
        assert(obj.isEqual(json.decode('{"ok":2}'),{ok: 2}));
        
        // nav
        assert(nav.index('first',2,10) === 0);
        assert(nav.index('last',2,10) === 9);
        assert(nav.index('prev',2,10) === 1);
        assert(nav.index('next',2,10) === 3);
        assert(nav.index('next',9,10) === null);
        assert(nav.index('next',9,10,true) === 0);
        assert(nav.index('prev',0,10) === null);
        assert(nav.index('prev',0,10,true) === 9);
        assert(nav.index(2,0,10,true) === 2);
        assert(nav.index(0,0,10,true) === 0);
        assert(nav.index(11,0,10,true) === null);
        
        // node
        var htmlNode = $("html").get(0);
        var selectorOne = htmlNode.querySelector("body");
        var selectorAll = htmlNode.querySelectorAll("body");
        assert(!node.isLike(window));
        assert(node.isLike(document));
        assert(node.isLike($("html")));
        assert(node.isLike($("html,body").get()));
        assert(node.isLike([htmlNode]));
        assert(node.isLike([selectorOne]));
        assert(node.isLike([selectorAll]));
        assert(!node.isLike([htmlNode,true]));
        assert(node.isLike(htmlNode));
        assert(node.isWindow(window));
        assert(!node.isWindow(document));
        assert(node.isTag('html',htmlNode));
        assert(node.isAll('html',htmlNode));
        assert(node.tag(htmlNode) === 'html');
        assert(node.tag(window) === null);
        assert(str.isNotEmpty(node.outerHtml(htmlNode)));
        assert(number.isInt(node.heightWithPadding(htmlNode)));
        assert(obj.isPlain(node.getAttr(htmlNode)));
        assert(str.isNotEmpty(node.getAttrStr(htmlNode)));
        assert(obj.isPlain(node.getDataAttr(htmlNode)));
        
        // number
        assert(!number.is('what'));
        assert(number.is('2'));
        assert(number.is('2.3'));
        assert(number.is(2));
        assert(number.is(2.2));
        assert(!number.isInt('2'));
        assert(number.isInt(2));
        assert(!number.isInt(2.2));
        assert(number.castInt('2.3') === 2);
        assert(number.castInt(4) === 4);
        assert(number.castInt(2.3) === 2);
        assert(number.castStr('2.3') === '2.3');
        assert(number.castStr(4) === '4');
        assert(number.castStr(2.3) === '2.3');
        assert(number.isInt(number.uniqueInt()));
        assert(number.uniqueInt() !== number.uniqueInt());
        
        // obj
        assert(obj.is({}));
        assert(obj.is([]));
        assert(obj.is(arguments));
        assert(obj.is(function() { }));
        assert(!obj.is('test'));
        assert(!obj.is(null));
        assert(!obj.is(undefined));
        assert(!obj.is(true));
        assert(obj.isPlain({}));
        assert(!obj.isPlain([]));
        assert(!obj.isPlain(arguments));
        assert(!obj.isPlain(function() { }));
        assert(!obj.isPlain('test'));
        assert(!obj.isPlain(null));
        assert(!obj.isPlain(undefined));
        assert(obj.isEmpty({}));
        assert(obj.isEmpty([]));
        assert(obj.isEmpty(function() { }));
        assert(!obj.isEmpty({ok: 2}));
        assert(!obj.isEmpty([2]));
        assert(!obj.isEmpty(null));
        assert(!obj.isEmpty(false));
        assert(!obj.isEmpty(undefined));
        assert(obj.isEmpty(function() { return 2; }));
        assert(obj.isNotEmpty({ok: 2}));
        assert(obj.isNotEmpty([2]));
        assert(!obj.isNotEmpty(2));
        assert(!obj.isNotEmpty(null));
        assert(obj.hasProperty('test',{test: 2}));
        assert(!obj.hasProperty('test',{testz: 2}));
        assert(!obj.isEqual({},[]));
        assert(!obj.isEqual({},{},[]));
        assert(obj.isEqual({},{},{}));
        assert(obj.isEqual([2],[2],[2]));
        assert(!obj.isEqual([2],[2],[1]));
        assert(obj.isEqual({test: 2},{test: 2}));
        assert(!obj.isEqual({test: 2},{test: 3}));
        assert(!obj.isEqual('test','test'));
        assert(!obj.isEqual('test','testz'));
        assert(!obj.isEqual(3,3));
        assert(!obj.isEqual(3,4));
        assert(!obj.isEqual(null,null));
        assert(!obj.isEqual(null,undefined));
        assert(quid.obj.length({ test: 2, ok: 3}) === 2);
        assert(quid.obj.length({}) === 0);
        var replace = {test:2, ok: {what: true}};
        assert(obj.isEqual(obj.replace(replace,{ok: {james: false}}),{test: 2, ok: {james: false}}));
        assert(obj.isEqual(replace,{test:2, ok: {what: true}}));
        assert(obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }}) === 'str=2 what=ok loop=[1,2] meh={"what":2}');
        assert(obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'!') === 'str!2 what!ok loop![1,2] meh!{"what":2}');
        assert(obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'=',true) === "str='2' what='ok' loop='[1,2]' meh='{\"what\":2}'");
        assert(obj.isEqual(obj.replace([1,2,3],[4,5]),{0:4,1: 5,2:3}));
        assert(obj.isEqual(obj.replaceRecursive({test:2, ok: {what: true}},{ok: {james: false}}),{test: 2, ok: {what: true, james: false}}));
        assert(obj.climb(['test','what'],{test: {what: 'LOL'}}) === 'LOL');
        
        // request
        assert(str.isNotEmpty(request.relative()));
        assert(str.isNotEmpty(request.scheme()));
        assert(str.is(request.fragment()) || request.fragment() === null);
        assert(obj.isPlain(request.parse()));
        
        // scalar
        assert(scalar.is('test'));
        assert(scalar.is(2));
        assert(scalar.is(true));
        assert(scalar.is(false));
        assert(!scalar.is(null));
        
        // selector
        assert(selector.input() === "input,select,textarea,button[type='submit']");
        
        // str
        assert(str.is('WHAT'));
        assert(str.is(''));
        assert(!str.is([]));
        assert(!str.is(null));
        assert(!str.isEmpty('WHAT'));
        assert(str.isEmpty(''));
        assert(!str.isEmpty('as'));
        var isEmpty = str.isEmpty;
        assert(isEmpty(''));
        assert(!str.isNotEmpty(''));
        assert(str.isNotEmpty('as'));
        assert(str.isStart('a','as'));
        assert(!str.isStart(3,'3s'));
        assert(str.isEnd('s','as'));
        assert(!str.isEnd('a','as'));
        assert(str.lowerFirst('as') === 'as');
        assert(str.lowerFirst('As') === 'as');
        assert(str.lowerFirst('És') === 'és');
        assert(str.upperFirst('as') === 'As');
        assert(str.upperFirst('As') === 'As');
        assert(str.trim(' As ') === 'As');
        assert(str.cast(2) === '2');
        assert(str.cast(false) === 'false');
        assert(str.cast(true) === 'true');
        assert(str.cast(null) === '');
        assert(str.cast(undefined) === '');
        assert(str.quote('what',true) === '"what"');
        assert(str.quote('what') === "'what'");
        assert(str.quote(2) === null);
        assert(obj.isEqual(str.explode('-','la-vie-ok'),['la','vie','ok']));
        assert(str.explodeIndex(2,'-','la-vie-ok') === 'ok');
        assert(str.explodeIndex('2','-','la-vie-ok') === null);
        assert(str.explodeIndex(3,'-','la-vie-ok') === null);
        
        // uri
        assert(uri.isInternal("http://google.com/test","http://google.com/test2"));
        assert(uri.isInternal("/test","/test2"));
        assert(!uri.isInternal("http://google.com/test","/test2"));
        assert(uri.isExternal("http://googlez.com/test","http://google.com/test2"));
        assert(!uri.isExternal("/test","/test2"));
        assert(!uri.hasExtension("http://googlez.com/test"));
        assert(uri.hasExtension("http://googlez.com/test.jpg"));
        assert(!uri.hasFragment("http://googlez.com/test.jpg"));
        assert(uri.hasFragment("http://googlez.com/test.jpg#james"));
        assert(uri.hasFragment("/test.jpg#james"));
        assert(uri.isSamePathQuery("/test.jpg?v=2","http://google.com/test.jpg?v=2#ok"));
        assert(!uri.isSamePathQuery("/test.jpg?v=2","http://google.com/test.jpg?v=3#ok"));
        assert(uri.isSamePathQueryHash("/test.jpg?v=2#ok","http://google.com/test.jpg?v=2#ok"));
        assert(!uri.isSamePathQueryHash("/test.jpg?v=2#ok","http://google.com/test.jpg?v=3#ok1"));
        assert(uri.isHashChange("/test.jpg?v=2#ok","/test.jpg?v=2#ok2"));
        assert(!uri.isHashChange("/test.jpg?v=2#ok","/testz.jpg?v=2#ok2"));
        assert(!uri.isHashChange("/test.jpg?v=2#ok","/test.jpg?v=2#ok"));
        assert(!uri.isHashChange("/test.jpg?v=2","/test.jpg?v=2"));
        assert(uri.isSameWithHash("http://goog.com/test.jpg?v=2#ok","http://goog.com/test.jpg?v=2#ok"));
        assert(!uri.isSameWithHash("/test.jpg?v=2","/test.jpg?v=2"));
        assert(uri.relative("http://google.com/ok?v=2#what") === '/ok?v=2');
        assert(uri.relative("http://google.com/ok?v=2#what",true) === '/ok?v=2#what');
        assert(uri.extension("http://google.com/ok.jpg?v=2#what") === 'jpg');
        assert(obj.length(uri.parse("http://google.com/ok?v=2#what")) === 6);
        assert(uri.makeHash("james",true) === '#james');
        assert(uri.makeHash("#james",true) === '#james');
        assert(uri.makeHash("james") === 'james');
        assert(uri.makeHash("#james") === 'james');
        assert(uri.getMailto('mailto:test@test.com') === 'test@test.com');
        assert(uri.getMailto('test@test.com') === 'test@test.com');
        assert(uri.getMailto('mailto:testtest.com') === null);
        
        // validate
        assert(validate.isNumericDash("213-123"));
        assert(validate.isNumericDash("213123"));
        assert(!validate.isNumericDash("213_123"));
        assert(validate.isEmail("test@test.com"));
        assert(!validate.isEmail("testtest.com"));
        assert(validate.isEmail('bla@bla.zzzzzzz'));
        
        // vari
        assert(vari.is(null));
        assert(!vari.is(undefined));
        assert(vari.isEmpty(null));
        assert(vari.isEmpty({}));
        assert(vari.isEmpty(false));
        assert(!vari.isEmpty(true));
        assert(vari.isEmpty(''));
        assert(vari.isEmpty([]));
        assert(!vari.isEmpty('0'));
        assert(vari.isEmpty(0));
        assert(!vari.isEmpty(1));
        assert(vari.isEmpty(undefined));
        assert(vari.isNotEmpty(2));
        assert(!vari.isNotEmpty(null));
        assert(vari.isEqual('test','test'));
        assert(!vari.isEqual('test','testz'));
        assert(vari.isEqual(3,3));
        assert(!vari.isEqual(3,4));
        assert(vari.isEqual(null,null));
        assert(!vari.isEqual(null,undefined));
        assert(vari.isEqualStrict(null,null));
        assert(vari.isEqualStrict('test','test'));
        assert(!vari.isEqualStrict([],[]));
        assert(vari.type('test') === 'string');
        assert(vari.type({}) === 'object');
        assert(vari.type([]) === 'object');
        assert(vari.type(function() { }) === 'object');
        assert(vari.type(2) === 'number');
        assert(vari.type(2.3) === 'number');
        assert(vari.type(null) === 'null');
        assert(vari.type(true) === 'boolean');
        assert(vari.type(undefined) === 'undefined');
        
        // xhr
        assert(obj.length(xhr.configFromNode(htmlNode)) === 3);
        assert(xhr.parseError('<html><body><div>TEST</div></body></html>','error') === '<div>TEST</div>');
        assert(xhr.parseError('<html><body><div class="ajax-parse-error"><div>TEST</div></div></body></html>','error') === '<div class="ajax-parse-error"><div>TEST</div></div>');
        assert(xhr.parseError('','error') === 'error');
    }
}