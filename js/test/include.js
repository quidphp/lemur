/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// include
// script to test the include.js file
Test.Include = function()
{   
    let r = true;
    
    try 
    {
        // prepare
        let newHtml = "<form method='post' action='/ok'>";
        newHtml += "<input type='text' value='2' name='test-suite' data-required='1' data-pattern='^[0-9\-]+$' />";
        newHtml += "<input type='submit' name='test-submit3' value='' />";
        newHtml += "<input type='submit' name='test-submit2' value='' />";
        newHtml += "<input type='submit' name='test-submit' value='' />";
        newHtml += "<div class='ok'>test <span>what</span></div>";
        newHtml += "</form>";
        newHtml += "<div class='content' style='width: 25px; height: 25px; margin: 10px; padding: 5px; border: 5px solid green; box-sizing: content-box; border-image: none;'></div>";
        newHtml += "<div class='border' style='width: 25px; height: 25px; margin: 10px; padding: 5px; border: 5px solid green; box-sizing: border-box; border-image: none;'></div>";
        newHtml += "<div class='hidden' style='display: none; padding: 3px;'>LOL</div>";
        
        const htmlNode = Nod.scopedQuery(document,'html');
        const selectorOne = htmlNode.querySelector("body");
        const selectorAll = htmlNode.querySelectorAll("body");
        const htmlStr = Ele.getOuterHtml(htmlNode);
        const isEmpty = Str.isEmpty.bind(Str);
        const noop = function() { };
        const bodyNode = Ele.scopedQuery(htmlNode,'body');
        Ele.prepend(bodyNode,newHtml);
        const formNode = Ele.scopedQuery(bodyNode,"> form");
        const formInput = Ele.scopedQueryAll(formNode,Dom.selectorInput());
        const divNode = Ele.scopedQuery(formNode,"> div");
        const inputNode = Ele.scopedQuery(formNode,"> input[type='text']");
        const submitNode = Ele.scopedQuery(formNode,"> input[name='test-submit']");
        const textNode = divNode.firstChild;
        const contentBox = Ele.scopedQuery(bodyNode,"> div.content");
        const borderBox = Ele.scopedQuery(bodyNode,"> div.border");
        const fragment = document.createDocumentFragment();
        const template = document.createElement('template');
        const hiddenNode = Ele.scopedQuery(bodyNode,".hidden");
        Ele.setHtml(template,newHtml);
        Doc.setHtml(fragment,newHtml);
        const formTemplate = Doc.children(template.content,'form');
        
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
        assert(Arr.valueLast(arr) === 5);
        assert(Arr.valueFirst([]) === undefined);
        assert(Arr.valueStrip('8',arr) !== arr);
        assert(Arr.keyFirst(arr) === 0);
        assert(Arr.keyLast(arr) === 4);
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
        assert(Arr.isEqual(Arr.clean([null,undefined,0,'0',[],{},false,true,'',1]),[0,'0',false,true,1]));
        assert(Arr.timeouts([1,2,3],2000,2000,function() {
            assert(Integer.is(this));
        }));
        assert(Arr.oddEven([1,2,3],function() {
            assert(this !== 2);
        },function() {
            assert(this === 2);
        }));
        
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
        assert(Bool.fromInt(1) === true);
        assert(Bool.fromInt(0) === false);
        assert(Bool.fromScalar(1) === true);
        assert(Bool.fromScalar('true') === true);
        assert(Bool.fromScalar(0) === false);
        assert(Bool.fromScalar(false) === false);
        assert(Bool.toggle(false) === true);
        assert(Bool.isEmpty(false));
        assert(!Bool.isEmpty(0));
        assert(Bool.isNotEmpty(true));
        assert(Bool.check(null,false) === null);
        assert(Bool.check(false) === false);
        assert(Bool.check(true,false) === true);
        
        // browser
        assert(Bool.is(Browser.isOldIe()));
        assert(Bool.is(Browser.isIe11()));
        assert(Bool.is(Browser.isIe()));
        assert(Bool.is(Browser.isUnsupported()));
        assert(Bool.is(Browser.allowsCookie()));

        // data
        
        // datetime
        assert(Num.is(Datetime.now()));
        
        // debug
        
        // doc
        assert(Doc.is(document));
        assert(Doc.is(fragment));
        assert(Doc.isCurrent(document));
        assert(!Doc.is(window));
        assert(!Doc.is(htmlNode));
        assert(!Doc.isFragment(document));
        assert(Doc.isFragment(fragment));
        assert(Doc.isFragment(Ele.parent(formTemplate[0])));
        assert(Doc.isTemplate(template));
        assert(Num.is(Doc.getDimension(document).width));
        assert(Num.is(Doc.getDimension(document).height));
        assert(Doc.realNode(document) === document);
        assert(Doc.realNode(fragment) === fragment);
        assert(Doc.realNode(template) === template.content);
        assert(Pojo.isEqual(Doc.getDimension(fragment),{width:0,height:0}));
        assert(Str.isStart('<html',Doc.getHtml(document)));
        assert(Str.isStart('<form',Doc.getHtml(fragment)));
        assert(Doc.setHtml(fragment,'<div>ok</div>') === undefined);
        assert(Doc.getHtml(fragment) === '<div>ok</div>');
        assert(Str.isStart('<form',Doc.getHtml(template)));
        assert(Doc.setHtml(template,'<div>ok</div>') === undefined);
        assert(Doc.getHtml(template) === '<div>ok</div>');
        Doc.setHtml(template,newHtml);
        assert(Str.isStart('<form',Doc.getHtml(template)));
        assert(Doc.getHtml(fragment) === '<div>ok</div>');
        Doc.setHtml(template,fragment,true);
        assert(Doc.getHtml(template) === '<div>ok</div>');
        Doc.setHtml(template,newHtml,true);
        assert(Doc.getHtml(fragment) === '<div>ok</div>');
        Doc.setHtml(fragment,template,true);
        assert(Str.isStart('<form',Doc.getHtml(fragment)));
        assert(Str.isStart('<form',Doc.getHtml(template)));
        assert(Doc.check(document) === document);
        assert(Doc.are([document,fragment]));
        assert(Arr.length(Doc.scopedQueryAll(fragment,"input")) === 4);
        assert(Arr.length(Doc.scopedQueryAll(template,"input")) === 4);
        assert(Arr.length(Doc.scopedQueryAll(document,"input")) === 4);
        Doc.setHtml(template,"<div><span>OK</span></div>");
        Doc.setHtml(fragment,"<div><span>OK</span></div>");
        assert(Arr.length(Doc.scopedQueryAll(fragment,"div")) === 1);
        assert(Arr.length(Doc.scopedQueryAll(template,"span")) === 1);
        assert(Ele.tag(Doc.children(template)[0]) === 'div');
        assert(Ele.tag(Doc.children(fragment)[0]) === 'div');
        assert(Ele.tag(Doc.children(document)[0]) === 'html');
        assert(Doc.parent(template) === null);
        assert(Doc.parent(fragment) === null);
        assert(Arr.isNotEmpty(Ele.children(template)));
        Doc.setHtml(template,newHtml);
        
        // dom
        assert(Dom.htmlStr(2) === '2');
        assert(Dom.htmlStr(htmlNode) === Dom.htmlStr([htmlNode]));
        assert(Arr.is(Dom.parse(htmlStr)));
        assert(Ele.is(Dom.parseOne(htmlStr)));
        assert(Dom.querySelector("div[data-success]",htmlStr) === '<span>JavaScript: </span><span>Idle</span>');
        assert(Obj.length(Dom.doc(htmlStr)) === 11);
        assert(Dom.selectorInput() === "input,select,textarea,button[type='submit']");
        assert(Dom.selectorInput(true) === "input,select,textarea,button");
        
        // ele
        assert(Ele.hasData(divNode,'what') === false);
        assert(Ele.getData(divNode,'what') === undefined);
        assert(Ele.allData(divNode) === undefined);
        assert(!Ele.is(textNode));
        assert(!Ele.is(window));
        assert(!Ele.is(document));
        assert(!Ele.is(window));
        assert(!Ele.is(document));
        assert(Ele.is(htmlNode));
        assert(Ele.are([selectorOne]));
        assert(!Ele.are(selectorAll));
        assert(!Ele.are([htmlNode,true]));
        assert(!Ele.are(htmlNode));
        assert(!Ele.isEmpty(selectorOne));
        assert(!Ele.isEmpty(window));
        assert(Ele.isNotEmpty(selectorOne));
        assert(Ele.isVisible(htmlNode));
        assert(Ele.isVisible(borderBox));
        assert(!Ele.isHidden(htmlNode));
        assert(Ele.isTag(htmlNode,'html'));
        assert(!Ele.isFocused(htmlNode));
        assert(!Ele.isFocusable(htmlNode));
        assert(Ele.isFocusable(inputNode));
        assert(Ele.matchAll(htmlNode,'html'));
        assert(Ele.tag(htmlNode) === 'html');
        assert(Str.isNotEmpty(Ele.getOuterHtml(htmlNode)));
        assert(Obj.isNotEmpty(Ele.getBoundingRect(htmlNode)));
        assert(Num.is(Ele.getDimension(htmlNode).width));
        assert(Num.is(Ele.getDimension(htmlNode).height));
        assert(Integer.round(Ele.getDimension(contentBox).width) > 40);
        assert(Ele.getDimension(borderBox).width === 25);
        assert(Pojo.length(Ele.getScroll(htmlNode)) === 4);
        assert(Pojo.is(Ele.attr(htmlNode)));
        assert(Ele.hasAttr(htmlNode,'data-error'));
        assert(!Ele.hasAttr(htmlNode,'data-errorz'));
        assert(Ele.getAttr(htmlNode,'data-error') === 'none');
        assert(Ele.getAttr(htmlNode,'data-errorz') == null);
        assert(Num.isNan(Ele.getAttr(htmlNode,'data-error','int')));
        assert(Ele.getAttr(htmlNode,'data-error','bool') === null);
        assert(Str.isNotEmpty(Ele.attrStr(htmlNode)));
        assert(Pojo.is(Ele.dataAttr(htmlNode)));
        assert(Ele.getAttr(htmlNode,'data-error') === 'none');
        assert(Str.isNotEmpty(Ele.getHtml(htmlNode)));
        assert(Str.isNotEmpty(Ele.getHtml(selectorOne)));
        assert(Ele.getHtml(divNode) === 'test <span>what</span>');
        assert(Ele.getText(divNode) === 'test what');
        assert(Ele.getProp(divNode,'textContent') === 'test what');
        assert(Ele.getProp(divNode,'textContent') === 'test what');
        assert(!Ele.hasClass(divNode,'test'));
        assert(Pojo.length(Ele.getOffset(divNode)) === 3);
        assert(Ele.getOffsetParent(divNode).left === 8);
        assert(Integer.round(Ele.getOffsetDoc(divNode).left) === 8);
        assert(Integer.round(Ele.getOffsetWin(divNode).left) === 8);
        assert(Pojo.length(Ele.getOffsetDoc(divNode)) === 2);
        Ele.setHandler(htmlNode,'what',function(value) { setData(this,'OK',value); return true; });
        assert(Ele.getData(htmlNode,'OK') == null);
        assert(!Ele.hasData(htmlNode,'test'));
        assert(Ele.setData(htmlNode,'test',2) === undefined);
        assert(Ele.hasData(htmlNode,'test'));
        assert(Ele.getData(htmlNode,'test') === 2);
        assert(Ele.flashData(htmlNode,'test') === 2);
        assert(!Ele.hasData(htmlNode,'test'));
        assert(Ele.flashData(htmlNode,'test',2) === undefined);
        assert(Pojo.isNotEmpty(Ele.allData(htmlNode)));
        assert(Func.is(Ele.getHandler(htmlNode,'what')));
        assert(Ele.isTriggerHandlerEqual([htmlNode],'what',true,'james'));
        assert(Ele.isTriggerHandlerEqual(htmlNode,'what',true,'james'));
        assert(!Ele.isTriggerHandlerEqual(htmlNode,'what',false,'james'));
        assert(Ele.getData(htmlNode,'OK') == 'james');
        assert(Ele.triggerHandler(htmlNode,'what','no') === true);
        assert(Ele.triggerHandler(htmlNode,'what','yes') === true);
        assert(Nod.getData(htmlNode,'OK') === 'yes');
        Ele.setHandler(htmlNode,'what',function() { return false; });
        assert(Ele.triggerHandler(htmlNode,'what') === false);
        Ele.removeHandler(htmlNode,'what');
        assert(Ele.getHandler(htmlNode,'what') === undefined);
        assert(Ele.is(Ele.scopedQuery(htmlNode,"body")));
        assert(Ele.scopedQuery(htmlNode,"james") == null);
        assert(Arr.isNotEmpty(Ele.scopedQueryAll(htmlNode,"body")));
        assert(Arr.isEmpty(Ele.scopedQueryAll(htmlNode,"james")));
        assert(Ele.closest(bodyNode,'html') === htmlNode);
        assert(Arr.isEqual(Ele.filter([htmlNode,bodyNode],"body"),[bodyNode]));
        assert(Ele.parent(bodyNode) === htmlNode);
        assert(Ele.parent(htmlNode) === document);
        assert(Arr.isEqual(Ele.children(htmlNode,'body'),[bodyNode]));
        assert(Arr.isEmpty(Ele.children(htmlNode,'div')));
        assert(Ele.next(submitNode,'div') === divNode);
        assert(Ele.prev(divNode) === submitNode);
        assert(Ele.prev(divNode,'span') === null);
        assert(Arr.length(Ele.nexts(submitNode)) === 1);
        assert(Arr.isEmpty(Ele.nexts(divNode)));
        assert(Arr.length(Ele.prevs(divNode)) === 4);
        assert(Arr.length(Ele.prevs(divNode,"input[type='submit']")) === 3);
        assert(Arr.length(Ele.prevs(divNode,"input[type='text']")) === 1);
        assert(Arr.length(Ele.prevs(divNode,'input',"input[type='text']")) === 3);
        Ele.setHtml(divNode,'text ok bla <span>what</span>');
        assert(Arr.length(Ele.children(divNode)) === 1);
        assert(Arr.length(Doc.children(document)) === 1); // ie va avoir besoin d'un polyfill
        assert(Arr.length(Ele.parents(divNode)) === 4);
        assert(Arr.length(Ele.parents(divNode,'body')) === 1);
        assert(Arr.length(Ele.parents(divNode,'body','html')) === 1);
        assert(Arr.isEmpty(Ele.parents(divNode,'html','body')));
        assert(Arr.isEmpty(Ele.parents(divNode,'html','html')));
        assert(Ele.is(Doc.scopedQuery(template.content,'input')));
        assert(Arr.length(formTemplate) === 1);
        assert(Pojo.length(Ele.css(borderBox,'position')) === 1);
        assert(Pojo.length(Ele.css(borderBox)) > 250);
        assert(Ele.getCss(borderBox,'height') === '25px');
        assert(Ele.getCss(borderBox,'height','int') === 25);
        assert(Ele.getCss(borderBox,'height','bool') === null);
        assert(Ele.getCss(borderBox,'margin-top') === '10px');
        assert(!Ele.hasAttr(divNode,'what'));
        Ele.setAttr(divNode,'what','ok');
        assert(Ele.hasAttr(divNode,'what'));
        assert(Ele.getAttr(divNode,'what') === 'ok');
        Ele.removeAttr(divNode,'what');
        assert(!Ele.hasAttr(divNode,'what'));
        Ele.setHtml(divNode,'what <span>ok</span>');
        assert(Ele.getHtml(divNode) === 'what <span>ok</span>');
        Ele.setText(divNode,'what <span>ok</span>');
        assert(Ele.getHtml(divNode) === 'what <span>ok</span>');
        assert(Ele.setValue(inputNode,[1,2,3]) === undefined);
        assert(inputNode.value === Ele.getValue(inputNode));
        assert(Ele.getValue(inputNode) === '[1,2,3]');
        assert(Ele.toggleClass(divNode,'test',true) === undefined);
        assert(Ele.hasClass(divNode,'test'));
        Ele.toggleClass(divNode,'test',false);
        assert(!Ele.hasClass(divNode,'test'));
        Ele.toggleClass(divNode,'test');
        assert(Ele.hasClass(divNode,'test'));
        Ele.toggleClass(divNode,'test');
        assert(!Ele.hasClass(divNode,'test'));
        assert(Ele.getHtml(template) !== newHtml);
        assert(Str.length(Ele.getHtml(template)) === 707); // ie11 ajoute border-image: none pour une raison
        assert(Ele.getCss(divNode,'margin-top') === '0px');
        Ele.setCss(divNode,'margin-top','10px');
        assert(Ele.getCss(divNode,'margin-top') === '10px');
        assert(Ele.getCss(divNode,'margin-top','int') === 10);
        assert(Ele.getCss(borderBox,'height') === '25px');
        Ele.setDimension(borderBox,20,40);
        assert(Integer.round(Ele.getDimension(borderBox).height) === 40);
        assert(Ele.getCss(borderBox,'height') === '40px');
        assert(Ele.setScroll(htmlNode,0,0) === undefined);
        Ele.setHtml(divNode,'OK');
        assert(Ele.getHtml(divNode) === 'OK');
        Ele.append(divNode,'<div>test</div>');
        assert(Ele.getHtml(divNode) === 'OK<div>test</div>');
        assert(Ele.getUri(formNode) === '/ok');
        assert(Pojo.length(Ele.propObj(formInput,'name','value')) === 4);
        assert(Ele.propStr(formInput,'name') === 'test-suite-test-submit3-test-submit2-test-submit');
        assert(Ele.propStr(formInput,'name','|') === 'test-suite|test-submit3|test-submit2|test-submit');
        assert(Ele.serialize(formInput) === 'test-suite=%5B1%2C2%2C3%5D&test-submit3=&test-submit2=&test-submit=');
        assert(Ele.getDimension(hiddenNode).width === 0);
        assert(Ele.getDimension(hiddenNode,true).width > 0);
        assert(Pojo.isEqual(Ele.getDimension(hiddenNode,'block'),Ele.getDimension(hiddenNode,true)));
        assert(Ele.getDimension(hiddenNode,'inline').width < Ele.getDimension(hiddenNode,true).width);
        assert(Ele.getDimension(hiddenNode).width === 0);
        assert(Ele.oddEven(hiddenNode,function() {
            assert(this === hiddenNode);
        }));
        
        // evt
        assert(Evt.nameFromType('ok') === 'event');
        assert(Evt.nameFromType('ok:what') === 'customEvent');
        assert(Evt.createFromType('ok') instanceof Event);
        assert(Evt.createFromType('ok:what') instanceof CustomEvent);
        
        // func
        assert(!Func.is('test'));
        assert(Func.is(noop));
        assert(Func.length(noop) === 0);
        Func.check(noop);
        Func.check(null,false);
        assert(Integer.is(Func.timeout(null,function() {
            assert(true);
        })));
        assert(Func.is(Func.debounce(2,function() {})));
        assert(Func.is(Func.throttle(2,function() {})));
        const debounceFunc = Func.debounce(1000,function(arg) {
            assert(arg === 99);
        });
        for (var i = 0; i < 100; i++) {
            debounceFunc(i);
        }
        const throttleFunc = Func.throttle(50,function(arg) {
            assert(Integer.is(arg));
        });
        for (var i = 0; i < 100; i++) {
            let arg = i;
            Func.timeout(arg,function() { throttleFunc(arg) });
        }
        
        // handler
        
        // historyState
        assert(HistoryState.is({ url: 'test', timestamp: 1234 }));
        assert(HistoryState.isChangeValid({ url: 'test', timestamp: 1234 },HistoryState.make('what','bleh')));
        assert(Obj.length(HistoryState.make('what','bleh')) === 3);
        assert(Str.isEnd("/#what",HistoryState.make('#what','bleh').url));
        assert(HistoryState.make('http://google.com/ok#','bleh').url === 'http://google.com/ok#');
        assert(HistoryState.make('http://google.com/ok#','bleh',true).url === 'http://google.com/ok');
        assert(Str.isEnd('/#',HistoryState.make("#").url));
        assert(!Str.isEnd('/#',HistoryState.make("#",null,true).url));
        
        // integer
        assert(!Integer.is('2'));
        assert(Integer.is(2));
        assert(!Integer.is(2.2));
        assert(Integer.cast(true) === null);
        assert(Integer.cast('2.3') === 2);
        assert(Integer.cast('2.6') === 2);
        assert(Integer.cast('25px') === 25);
        assert(Integer.cast(4) === 4);
        assert(Integer.cast(2.3) === 2);
        assert(Integer.cast('') === null);
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
        assert(Integer.isNotEmpty(-1));
        assert(Integer.isPositive(2));
        assert(!Integer.isPositive(0));
        assert(Integer.isPositive(0,true));
        assert(!Integer.isPositive('2'));
        assert(!Integer.isPositive(-1));
        assert(Integer.isNegative(-1));
        assert(!Integer.isNegative(0));
        assert(Integer.isNegative(0,true));
        assert(Integer.check(1) === 1);
        assert(Integer.check(0) === 0);
        assert(Integer.check(null,false) === null);
        assert(Arr.length(Integer.range(0,100,1)) === 101);
        assert(Arr.length(Integer.range(1,100,1)) === 100);
        assert(Arr.length(Integer.range(2,18,3)) === 6);
        
        // json
        assert(Json.encode({ok: 2}) === '{"ok":2}');
        assert(Pojo.isEqual(Json.decode('{"ok":2}'),{ok: 2}));
        
        // listener
        
        // nav
        assert(Nav.isFirst(0,10));
        assert(!Nav.isFirst(2,10));
        assert(Nav.hasPrev(0,10,true));
        assert(!Nav.hasPrev(0,10));
        assert(Nav.hasPrev(2,10));
        assert(Nav.hasNext(2,10));
        assert(Nav.hasNext(8,10));
        assert(!Nav.hasNext(9,10));
        assert(Nav.hasNext(9,10,true));
        assert(Nav.isLast(9,10));
        assert(!Nav.isLast(10,10));
        assert(Nav.isIndex(2,10));
        assert(!Nav.isIndex(-2,10));
        assert(Nav.getFirst(10) === 0);
        assert(Nav.getPrev(1,10) === 0);
        assert(Nav.getNext(9,10,true) === 0);
        assert(Nav.getLast(10) === 9);
        assert(Nav.getIndex(0,10) === 0);
        assert(Nav.getIndex(20,10) === null);
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
        assert(!Num.isNan(2));
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
        assert(Num.isPositive('2.2'));
        assert(!Num.isPositive('0'));
        assert(Num.isPositive('0',true));
        assert(Num.isNegative('-2.2'));
        assert(Num.check('0') === '0');
        assert(Num.check(2.1,true) === 2.1);
        assert(Num.isOdd(1));
        assert(!Num.isEven(1));
        assert(Num.isEven(2));
        assert(Num.isOdd(11));
        assert(!Num.isOdd(0));
        assert(Num.isEven(0));
        
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
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'=',' ',true) === "str='2' what='ok' loop='[1,2]' meh='{\"what\":2}'");
        assert(Obj.str({str: 2, what: 'ok', loop: [1,2], meh: { what: 2 }},'=',true,true) === "str='2' what='ok' loop='[1,2]' meh='{\"what\":2}'");
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
        assert(Pojo.is(Obj.climb(['Lemur','Test'],window)));
        assert(Obj.climb(['Lemuzr','Testz'],window) === undefined);
        
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
        assert(Pojo.valueFirst(replace) === 2);
        assert(Pojo.valueLast(replace) === replace.ok);
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
        assert(Request.absolute() !== Request.relative());
        assert(Str.isNotEmpty(Request.scheme()));
        assert(Str.is(Request.fragment()) || Request.fragment() === null);
        assert(Obj.is(Request.parse()));
        assert(Str.isNotEmpty(Request.parse().hostname));
        assert(Str.isNotEmpty(Request.schemeHost()));
        
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
        assert(Scalar.cast('2.4','int') === 2);
        assert(Scalar.cast('1','bool') === true);
        
        // selector
        
        // str
        assert(Str.is('WHAT'));
        assert(Str.is(''));
        assert(!Str.is([]));
        assert(!Str.is(null));
        assert(Str.are(['test','ok']));
        assert(Arr.length(Str.checks(['test','ok',null],false)) === 3);
        assert(Str.isStart('a','as'));
        assert(!Str.isStart(3,'3s'));
        assert(Str.isEnd('s','as'));
        assert(!Str.isEnd('a','as'));
        assert(Str.isEqual('test','test'));
        assert(Str.isEqual('2',2));
        assert(Str.isEqual(true,'true'));
        assert(Str.isEqual(undefined,''));
        assert(Str.isEqual(undefined,null));
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
        assert(Str.lower('AE') === 'ae');
        assert(Str.lowerFirst('as') === 'as');
        assert(Str.lowerFirst('As') === 'as');
        assert(Str.lowerFirst('És') === 'és');
        assert(Str.upper('ae') === 'AE');
        assert(Str.upperFirst('as') === 'As');
        assert(Str.upperFirst('As') === 'As');
        assert(Str.trim(' As ') === 'As');
        assert(Str.quote('what',true) === '"what"');
        assert(Str.quote('what') === "'what'");
        assert(Str.quote(2) === null);
        assert(Str.sub(2,true,'what') === 'at');
        assert(Str.sub(2,true,'éèà') === 'à');
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
        assert(Str.removeAllWhitespace(' ads das sda ') === 'adsdassda');
        assert(Str.toCamelCase('-','margin-top-right') === 'marginTopRight');
        assert(Str.toCamelCase(' ',' margin top right ') === 'marginTopRight');
        assert(Str.toCamelCase('_',' margin top right ') === 'margintopright');
        assert(Str.toCamelCase('-','-margin--top--right-') === 'marginTopRight');
        
        // target
        assert(Target.is(document));
        assert(Target.is(fragment));
        assert(Target.is(window));
        assert(Target.is(divNode));
        assert(Target.are([window,document]));
        assert(Target.check(fragment) === fragment);
        const arrFragment = [fragment];
        assert(Target.checks(arrFragment) === arrFragment);
        assert(Arr.length(Target.wrap(selectorAll)) === 1);
        assert(Target.wrap(arrFragment) === arrFragment);
        assert(Arr.length(Target.wrap(htmlNode)) === 1);
        assert(Nod.is(document));
        assert(!Nod.is(window));
        assert(Nod.are([document,htmlNode]));
        assert(!Nod.are([document,window]));
        
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
        assert(!Uri.isOnlyHash('what'));
        assert(Uri.isOnlyHash('#what'));
        assert(!Uri.isOnlyHash('#'));
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
        assert(Str.isEnd("#james",Uri.absolute("#james",true)));
        assert(Str.isEnd("/testok.php",Uri.absolute("testok.php")));
        assert(!Str.isEnd("#james",Uri.absolute("testok.php#james")));
        assert(Str.isEnd("#james",Uri.absolute("testok.php#james",true)));
        assert(Uri.absolute("http://google.com/testok.php") === "http://google.com/testok.php");
        assert(Uri.extension("http://google.com/ok.jpg?v=2#what") === 'jpg');
        assert(Uri.build(Uri.parse("/test.ok?t=2#hash"),false,true) === '/test.ok?t=2#hash');
        assert(Uri.build(Uri.parse("hash"),false,true) === '/hash');
        assert(Uri.build(Uri.parse("https://google.com/ok?v=2#what"),true,true) === "https://google.com/ok?v=2#what");
        assert(Uri.build(Uri.parse("https://google.com/ok?v=2#what"),true,false) === "https://google.com/ok?v=2");
        assert(Uri.build(Uri.parse("https://google.com/ok?v=2#what"),false,false) === "/ok?v=2");
        assert(Uri.build(Uri.parse("https://google.com/ok?v=2#what"),false,true) === "/ok?v=2#what");
        assert(Uri.makeHash(undefined,true) === '#');
        assert(Uri.makeHash(undefined,false) === '');
        assert(Uri.makeHash("james",true) === '#james');
        assert(Uri.makeHash("#james",true) === '#james');
        assert(Uri.makeHash("james") === 'james');
        assert(Uri.makeHash("#james") === 'james');
        assert(Uri.getMailto('mailto:test@test.com') === 'test@test.com');
        assert(Uri.getMailto('test@test.com') === 'test@test.com');
        assert(Uri.getMailto('mailto:testtest.com') === null);
        const query = Uri.query('?q=URLUtils.searchéParams&topic=api');
        const query2 = Uri.query({q: 'oké', what: 2});
        const query3 = Uri.query({q: "la vi+e est bèlle"});
        assert(query.toString() === 'q=URLUtils.search%C3%A9Params&topic=api');
        assert(query2.toString() === 'q=ok%C3%A9&what=2');
        assert(query3.toString() === 'q=la+vi%2Be+est+b%C3%A8lle');
        
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
        assert(!Vari.isReallyEmpty(0));
        assert(Vari.isNotReallyEmpty(0));
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
        assert(length >= 34);
        
        // win
        assert(Win.hasHistoryApi());
        assert(Win.is(window));
        assert(!Win.is(document));
        assert(Pojo.length(Win.getScroll()) === 4);
        assert(Win.getDimension().width > 0);
        assert(Win.getDimension().height > 0);
        assert(Win.are([window,window]));
        
        // xhr
        const formData = new FormData(formNode);
        assert(Xhr.isStatusSuccess(200));
        assert(!Xhr.isStatusSuccess(404));
        assert(!ArrLike.is(formData));
        assert(Pojo.length(Xhr.configFromNode(htmlNode)) === 4);
        assert(Pojo.length(Xhr.configFromNode(htmlNode,null,true)) === 9);
        assert(Xhr.parseError('<html><body><div>TEST</div></body></html>','error') === '<div>TEST</div>');
        assert(Xhr.parseError('<html><body><div class="ajax-parse-error"><div>TEST</div></div></body></html>','error') === '<div class="ajax-parse-error"><div>TEST</div></div>');
        assert(Xhr.parseError('') === '');
        assert(Pojo.length(Xhr.configFromString("/test/ok")) === 1);
        
        // cleanup
        Ele.remove([formNode,contentBox,contentBox,borderBox]);
    } 
    
    catch (e) 
    {
        r = false;
        logError(e);
    } 
    
    return r;
}