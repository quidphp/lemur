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
const Doc = Lemur.Doc;
const Dom = Lemur.Dom;
const Ele = Lemur.Ele;
const EleChange = Lemur.EleChange;
const EleHelper = Lemur.EleHelper;
const Evt = Lemur.Evt;
const Func = Lemur.Func;
const HistoryApi = Lemur.HistoryApi;
const Integer = Lemur.Integer;
const Json = Lemur.Json;
const Nav = Lemur.Nav;
const Nod = Lemur.Nod;
const Num = Lemur.Num;
const Obj = Lemur.Obj;
const Pojo = Lemur.Pojo;
const Request = Lemur.Request;
const Scalar = Lemur.Scalar;
const Selector = Lemur.Selector;
const Str = Lemur.Str;
const Target = Lemur.Target;
const Uri = Lemur.Uri;
const Validate = Lemur.Validate;
const Vari = Lemur.Vari;
const Win = Lemur.Win;
const Xhr = Lemur.Xhr;

// debug
const debug = Debug.status.bind(Debug);
const assert = Debug.assertThrow.bind(Debug);
const logError = Debug.logError.bind(Debug);

// ele
const getProp = Ele.getProp.bind(Ele);
const getAttr = Ele.getAttr.bind(Ele);
const getHtml = Ele.getHtml.bind(Ele);

// eleChange
const setProp = EleChange.setProp.bind(EleChange);
const setAttr = EleChange.setAttr.bind(EleChange);
const setHtml = EleChange.setHtml.bind(EleChange);
const toggleClass = EleChange.toggleClass.bind(EleChange);

// nod
const qs = Nod.scopedQuery.bind(Nod);
const qsa = Nod.scopedQueryAll.bind(Nod);

// target
const getData = Target.getData.bind(Target);
const setData = Target.setData.bind(Target);
const setHdlr = Target.setHandler.bind(Target);
const setHdlrs = Target.setsHandler.bind(Target);
const allHdlr = Target.allHandler.bind(Target);
const trigHdlr = Target.triggerHandler.bind(Target);
const trigHdlrs = Target.triggersHandler.bind(Target);
const ael = Target.addListener.bind(Target);
const aelDelegate = Target.addDelegatedListener.bind(Target);
const aelOnce = Target.addListenerOnce.bind(Target);
const rel = Target.removeListener.bind(Target);
const trigEvt = Target.triggerNoBubble.bind(Target);
const trigBubble = Target.triggerBubble.bind(Target);
const trigSetup = Target.triggerSetup.bind(Target);
const trigTeardown = Target.triggerTeardown.bind(Target);

// component
const Component = Lemur.Component;

// factory
const Factory = Lemur.Factory;

// test
const Test = Lemur.Test;