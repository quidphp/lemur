/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// include
// script to test the include.js file
const TestInclude = function()
{   
    let r = true;
    
    try 
    {
        // arr
        assert(Arr.is([]));
        assert(!Arr.is({}));
        assert(!Arr.is(arguments));
        assert(!Arr.isLike([]));
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
        assert(Arr.search(2,[1,2,3]) === 1);
        assert(!Arr.isEqual({},{}));
        assert(Arr.isEqual(Arr.slice(1,3,[2,4,6,8,10]),[4,6]));
        assert(Arr.isEqual(Arr.slice(1,undefined,[2,4,6,8,10]),[4,6,8,10]));
        assert(Arr.isEqual(Arr.slice(null,null,[2,4,6,8,10]),[2,4,6,8,10]));
        assert(Arr.isEqual(Arr.sliceStart(2,[2,4,6,8,10]),[6,8,10]));
        let spliceArr = [12,3,40];
        Arr.spliceValue(3,spliceArr);
        assert(Arr.isEqual(spliceArr,[12,40]));
        assert(Arr.isEqual(Arr.spliceValue(40,spliceArr,'ok'),[40]));
        assert(Arr.isEqual(spliceArr,[12,'ok']));
        assert(Vari.isEqual(Arr.valueStrip(3,[3,2,3,1,5]),[2,1,5]));
        let arr = [3,2,3,1,5];
        assert(Arr.valueFirst(arr) === 3);
        assert(Arr.valueFirst([]) === null);
        assert(Arr.valueStrip('8',arr) !== arr);
        assert(Arr.isEqual(Arr.valueStrip('8',arr),arr));
        let arrKey;
        assert(Vari.isEqual(Arr.copy([1,2,3]),[1,2,3]));
        assert(Arr.copy([1,2,3]) !== [1,2,3]);
        assert(Arr.each([1,2,3],function(value,key) {
            assert(value === this);
            arrKey = key;
        }));
        assert(arrKey === 2);
        
        // boolean
        assert(!Bool.is('true'));
        assert(!Bool.is(function() { }));
        assert(!Bool.is(null));
        assert(!Bool.is(1));
        assert(Bool.is(true));
        assert(Bool.num(true) === 1);
        assert(Bool.num(false) === 0);
        assert(Bool.toggle(1) === 0);
        assert(Bool.toggle('1') === '0');
        assert(Bool.toggle(false) === true);
        
        // browser
        assert(Bool.is(Browser.isOldIe()));
        assert(Bool.is(Browser.isUnsupported()));
        assert(Bool.is(Browser.allowsCookie()));
        
        // datetime
        assert(Num.is(Datetime.now()));
        
        // dom
        const htmlNode = $("html").get(0);
        const selectorOne = htmlNode.querySelector("body");
        const selectorAll = htmlNode.querySelectorAll("body");
        assert(!Dom.isNode(window));
        assert(Dom.isNode(document));
        assert(!Dom.isNode($("html")));
        assert(!Dom.isNode($("html,body").get()));
        assert(Dom.isNode(htmlNode));
        assert(Dom.isNodes([selectorOne]));
        assert(Dom.isNodes(selectorAll));
        assert(!Dom.isNodes([htmlNode,true]));
        assert(!Dom.isNodes(htmlNode));
        assert(Dom.isWindow(window));
        assert(!Dom.isWindow(document));
        assert(Dom.isTag('html',htmlNode));
        assert(Dom.matchAll('html',htmlNode));
        assert(Dom.tag(htmlNode) === 'html');
        assert(Dom.tag(window) === null);
        assert(Str.isNotEmpty(Dom.outerHtml(htmlNode)));
        assert(Num.is(Dom.heightWithPadding(htmlNode)));
        assert(Obj.isPlain(Dom.attr(htmlNode)));
        assert(Dom.getAttr('data-error',htmlNode) === 'none');
        assert(Str.isNotEmpty(Dom.attrStr(htmlNode)));
        assert(Obj.isPlain(Dom.dataAttr(htmlNode)));
        assert(Dom.getDataAttr('error',htmlNode) === 'none');
        
        // domChange

        // evt
        assert(Evt.checkType('ok') === undefined);
        assert(Evt.nameFromType('ok') === 'event');
        assert(Evt.nameFromType('ok:what') === 'customEvent');
        assert(Evt.createFromType('ok') instanceof Event);
        assert(Evt.createFromType('ok:what') instanceof CustomEvent);
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
        assert(Evt.getFunc(htmlNode,'what') === null);
        
        // func
        assert(!Func.is('test'));
        assert(Func.is(function() { }));
        
        // historyApi
        assert(HistoryApi.supported());
        assert(HistoryApi.isState({ url: 'test', timestamp: 1234 }));
        assert(HistoryApi.isStateChangeValid({ url: 'test', timestamp: 1234 },HistoryApi.makeState('what','bleh')));
        assert(Obj.length(HistoryApi.makeState('what','bleh')) === 3);
        
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
        assert(Num.castInt(true) === null);
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
        assert(Obj.keyExists('test',{test: 2}));
        assert(!Obj.keyExists('test',{testz: 2}));
        assert(Obj.isEqual([],[]))
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
        let objGetSet = {};
        assert(Obj.get('what',objGetSet) === null);
        assert(Obj.set('meh',2,objGetSet) !== objGetSet);
        assert(Obj.isEqual(Obj.set('meh',2,objGetSet),{meh: 2}));
        assert(Obj.setRef('meh',2,objGetSet) === objGetSet);
        assert(Obj.get('meh',objGetSet) === 2);
        assert(Obj.unset('meh',objGetSet) !== objGetSet);
        assert(Obj.isEqual(Obj.unset('meh',objGetSet),{}));
        assert(Obj.unsetRef('meh',objGetSet) === objGetSet);
        assert(Obj.get('meh',objGetSet) === null);
        let replace = {test:2, ok: {what: true}};
        assert(Obj.isEqual(Obj.copy(replace),replace));
        assert(Obj.copy(replace) !== replace);
        assert(Obj.isEqual(Obj.replace(replace,{ok: {james: false}}),{test: 2, ok: {james: false}}));
        assert(Obj.isEqual(replace,{test:2, ok: {what: true}}));
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }}) === 'str=2 what=ok loop=[1,2] meh={"what":2}');
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'!') === 'str!2 what!ok loop![1,2] meh!{"what":2}');
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'=',true) === "str='2' what='ok' loop='[1,2]' meh='{\"what\":2}'");
        assert(Obj.isEqual(Obj.replace([1,2,3],[4,5]),{0:4,1: 5,2:3}));
        assert(Obj.isEqual(Obj.replaceRecursive({test:2, ok: {what: true}},{ok: {james: false}}),{test: 2, ok: {what: true, james: false}}));
        assert(Obj.climb(['test','what'],{test: {what: 'LOL'}}) === 'LOL');
        assert(Obj.climb(['test','whatz'],{test: {what: 'LOL'}}) === null);
        let objKey;
        let objVal;
        assert(Obj.each({test: 'ok', what: 3},function(value,key) {
            assert(value === this);
            objKey = key;
            objVal = value;
        }));
        assert(objKey === 'what');
        assert(objVal === 3);
        assert(Obj.each({test: 'ok', what: 3},function(value,key) {
            objKey = key;
            objVal = value;
            return false;
        }) === false);
        assert(objKey === 'test');
        assert(objVal === 'ok');
        
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
        assert(Dom.isNode(Selector.scopedQuerySelector(htmlNode,"body")));
        assert(Selector.scopedQuerySelector(htmlNode,"james") == null);
        assert(Arr.isNotEmpty(Selector.scopedQuerySelectorAll(htmlNode,"body")));
        assert(Arr.isEmpty(Selector.scopedQuerySelectorAll(htmlNode,"james")));
        
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
        assert(Str.in('a','as') === true);
        assert(Str.in('é','aÉè') === false);
        assert(Str.pos('a','as') === 0);
        assert(Str.pos('é','aéè') === 1);
        assert(Str.pos('é','aÉè') === null);
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
        let val = null;
        assert(Str.each('abcde',function(value) {
            assert(value === this);
            val = value;
        }));
        assert(val === 'e');
        assert(Str.each('abcde',function(value) {
            val = value;
            return (value === 'c')? false:true;
        }) === false)
        assert(val === 'c');
        
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
        assert(!Validate.trigger('test',true,"^[0-9\-]+$"));
        assert(!Validate.trigger('abc-de',true,"^[0-9\-]+$"));
        assert(!Validate.trigger('',1,"^[0-9\-]+$"));
        assert(Validate.trigger('',false,"^[0-9\-]+$"));
        assert(Validate.required('test',true));
        assert(!Validate.required('',true));
        assert(Validate.required('test',1));
        assert(Validate.required('test',0));
        assert(!Validate.required('',1));
        assert(Validate.required('',0));
        assert(Validate.pattern('',"^[0-9\-]+$"));
        assert(Validate.pattern('01-2',"^[0-9\-]+$"));
        assert(!Validate.pattern('abc',"^[0-9\-]+$"));
        
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
        let variVal;
        assert(Vari.each({ok: 2},function(value) {
            variVal = value;
        }));
        assert(variVal === 2);
        let length = 0;
        Vari.each(new XMLHttpRequest(),function(value) {
            length++;
        });
        assert(length === 0);
        Vari.eachProto(new XMLHttpRequest(),function(value) {
            length++;
        });
        assert(length === 34);
        
        // xhr
        assert(Obj.length(Xhr.configFromNode(htmlNode)) === 3);
        assert(Xhr.parseError('<html><body><div>TEST</div></body></html>','error') === '<div>TEST</div>');
        assert(Xhr.parseError('<html><body><div class="ajax-parse-error"><div>TEST</div></div></body></html>','error') === '<div class="ajax-parse-error"><div>TEST</div></div>');
        assert(Xhr.parseError('','error') === 'error');
    } 
    
    catch (e) 
    {
        r = false;
        logError(e);
    } 
    
    return r;
}

// export
Test.Include = TestInclude;