/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// include
// script to test the include.js file
const Include = function()
{    
    // arr
    assert(Arr.is([]));
    assert(!Arr.is({}));
    assert(!Arr.is(arguments));
    assert(Arr.isLike([]));
    assert(!Arr.isLike({}));
    assert(!Arr.isLike(function() { }));
    assert(Arr.isLike(arguments));
    assert(!Arr.isLike(2));
    assert(!Arr.isLike('str'));
    assert(!Arr.isLike(null));
    assert(Arr.isEmpty([]));
    assert(Arr.isNotEmpty([null]));
    assert(!Arr.isNotEmpty([]));
    assert(Arr.in(null,[null]));
    assert(!Arr.in(true,[false]));
    assert(Vari.isEqual(Arr.slice(1,3,[2,4,6,8,10]),[4,6]));
    assert(Vari.isEqual(Arr.slice(1,undefined,[2,4,6,8,10]),[4,6,8,10]));
    assert(Vari.isEqual(Arr.slice(null,null,[2,4,6,8,10]),[2,4,6,8,10]));
    assert(Vari.isEqual(Arr.sliceStart(2,[2,4,6,8,10]),[6,8,10]));
    
    // bool
    assert(!Bool.is('true'));
    assert(!Bool.is(function() { }));
    assert(!Bool.is(null));
    assert(!Bool.is(1));
    assert(Bool.is(true));
    
    // browser
    assert(Bool.is(Browser.isResponsive()));
    assert(Bool.is(Browser.isTouch()));
    assert(Bool.is(Browser.isOldIe()));
    assert(Bool.is(Browser.isUnsupported()));
    assert(Bool.is(Browser.allowsCookie()));
    
    // datetime
    assert(Num.is(Datetime.timestamp()));
    
    // dom
    const htmlNode = $("html").get(0);
    const selectorOne = htmlNode.querySelector("body");
    const selectorAll = htmlNode.querySelectorAll("body");
    assert(!Dom.is(window));
    assert(Dom.is(document));
    assert(Dom.is($("html")));
    assert(Dom.is($("html,body").get()));
    assert(Dom.is([htmlNode]));
    assert(Dom.is([selectorOne]));
    assert(Dom.is([selectorAll]));
    assert(!Dom.is([htmlNode,true]));
    assert(Dom.is(htmlNode));
    assert(Dom.isWindow(window));
    assert(!Dom.isWindow(document));
    assert(Dom.isTag('html',htmlNode));
    assert(Dom.matchAll('html',htmlNode));
    assert(Dom.tag(htmlNode) === 'html');
    assert(Dom.tag(window) === null);
    assert(Str.isNotEmpty(Dom.outerHtml(htmlNode)));
    assert(Num.isInt(Dom.heightWithPadding(htmlNode)));
    assert(Obj.isPlain(Dom.attr(htmlNode)));
    assert(Str.isNotEmpty(Dom.getAttrStr(htmlNode)));
    assert(Obj.isPlain(Dom.getDataAttr(htmlNode)));

    // domChange

    // evt
    Evt.setFunc(htmlNode,'what',function(value) { $(this).data('OK',value); return true; });
    assert(Func.is(Evt.getFunc(htmlNode,'what')));
    assert($(htmlNode).data('OK') == null);
    assert(Evt.isTriggerFuncEqual(true,'what',[htmlNode],'james'));
    assert($(htmlNode).data('OK') == 'james');
    assert(Evt.triggerFunc(htmlNode,'what','no') === true);
    assert(Evt.triggerFunc(htmlNode,'what','yes') === true);
    assert($(htmlNode).data('OK') === 'yes');
    Evt.setFunc(htmlNode,'what',function() { return false; });
    assert(Evt.triggerFunc(htmlNode,'what') === false);
    Evt.removeFunc(htmlNode,'what');
    assert(Evt.getFunc(htmlNode,'what') === undefined);
    
    // func
    assert(!Func.is('test'));
    assert(Func.is(function() { }));
    
    // html
    const htmlStr = Dom.outerHtml($("html"));
    assert(Html.parse(htmlStr).length === 1);
    assert(Obj.length(Html.doc(htmlStr)) === 9);
    
    // json
    assert(Json.encode({ok: 2}) === '{"ok":2}');
    assert(Obj.isEqual(Json.decode('{"ok":2}'),{ok: 2}));
    
    // nav
    assert(Nav.index('first',2,10) === 0);
    assert(Nav.index('last',2,10) === 9);
    assert(Nav.index('prev',2,10) === 1);
    assert(Nav.index('next',2,10) === 3);
    assert(Nav.index('next',9,10) === null);
    assert(Nav.index('next',9,10,true) === 0);
    assert(Nav.index('prev',0,10) === null);
    assert(Nav.index('prev',0,10,true) === 9);
    assert(Nav.index(2,0,10,true) === 2);
    assert(Nav.index(0,0,10,true) === 0);
    assert(Nav.index(11,0,10,true) === null);
        
    // num
    assert(!Num.is('what'));
    assert(Num.is('2'));
    assert(Num.is('2.3'));
    assert(Num.is(2));
    assert(Num.is(2.2));
    assert(!Num.isInt('2'));
    assert(Num.isInt(2));
    assert(!Num.isInt(2.2));
    assert(Num.castInt('2.3') === 2);
    assert(Num.castInt(4) === 4);
    assert(Num.castInt(2.3) === 2);
    assert(Num.castStr('2.3') === '2.3');
    assert(Num.castStr(4) === '4');
    assert(Num.castStr(2.3) === '2.3');
    assert(Num.isInt(Num.uniqueInt()));
    assert(Num.uniqueInt() !== Num.uniqueInt());
    
    // obj
    assert(Obj.is({}));
    assert(Obj.is([]));
    assert(Obj.is(arguments));
    assert(Obj.is(function() { }));
    assert(!Obj.is('test'));
    assert(!Obj.is(null));
    assert(!Obj.is(undefined));
    assert(!Obj.is(true));
    assert(Obj.isPlain({}));
    assert(!Obj.isPlain([]));
    assert(!Obj.isPlain(arguments));
    assert(!Obj.isPlain(function() { }));
    assert(!Obj.isPlain('test'));
    assert(!Obj.isPlain(null));
    assert(!Obj.isPlain(undefined));
    assert(Obj.isEmpty({}));
    assert(Obj.isEmpty([]));
    assert(Obj.isEmpty(function() { }));
    assert(!Obj.isEmpty({ok: 2}));
    assert(!Obj.isEmpty([2]));
    assert(!Obj.isEmpty(null));
    assert(!Obj.isEmpty(false));
    assert(!Obj.isEmpty(undefined));
    assert(Obj.isEmpty(function() { return 2; }));
    assert(Obj.isNotEmpty({ok: 2}));
    assert(Obj.isNotEmpty([2]));
    assert(!Obj.isNotEmpty(2));
    assert(!Obj.isNotEmpty(null));
    assert(Obj.hasProperty('test',{test: 2}));
    assert(!Obj.hasProperty('test',{testz: 2}));
    assert(!Obj.isEqual({},[]));
    assert(!Obj.isEqual({},{},[]));
    assert(Obj.isEqual({},{},{}));
    assert(Obj.isEqual([2],[2],[2]));
    assert(!Obj.isEqual([2],[2],[1]));
    assert(Obj.isEqual({test: 2},{test: 2}));
    assert(!Obj.isEqual({test: 2},{test: 3}));
    assert(!Obj.isEqual('test','test'));
    assert(!Obj.isEqual('test','testz'));
    assert(!Obj.isEqual(3,3));
    assert(!Obj.isEqual(3,4));
    assert(!Obj.isEqual(null,null));
    assert(!Obj.isEqual(null,undefined));
    assert(Obj.length({ test: 2, ok: 3}) === 2);
    assert(Obj.length({}) === 0);
    let replace = {test:2, ok: {what: true}};
    assert(Obj.isEqual(Obj.replace(replace,{ok: {james: false}}),{test: 2, ok: {james: false}}));
    assert(Obj.isEqual(replace,{test:2, ok: {what: true}}));
    assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }}) === 'str=2 what=ok loop=[1,2] meh={"what":2}');
    assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'!') === 'str!2 what!ok loop![1,2] meh!{"what":2}');
    assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'=',true) === "str='2' what='ok' loop='[1,2]' meh='{\"what\":2}'");
    assert(Obj.isEqual(Obj.replace([1,2,3],[4,5]),{0:4,1: 5,2:3}));
    assert(Obj.isEqual(Obj.replaceRecursive({test:2, ok: {what: true}},{ok: {james: false}}),{test: 2, ok: {what: true, james: false}}));
    assert(Obj.climb(['test','what'],{test: {what: 'LOL'}}) === 'LOL');
    
    // request
    assert(Str.isNotEmpty(Request.relative()));
    assert(Str.isNotEmpty(Request.scheme()));
    assert(Str.is(Request.fragment()) || Request.fragment() === null);
    assert(Obj.isPlain(Request.parse()));
    
    // scalar
    assert(Scalar.is('test'));
    assert(Scalar.is(2));
    assert(Scalar.is(true));
    assert(Scalar.is(false));
    assert(!Scalar.is(null));
    
    // selector
    assert(Selector.input() === "input,select,textarea,button[type='submit']");
    
    // str
    assert(Str.is('WHAT'));
    assert(Str.is(''));
    assert(!Str.is([]));
    assert(!Str.is(null));
    assert(!Str.isEmpty('WHAT'));
    assert(Str.isEmpty(''));
    assert(!Str.isEmpty('as'));
    const isEmpty = Str.isEmpty;
    assert(isEmpty(''));
    assert(!Str.isNotEmpty(''));
    assert(Str.isNotEmpty('as'));
    assert(Str.isStart('a','as'));
    assert(!Str.isStart(3,'3s'));
    assert(Str.isEnd('s','as'));
    assert(!Str.isEnd('a','as'));
    assert(Str.lowerFirst('as') === 'as');
    assert(Str.lowerFirst('As') === 'as');
    assert(Str.lowerFirst('És') === 'és');
    assert(Str.upperFirst('as') === 'As');
    assert(Str.upperFirst('As') === 'As');
    assert(Str.trim(' As ') === 'As');
    assert(Str.cast(2) === '2');
    assert(Str.cast(false) === 'false');
    assert(Str.cast(true) === 'true');
    assert(Str.cast(null) === '');
    assert(Str.cast(undefined) === '');
    assert(Str.quote('what',true) === '"what"');
    assert(Str.quote('what') === "'what'");
    assert(Str.quote(2) === null);
    assert(Obj.isEqual(Str.explode('-','la-vie-ok'),['la','vie','ok']));
    assert(Str.explodeIndex(2,'-','la-vie-ok') === 'ok');
    assert(Str.explodeIndex('2','-','la-vie-ok') === null);
    assert(Str.explodeIndex(3,'-','la-vie-ok') === null);
    
    // uri
    assert(Uri.isInternal("http://google.com/test","http://google.com/test2"));
    assert(Uri.isInternal("/test","/test2"));
    assert(!Uri.isInternal("http://google.com/test","/test2"));
    assert(Uri.isExternal("http://googlez.com/test","http://google.com/test2"));
    assert(!Uri.isExternal("/test","/test2"));
    assert(!Uri.hasExtension("http://googlez.com/test"));
    assert(Uri.hasExtension("http://googlez.com/test.jpg"));
    assert(!Uri.hasFragment("http://googlez.com/test.jpg"));
    assert(Uri.hasFragment("http://googlez.com/test.jpg#james"));
    assert(Uri.hasFragment("/test.jpg#james"));
    assert(Uri.isSamePathQuery("/test.jpg?v=2","http://google.com/test.jpg?v=2#ok"));
    assert(!Uri.isSamePathQuery("/test.jpg?v=2","http://google.com/test.jpg?v=3#ok"));
    assert(Uri.isSamePathQueryHash("/test.jpg?v=2#ok","http://google.com/test.jpg?v=2#ok"));
    assert(!Uri.isSamePathQueryHash("/test.jpg?v=2#ok","http://google.com/test.jpg?v=3#ok1"));
    assert(Uri.isHashChange("/test.jpg?v=2#ok","/test.jpg?v=2#ok2"));
    assert(!Uri.isHashChange("/test.jpg?v=2#ok","/testz.jpg?v=2#ok2"));
    assert(!Uri.isHashChange("/test.jpg?v=2#ok","/test.jpg?v=2#ok"));
    assert(!Uri.isHashChange("/test.jpg?v=2","/test.jpg?v=2"));
    assert(Uri.isSameWithHash("http://goog.com/test.jpg?v=2#ok","http://goog.com/test.jpg?v=2#ok"));
    assert(!Uri.isSameWithHash("/test.jpg?v=2","/test.jpg?v=2"));
    assert(Uri.relative("http://google.com/ok?v=2#what") === '/ok?v=2');
    assert(Uri.relative("http://google.com/ok?v=2#what",true) === '/ok?v=2#what');
    assert(Uri.extension("http://google.com/ok.jpg?v=2#what") === 'jpg');
    assert(Obj.length(Uri.parse("http://google.com/ok?v=2#what")) === 6);
    assert(Uri.makeHash("james",true) === '#james');
    assert(Uri.makeHash("#james",true) === '#james');
    assert(Uri.makeHash("james") === 'james');
    assert(Uri.makeHash("#james") === 'james');
    assert(Uri.getMailto('mailto:test@test.com') === 'test@test.com');
    assert(Uri.getMailto('test@test.com') === 'test@test.com');
    assert(Uri.getMailto('mailto:testtest.com') === null);
    
    // validate
    assert(Validate.isNumericDash("213-123"));
    assert(Validate.isNumericDash("213123"));
    assert(!Validate.isNumericDash("213_123"));
    assert(Validate.isEmail("test@test.com"));
    assert(!Validate.isEmail("testtest.com"));
    assert(Validate.isEmail('bla@bla.zzzzzzz'));
    
    // vari
    assert(Vari.is(null));
    assert(!Vari.is(undefined));
    assert(Vari.isEmpty(null));
    assert(Vari.isEmpty({}));
    assert(Vari.isEmpty(false));
    assert(!Vari.isEmpty(true));
    assert(Vari.isEmpty(''));
    assert(Vari.isEmpty([]));
    assert(!Vari.isEmpty('0'));
    assert(Vari.isEmpty(0));
    assert(!Vari.isEmpty(1));
    assert(Vari.isEmpty(undefined));
    assert(Vari.isNotEmpty(2));
    assert(!Vari.isNotEmpty(null));
    assert(Vari.isEqual('test','test'));
    assert(!Vari.isEqual('test','testz'));
    assert(Vari.isEqual(3,3));
    assert(!Vari.isEqual(3,4));
    assert(Vari.isEqual(null,null));
    assert(!Vari.isEqual(null,undefined));
    assert(Vari.isEqualStrict(null,null));
    assert(Vari.isEqualStrict('test','test'));
    assert(!Vari.isEqualStrict([],[]));
    assert(Vari.type('test') === 'string');
    assert(Vari.type({}) === 'object');
    assert(Vari.type([]) === 'object');
    assert(Vari.type(function() { }) === 'object');
    assert(Vari.type(2) === 'number');
    assert(Vari.type(2.3) === 'number');
    assert(Vari.type(null) === 'null');
    assert(Vari.type(true) === 'boolean');
    assert(Vari.type(undefined) === 'undefined');
    
    // xhr
    assert(Obj.length(Xhr.configFromNode(htmlNode)) === 3);
    assert(Xhr.parseError('<html><body><div>TEST</div></body></html>','error') === '<div>TEST</div>');
    assert(Xhr.parseError('<html><body><div class="ajax-parse-error"><div>TEST</div></div></body></html>','error') === '<div class="ajax-parse-error"><div>TEST</div></div>');
    assert(Xhr.parseError('','error') === 'error');
    
    return true;
}

// export
Test.Include = Include;