/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// include
const Arr = Lemur.Arr;
const ArrLike = Lemur.ArrLike;
const Bool = Lemur.Bool;
const Browser = Lemur.Browser;
const Datetime = Lemur.Datetime;
const Debug = Lemur.Debug;
const Dom = Lemur.Dom;
const DomChange = Lemur.DomChange;
const Evt = Lemur.Evt;
const Func = Lemur.Func;
const HistoryApi = Lemur.HistoryApi;
const Html = Lemur.Html;
const Integer = Lemur.Integer;
const Json = Lemur.Json;
const Nav = Lemur.Nav;
const Num = Lemur.Num;
const Obj = Lemur.Obj;
const Pojo = Lemur.Pojo;
const Request = Lemur.Request;
const Scalar = Lemur.Scalar;
const Selector = Lemur.Selector;
const Str = Lemur.Str;
const Uri = Lemur.Uri;
const Validate = Lemur.Validate;
const Vari = Lemur.Vari;
const Xhr = Lemur.Xhr;

// debug
const assert = Debug.assertThrow.bind(Debug);
const logError = Debug.logError.bind(Debug);

// dom 
const getData = Dom.getData.bind(Dom);

// event
const evtDebug = Evt.debug.bind(Evt);
const setFunc = Evt.setFunc.bind(Evt);
const removeFunc = Evt.removeFunc.bind(Evt);
const allFunc = Evt.allFunc.bind(Evt);
const ael = Evt.addEventListener.bind(Evt);
const aelDelegate = Evt.addDelegatedEventListener.bind(Evt);
const aelOnce = Evt.addEventListenerOnce.bind(Evt);
const rel = Evt.removeEventListener.bind(Evt);
const triggerEvent = Evt.triggerEvent.bind(Evt);
const triggerBubble = Evt.triggerBubble.bind(Evt);
const triggerInit = Evt.triggerInit.bind(Evt);
const triggerSetup = Evt.triggerSetup.bind(Evt);
const triggerFunc = Evt.triggerFunc.bind(Evt);

// selector
const qsa = Selector.scopedQuerySelectorAll.bind(Selector);
const qs = Selector.scopedQuerySelector.bind(Selector);

// vari
const each = Obj.each.bind(Obj);

// component
const Component = Lemur.Component;

// test
const Test = Lemur.Test;