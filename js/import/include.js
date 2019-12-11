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
const Handler = Lemur.Handler;
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
const debug = Debug.status.bind(Debug);
const assert = Debug.assertThrow.bind(Debug);
const logError = Debug.logError.bind(Debug);

// dom 
const getData = Dom.getData.bind(Dom);

// event
const ael = Evt.addEventListener.bind(Evt);
const aelDelegate = Evt.addDelegatedEventListener.bind(Evt);
const aelOnce = Evt.addEventListenerOnce.bind(Evt);
const rel = Evt.removeEventListener.bind(Evt);
const trigEvt = Evt.triggerEvent.bind(Evt);
const trigBubble = Evt.triggerBubble.bind(Evt);
const trigSetup = Evt.triggerSetup.bind(Evt);
const trigTeardown = Evt.triggerTeardown.bind(Evt);

// handler
const setHandler = Handler.set.bind(Handler);
const setHandlers = Handler.sets.bind(Handler);
const allHandlers = Handler.all.bind(Handler);
const trigHandler = Handler.trigger.bind(Handler);
const trigHandlers = Handler.triggers.bind(Handler);

// selector
const qs = Selector.scopedQuerySelector.bind(Selector);
const qsa = Selector.scopedQuerySelectorAll.bind(Selector);
const mergedQsa = Selector.mergedQuerySelectorAll.bind(Selector);

// vari
const each = Obj.each.bind(Obj);

// component
const Component = Lemur.Component;

// factory
const Factory = Lemur.Factory;

// test
const Test = Lemur.Test;