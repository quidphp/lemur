/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// create objets with prototype extension

// bool
const Bool = Object.create(Type);
Object.assign(Bool,BoolPrimitive);
Lemur.Bool = Bool;

// scalar
const Scalar = Object.create(Type);
Object.assign(Scalar,ScalarPrimitive);
Lemur.Scalar = Scalar;

// num
const Num = Object.create(Type);
Object.assign(Num,NumPrimitive);
Lemur.Num = Num;

// integer
const Integer = Object.create(Type);
Object.assign(Integer,NumPrimitive,IntegerPrimitive);
Lemur.Integer = Integer;

// str
const Str = Object.create(Type);
Object.assign(Str,ObjBase,ObjKeyValue,ObjEach,StrPrimitive);
Lemur.Str = Str;

// obj
const Obj = Object.create(Type);
Object.assign(Obj,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ObjWrite);
Lemur.Obj = Obj;

// pojo
const Pojo = Object.create(Type);
Object.assign(Pojo,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ObjWrite,ObjWriteSelf,PojoObj);
Lemur.Pojo = Pojo;

// func
const Func = Object.create(Type);
Object.assign(Func,ObjBase,FuncObj);
Lemur.Func = Func;

// arr
const Arr = Object.create(Type);
Object.assign(Arr,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ObjWrite,ObjWriteSelf,ArrRead,ArrWrite);
Lemur.Arr = Arr;

// arrLike
const ArrLike = Object.create(Type);
Object.assign(ArrLike,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ArrRead,ArrLikeRead);
Lemur.ArrLike = ArrLike;