/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// include
const Arr = Lemur.Arr;
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
const Json = Lemur.Json;
const Nav = Lemur.Nav;
const Num = Lemur.Num;
const Obj = Lemur.Obj;
const Request = Lemur.Request;
const Scalar = Lemur.Scalar;
const Selector = Lemur.Selector;
const Str = Lemur.Str;
const Uri = Lemur.Uri;
const Validate = Lemur.Validate;
const Vari = Lemur.Vari;
const Xhr = Lemur.Xhr;

// debug
const assert = Debug.assertThrow;
const logError = Debug.logError;

// dom 
const getData = Dom.getData;

// event
const evtDebug = Evt.debug;
const setFunc = Evt.setFunc;
const removeFunc = Evt.removeFunc;
const allFunc = Evt.allFunc;
const ael = Evt.addEventListener;
const aelDelegate = Evt.addDelegatedEventListener;
const aelOnce = Evt.addEventListenerOnce;
const rel = Evt.removeEventListener;
const triggerEvent = Evt.triggerEvent;
const triggerBubble = Evt.triggerBubble;
const triggerSetup = Evt.triggerSetup;
const triggerFunc = Evt.triggerFunc;

// selector
const qsa = Selector.scopedQuerySelectorAll;
const qs = Selector.scopedQuerySelector;

// vari
const each = Vari.each;

// component
const Component = Lemur.Component;

// test
const Test = Lemur.Test;