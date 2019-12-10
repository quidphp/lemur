/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// include
// script to test the include.js file
const TestInclude = Test.Include = function()
{   
    let r = true;
    
    try 
    {
        // prepare
        const htmlNode = $("html").get(0);
        const selectorOne = htmlNode.querySelector("body");
        const selectorAll = htmlNode.querySelectorAll("body");
        const htmlStr = Dom.outerHtml($("html"));
        const isEmpty = Str.isEmpty.bind(Str);
        const noop = function() { };
        
        // arr
        assert(Arr.is([]));
        assert(!Arr.is({}));
        assert(!Arr.is(arguments));
        assert(Arr.in(null,[null]));
        assert(!Arr.in(null,null));
        assert(!Arr.in(true,[false]));
        assert(Arr.isEqual(Arr.keys([1,2,3]),[0,1,2]));
        assert(Arr.search(2,[1,2,3]) === 1);
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
        assert(Arr.isEmpty([]));
        assert(Arr.isNotEmpty([null]));
        assert(Arr.isNotEmpty([1,2,3]));
        assert(!Arr.isNotEmpty([]));
        assert(!Arr.isEmpty(''));
        assert(Arr.isEqual(Arr.check([]),[]));
        assert(Arr.isEqual(Arr.check([1],true),[1]));
        assert(Arr.check(undefined,false) === undefined);
        assert(Arr.isEqual([],[]));
        assert(!Arr.isEqual({},{}));
        let arr = [3,2,3,1,5];
        assert(Arr.valueFirst(arr) === 3);
        assert(Arr.valueFirst([]) === undefined);
        assert(Arr.valueStrip('8',arr) !== arr);
        assert(Arr.isEqual(Arr.valueStrip('8',arr),arr));
        let arrKey;
        assert(Vari.isEqual(Arr.copy([1,2,3]),[1,2,3]));
        let arrCopy = [1,2,3];
        assert(Arr.copy(arrCopy) !== arrCopy);
        assert(Arr.each([1,2,3],function(value,key,array) {
            assert(Arr.length(array) === 3);
            assert(value === this);
            arrKey = key;
        }));
        assert(arrKey === 2);
        assert(Arr.length([1,2,3]) === 3);
        assert(Arr.length({test: 2}) === null);
        assert(Arr.isEqual(Arr.set(1,'z',['a','b','c']),['a','z','c']));
        assert(Arr.isEqual(arrCopy,[1,2,3]));
        assert(Arr.setRef(2,4,arrCopy) === arrCopy);
        let mergeRef = [1,2,3];
        assert(Arr.mergeRef(mergeRef,'what',[4,5,6],arguments,selectorAll) === mergeRef);
        assert(Arr.isEqual(Arr.merge([1,2,3],'what',[4,5,6],arguments,selectorAll),mergeRef));
        assert(Arr.merge(mergeRef) !== mergeRef);
        assert(Arr.mergeRef(mergeRef) === mergeRef);
        assert(Arr.length(mergeRef) === 9);
        assert(Arr.isEqual(arrCopy,[1,2,4]));
        assert(Arr.length(Arr.merge([1,2,3],[4,5,6],arguments,selectorAll)) === 8);
        assert(Arr.filter([1,2,3],function(value,key,array) {
            assert(Arr.length(array) === 3);
            if(this === 1)
            {
                assert(value === 1);
                assert(key === 0);
            }
            
            return (this === 2)? true:false;
        }).length === 1);
        assert(Arr.isEqual(Arr.replace([1,2,2],[4,5],[0]),[0,5,2]));
        
        // arrLike
        assert(!ArrLike.is([]));
        assert(!ArrLike.is({}));
        assert(!ArrLike.is(function() { }));
        assert(ArrLike.is(arguments));
        assert(!ArrLike.is(2));
        assert(!ArrLike.is('str'));
        assert(ArrLike.is(selectorAll));
        assert(!ArrLike.is(null));
        assert(Arr.is(ArrLike.arr(selectorAll)));
        assert(ArrLike.search('bla',selectorAll) === null);
        assert(ArrLike.in(selectorAll[0],selectorAll));
        assert(ArrLike.sliceStart(0,selectorAll).length === 1);
        assert(ArrLike.isNotEmpty(selectorAll));
        assert(ArrLike.isEmpty(arguments));
        assert(!ArrLike.isNotEmpty(arguments));
        assert(ArrLike.check(arguments) === arguments);
        assert(ArrLike.check(undefined,false) === undefined);
        assert(ArrLike.length(arguments) === 0);
        assert(ArrLike.length(selectorAll) === 1);
        assert(ArrLike.keys(selectorAll).length === 1);
        assert(ArrLike.keyExists('what',selectorAll) === false);
        assert(Arr.is(ArrLike.copy(selectorAll)));
        assert(Arr.filter(selectorAll,function() {
            return true;
        }) === null);
        assert(ArrLike.filter(selectorAll,function() {
            return true;
        }) !== selectorAll);
        assert(Arr.isEmpty(ArrLike.filter(selectorAll,function() {
            return false;
        })));
        assert(Arr.valueFirst(ArrLike.map(selectorAll,function(value,key,array) {
            assert(ArrLike.length(array) === 1);
            return 'WHAT';
        })) === 'WHAT');
        
        // bool
        assert(!Bool.is('true'));
        assert(!Bool.is(function() { }));
        assert(!Bool.is(null));
        assert(!Bool.is(1));
        assert(Bool.is(true));
        assert(Bool.fromInt(true) === 1);
        assert(Bool.fromInt(false) === 0);
        assert(Bool.toggle(false) === true);
        assert(Bool.isEmpty(false));
        assert(!Bool.isEmpty(0));
        assert(Bool.isNotEmpty(true));
        assert(Bool.check(null,false) === null);
        assert(Bool.check(false) === false);
        assert(Bool.check(true,false) === true);
        
        // browser
        assert(Bool.is(Browser.isOldIe()));
        assert(Bool.is(Browser.isUnsupported()));
        assert(Bool.is(Browser.allowsCookie()));
        
        // datetime
        assert(Num.is(Datetime.now()));
        
        // debug
        
        // dom
        assert(Dom.isNode(window));
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
        assert(Pojo.is(Dom.attr(htmlNode)));
        assert(Dom.getAttr('data-error',htmlNode) === 'none');
        assert(Str.isNotEmpty(Dom.attrStr(htmlNode)));
        assert(Pojo.is(Dom.dataAttr(htmlNode)));
        assert(Dom.getDataAttr('error',htmlNode) === 'none');
        
        // domChange

        // evt
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
        assert(Evt.getFunc(htmlNode,'what') === undefined);
        
        // func
        assert(!Func.is('test'));
        assert(Func.is(noop));
        assert(Func.length(noop) === 0);
        Func.check(noop);
        Func.check(null,false);
        
        // historyApi
        assert(HistoryApi.supported());
        assert(HistoryApi.isState({ url: 'test', timestamp: 1234 }));
        assert(HistoryApi.isStateChangeValid({ url: 'test', timestamp: 1234 },HistoryApi.makeState('what','bleh')));
        assert(Obj.length(HistoryApi.makeState('what','bleh')) === 3);
        
        // html
        assert(Html.parse(htmlStr).length === 1);
        assert(Obj.length(Html.doc(htmlStr)) === 9);
        
        // integer
        assert(!Integer.is('2'));
        assert(Integer.is(2));
        assert(!Integer.is(2.2));
        assert(Integer.cast(true) === null);
        assert(Integer.cast('2.3') === 2);
        assert(Integer.cast(4) === 4);
        assert(Integer.cast(2.3) === 2);
        assert(Integer.fromBool(true) === 1);
        assert(Integer.fromBool(null) === null);
        assert(Integer.fromBool(false) === 0);
        assert(Integer.toggle(1) === 0);
        assert(Integer.toggle(2) === null);
        assert(Integer.is(Integer.unique()));
        assert(Integer.unique() !== Integer.unique());
        assert(Integer.str(40) === '40');
        assert(Integer.str(40.2) === null);
        assert(Integer.isEmpty(0));
        assert(!Integer.isEmpty('0'));
        assert(!Integer.isNotEmpty('1'));
        assert(Integer.isNotEmpty(1));
        assert(Integer.check(1) === 1);
        assert(Integer.check(0) === 0);
        assert(Integer.check(null,false) === null);
        
        // json
        assert(Json.encode({ok: 2}) === '{"ok":2}');
        assert(Pojo.isEqual(Json.decode('{"ok":2}'),{ok: 2}));
        
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
        assert(Nav.index(11,0,10,true) === undefined);
            
        // num
        assert(!Num.is('what'));
        assert(Num.is('2'));
        assert(Num.is('2.3'));
        assert(Num.is(2));
        assert(Num.is(2.2));
        assert(Num.cast('1.2') === 1.2);
        assert(Num.cast('1,2') === null);
        assert(Num.cast(1) === 1);
        assert(Num.cast(1.2) === 1.2);
        assert(Num.cast(null) === null);
        assert(Num.cast([]) === null);
        assert(Num.str('2.3') === '2.3');
        assert(Num.str(4) === '4');
        assert(Num.str(2.3) === '2.3');
        assert(Num.isEmpty('0'));
        assert(Num.isEmpty(0));
        assert(!Num.isEmpty(true));
        assert(Num.isNotEmpty('1.1'));
        assert(Num.isNotEmpty(1.1));
        assert(Num.check('0') === '0');
        assert(Num.check(2.1,true) === 2.1);
        
        // obj
        assert(Obj.is({}));
        assert(Obj.is([]));
        assert(Obj.is(arguments));
        assert(Obj.is(function() { }));
        assert(Obj.is(htmlNode));
        assert(!Obj.is('test'));
        assert(!Obj.is(null));
        assert(!Obj.is(undefined));
        assert(!Obj.is(true));
        assert(Obj.length({ test: 2, ok: 3}) === 2);
        assert(Obj.length({}) === 0);
        assert(Obj.length([1,2,3]) === 3);
        assert(Obj.length({test: 2}) === 1);
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
        let objGetSet = { test: 3};
        assert(Obj.get('test',objGetSet) === 3);
        assert(Obj.set('test',4,objGetSet) !== objGetSet);
        assert(Obj.get('test',objGetSet) === 3);
        assert(Obj.unset('test',objGetSet) !== objGetSet);
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }}) === 'str=2 what=ok loop=[1,2] meh={"what":2}');
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'!') === 'str!2 what!ok loop![1,2] meh!{"what":2}');
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'=',true) === "str='2' what='ok' loop='[1,2]' meh='{\"what\":2}'");
        let objCopy = { test: 3};
        assert(Obj.copy(objCopy) !== objCopy);
        assert(Obj.isEqual(Obj.new(),{}));
        assert(Obj.length(Obj.replace(objCopy,{test2: 4})) === 2);
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
        assert(Obj.length({ test: 2, ok: 3}) === 2);
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
        let variVal;
        assert(Obj.each({ok: 2},function(value) {
            variVal = value;
        }));
        assert(variVal === 2);
        let length = 0;
        Obj.each(new XMLHttpRequest(),function(value) {
            length++;
        });
        assert(length === 0);
        
        // pojo
        assert(!Pojo.is(htmlNode));
        assert(Pojo.is({}));
        assert(!Pojo.is([]));
        assert(!Pojo.is(arguments));
        assert(!Pojo.is(function() { }));
        assert(!Pojo.is('test'));
        assert(!Pojo.is(null));
        assert(!Pojo.is(undefined));
        let replace = {test:2, ok: {what: true}};
        let pojoGetSet = {};
        assert(Pojo.isEqual(Pojo.replaceRecursive({test:2, ok: {what: true}},null,false,{ok: {james: false}}),{test: 2, ok: {what: true, james: false}}));
        assert(Pojo.replaceRecursive([true],{test: 2}) === null);
        assert(Pojo.isEqual(Pojo.replaceRecursive({test: 2},{test: { ok: 3}},'meh',{test: { ok: {ok: 1}, ok2: [1,2,3]}}),{test: {ok: {ok: 1}, ok2: [1, 2, 3]}}));
        assert(Pojo.climb(['test','what'],{test: {what: 'LOL'}}) === 'LOL');
        assert(Pojo.climb(['test','whatz'],{test: {what: 'LOL'}}) === undefined);
        assert(Pojo.isEqual(Pojo.replace(replace,{ok: {james: false}}),{test: 2, ok: {james: false}}));
        assert(Pojo.isEqual(replace,{test:2, ok: {what: true}}));
        assert(Pojo.set('meh',2,pojoGetSet) !== pojoGetSet);
        assert(Pojo.isEqual(Pojo.set('meh',2,pojoGetSet),{meh: 2}));
        assert(Pojo.setRef('meh',2,pojoGetSet) === pojoGetSet);
        assert(Pojo.get('meh',pojoGetSet) === 2);
        assert(Pojo.unset('meh',pojoGetSet) !== pojoGetSet);
        assert(Pojo.isEqual(Pojo.unset('meh',pojoGetSet),{}));
        assert(Pojo.unsetRef('meh',pojoGetSet) === pojoGetSet);
        assert(Pojo.get('meh',pojoGetSet) === undefined);
        assert(Pojo.isEqual(Pojo.copy(replace),replace));
        assert(Pojo.copy(replace) !== replace);
        assert(Pojo.isEmpty({}));
        assert(!Pojo.isEmpty([]));
        assert(!Pojo.isNotEmpty({}));
        assert(Pojo.isNotEmpty({test: 2}));
        assert(!Pojo.isEqual(htmlNode,htmlNode));
        assert(!Pojo.isEqual([],[]));
        assert(Pojo.isEqual({ok: 2},{ok: 2}));
        assert(!Pojo.isEqual({ok: 2},{ok: 3}));
        assert(Pojo.isKey(2));
        assert(Pojo.keyExists('test',{test: 2}));
        assert(!Pojo.keyExists('test',{testz: 2}));
        assert(Pojo.get('what',pojoGetSet) === undefined);
        let pojoMapFilter = { test: 3, ok: 'what', james: { lol: true}, final: null, undef: undefined};
        assert(Pojo.length(Pojo.filter(pojoMapFilter,function() {
            return (Pojo.is(this))? false:true;
        })) === 4);
        assert(Pojo.length(pojoMapFilter) === 5);
        assert(Pojo.map(pojoMapFilter,function() {
            return (Pojo.is(this))? false:true;
        })['final'] === true);
        assert(Pojo.isEqual(Pojo.find(pojoMapFilter,function(value,key,pojo) {
            assert(pojo === pojoMapFilter);
            return (Pojo.is(this))? true:false;
        }),{lol: true}));
        assert(Arr.length(Pojo.arr(pojoMapFilter)) === 5);
        
        // request
        assert(Str.isNotEmpty(Request.relative()));
        assert(Str.isNotEmpty(Request.scheme()));
        assert(Str.is(Request.fragment()) || Request.fragment() === null);
        assert(Pojo.is(Request.parse()));
        
        // scalar
        assert(Scalar.is('test'));
        assert(Scalar.is(2));
        assert(Scalar.is(true));
        assert(Scalar.is(false));
        assert(!Scalar.is(null));
        assert(Scalar.isNotBool(1));
        assert(!Scalar.isNotBool(false));
        assert(!Scalar.isEmpty(1));
        assert(Scalar.isEmpty(false));
        assert(Scalar.isNotEmpty(1));
        assert(!Scalar.isNotEmpty(false));
        assert(Scalar.check('') === '');
        assert(Scalar.check(true,true) === true);
        assert(Scalar.check(false) === false);
        assert(Scalar.check(null,false) === null);

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
        assert(Str.isStart('a','as'));
        assert(!Str.isStart(3,'3s'));
        assert(Str.isEnd('s','as'));
        assert(!Str.isEnd('a','as'));
        assert(Str.in('a','as') === true);
        assert(Str.in('é','aÉè') === false);
        assert(Str.cast(2) === '2');
        assert(Str.cast(false) === 'false');
        assert(Str.cast(true) === 'true');
        assert(Str.cast(null) === '');
        assert(Str.cast(undefined) === '');
        assert(Str.pos('a','as') === 0);
        assert(Str.pos('é','aéè') === 1);
        assert(Str.pos('é','aÉè') === null);
        assert(Str.lowerFirst('as') === 'as');
        assert(Str.lowerFirst('As') === 'as');
        assert(Str.lowerFirst('És') === 'és');
        assert(Str.upperFirst('as') === 'As');
        assert(Str.upperFirst('As') === 'As');
        assert(Str.trim(' As ') === 'As');
        assert(Str.quote('what',true) === '"what"');
        assert(Str.quote('what') === "'what'");
        assert(Str.quote(2) === null);
        assert(Obj.isEqual(Str.explode('-','la-vie-ok'),['la','vie','ok']));
        assert(Str.explodeIndex(2,'-','la-vie-ok') === 'ok');
        assert(Str.explodeIndex('2','-','la-vie-ok') === undefined);
        assert(Str.explodeIndex(3,'-','la-vie-ok') === undefined);
        assert(!Str.isEmpty('WHAT'));
        assert(Str.isEmpty(''));
        assert(!Str.isEmpty('as'));
        assert(isEmpty(''));
        assert(!Str.isNotEmpty(''));
        assert(Str.isNotEmpty('as'));
        assert(Str.check('ok') === 'ok');
        assert(Str.check('') === '');
        assert(Str.check(null,false) === null);
        assert(Str.check(undefined,false) === undefined);
        assert(Str.check('',false) === '');
        let val = null;
        assert(Str.each('abcde',function(value) {
            assert(value === this);
            val = value;
        }));
        assert(Arr.isEqual(Str.keys('whaé'),['0','1','2','3']));
        assert(Arr.isEqual(Str.values('whaé'),['w','h','a','é']));
        assert(Str.length('whaé') === 4);
        assert(val === 'e');
        assert(Str.each('abcde',function(value) {
            val = value;
            return (value === 'c')? false:true;
        }) === false)
        assert(val === 'c');
        let strVal = 'wéè';
        assert(Str.get(1,strVal) === 'é');
        assert(Str.valueFirst('éèè') === 'é');
        assert(Str.find('john',function() {
            return this != 'j'? true:false;
        }) === 'o');
        assert(Arr.length(Str.arr('what')) === 4);
        
        // type
        
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
        assert(Validate.regex("212","^[0-9\-]+$"))
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
        assert(Vari.isNull(null));
        assert(!Vari.isNull(undefined));
        assert(!Vari.isUndefined(null));
        assert(Vari.isUndefined(undefined));
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
        Vari.eachProto(new XMLHttpRequest(),function(value) {
            length++;
        });
        assert(length === 34);

        // xhr
        assert(Pojo.length(Xhr.configFromNode(htmlNode)) === 9);
        assert(Pojo.length(Xhr.configFromNode(htmlNode,null,true)) === 13);
        assert(Xhr.parseError('<html><body><div>TEST</div></body></html>','error') === '<div>TEST</div>');
        assert(Xhr.parseError('<html><body><div class="ajax-parse-error"><div>TEST</div></div></body></html>','error') === '<div class="ajax-parse-error"><div>TEST</div></div>');
        assert(Xhr.parseError('','error') === 'error');
        
        // js
        assert(Arr.is !== Obj.is);
        assert(Obj.each === Str.each);
        assert(Object.getPrototypeOf(Obj) === Object.getPrototypeOf(Str));
        assert(!(false == null));
        assert(!(0 == null));
        assert(!('' == null));
        assert(null == null);
        assert(undefined == null);
        assert(!([] == true));
    } 
    
    catch (e) 
    {
        r = false;
        logError(e);
    } 
    
    return r;
}