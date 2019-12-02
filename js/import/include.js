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

// event
const evtDebug = Evt.debug;
const setFunc = Evt.setFunc;
const ael = Evt.addEventListener;
const aelOnce = Evt.addEventListenerOnce;
const triggerEvent = Evt.triggerEvent;
const triggerFunc = Evt.triggerFunc;
const triggerCustom = Evt.triggerCustom;
const triggerSetup = Evt.triggerSetup;

// component
const Component = Lemur.Component;

// test
const Test = Lemur.Test;