<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Lemur;

// col
// class for testing Quid\Lemur\Col
class Col extends Base\Test
{
    // trigger
    final public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Boot::inst()->db();
        $table = 'ormCol';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name','password','email','dateAdd','userAdd','dateModify','userModify'],[1,1,'james','james','james@gmail.com',10,11,12,13],[2,2,'james2','james2','james2@gmail.com',20,21,22,23]) === [1,2]);
        $tb = $db[$table];
        $col = $tb['name'];
        $date = $tb['date'];
        $email = $tb['email'];
        $slug = $tb['slug_fr'];
        $jsonArray = $tb['json'];
        $phone = $tb['phone'];
        $lang = $tb['relationLang'];
        $dateAdd = $tb->cols()->get('dateAdd');
        $password = $tb->cols()->get('password');
        $active = $tb->cols()->get('active');
        $media = $tb['media'];
        $multi = $tb['multi'];
        $check = $tb['check'];
        $array = $tb['myRelation'];

        // isQuickEditable
        assert($col->isQuickEditable());

        // isGeneral
        assert($col->isGeneral());

        // isRelationSearchRequired
        assert(is_bool($lang->isRelationSearchRequired()));

        // panel
        assert($email->panel() === 'default');

        // specificComponent

        // onComplex

        // valueComplex
        assert($dateAdd->valueComplex(123445677) === 'November 29, 1973 13:27:57');

        // complexTag
        assert($lang->complexTag() === 'radio');
        assert($dateAdd->complexTag() === 'div');
        assert($active->complexTag() === 'checkbox');
        assert(strlen($active->formComplex()) === 204);
        assert($lang->complexTag() === 'radio');
        assert(strlen($lang->formComplex()) === 642);
        assert(strlen($lang->formComplex(3)) === 660);
        assert($media->formComplex() === "<div class='file-block empty'><div class='form'><input name='media' type='file'/></div></div>");
        assert($multi->complexTag() === 'multiselect');
        assert($check->complexTag() === 'search');
        assert(strlen($array->formComplex(null,['data-required'=>null])) === 177);
        assert(strlen($array->formComplex()) === 195);
        assert(strlen($multi->formComplex(2)) === 165);
        assert(strlen($multi->formComplex([2,5])) === 185);
        assert(strlen($password->formComplex()) === 285);
        assert($date->valueComplex('08-08-1984') === '08-08-1984');
        assert($date->valueComplex(true) === null);
        assert($date->valueComplex(mktime(0,0,0,8,8,1984)) === '08-08-1984');

        // formComplexAttr
        assert(count($dateAdd->formAttr()) === 3);
        assert(count($dateAdd->formComplexAttr()) === 0);

        // formComplex
        assert($dateAdd->formComplex() === "<div class='empty-placeholder'>NULL</div>");

        // formComplexOutput

        // formComplexNothing
        assert($dateAdd->formComplexNothing() === "<div class='nothing'>Nothing</div>");

        // formComplexEmptyPlaceholder
        assert($dateAdd->formComplexEmptyPlaceholder(null) === "<div class='empty-placeholder'>NULL</div>");
        assert($dateAdd->formComplexEmptyPlaceholder(true) === '');

        // formComplexWrap
        assert($password->formComplexWrap() !== $password->formWrap());

        // specificComponentWrap
        assert(strlen($password->specificComponentWrap('br',3)) === 395);

        // getDataAttr

        // col
        assert(count($col->attr()) === 64);
        assert(strlen($date->formComplex()) === 280);
        assert(strlen($date->formComplex('08-08-1984')) === 298);
        assert(strlen($date->formComplex(mktime(0,0,0,8,8,1984))) === 298);
        assert($email->generalExcerptMin() === null);
        assert($jsonArray instanceof Lemur\Col\JsonArray);
        assert($jsonArray->required(null) === 'required');
        assert($jsonArray->required([]) === 'required');
        assert($jsonArray->required('') === 'required');
        assert($jsonArray->completeValidation(null) === ['required']);
        assert(count($jsonArray->completeValidation([])) === 3);
        assert($jsonArray->completeValidation('') === ['required']);
        assert($jsonArray->completeValidation(Base\Json::encode(['test'])) === true);
        assert($phone instanceof Lemur\Col\Phone);
        assert($phone->get(5144839999) === '(514) 483-9999');
        assert($slug instanceof Lemur\Col\Slug);
        assert(is_array($slug->slugAttr()));
        assert($slug->slugDateConvert('date','12-05-2018') === '2018-12-05');
        assert($slug->slugDo('lol') === false);
        assert($slug->slugUnique('blabla'));
        assert($slug->slugKeyFromArr(['name'=>'james']) === 'james');
        assert($slug->slugKeyFromArr(['name_fr'=>'jamesFr','name_en'=>'jamesEn']) === 'jamesFr');
        assert($slug->slugAddNow('blabla') !== 'blabla');
        assert($slug->slugDateFirst() === 'ymd');

        return true;
    }
}
?>