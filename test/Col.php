<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;
use Quid\Suite;

// col
// class for testing Quid\Lemur\Col
class Col extends Base\Test
{
    // trigger
    public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Boot::inst()->db();
        $table = 'ormCol';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name','password','email','dateAdd','userAdd','dateModify','userModify'],[1,1,'james','james','james@gmail.com',10,11,12,13],[2,2,'james2','james2','james2@gmail.com',20,21,22,23]) === [1,2]);
        $tb = $db[$table];
        $date = $tb['date'];
        $email = $tb['email'];
        $slug = $tb['slug_fr'];
        $jsonArray = $tb['json'];
        $phone = $tb['phone'];

        // col
        assert(strlen($date->formComplex()) === 260);
        assert(strlen($date->formComplex('08-08-1984')) === 278);
        assert(strlen($date->formComplex(mktime(0,0,0,8,8,1984))) === 278);
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
        assert($phone->onGet(5144839999,[]) === '(514) 483-9999');
        assert($slug instanceof Lemur\Col\Slug);
        assert($slug->onSet('dasasd dsaasd asddas',[],null,[]) === 'dasasd dsaasd asddas');
        assert($slug->onSet(null,['name_en'=>'OK'],null,[]) === null);
        assert(is_array($slug->slugAttr()));
        assert($slug->slugDateConvert('date','12-05-2018') === '2018-12-05');
        assert($slug->slugDo('lol') === false);
        assert($slug->slugUnique('blabla'));
        assert($slug->slugKeyFromArr(['name'=>'james']) === 'james');
        assert($slug->slugKeyFromArr(['name_fr'=>'jamesFr','name_en'=>'jamesEn']) === 'jamesFr');
        assert($slug->slugAddNow('blabla') !== 'blabla');
        assert($slug->slugDateFirst() === 'ymd');

        // cols
        $table = 'ormCols';
        $tb = $db[$table];
        $cols = $tb->cols();
        assert(strlen($cols->formComplex()['date']) === 260);
        assert($cols->formComplexWrap('table')['userAdd'] === "<table><tr><td><label>Added by</label></td><td><div class='empty-placeholder'>NULL</div></td></tr></table>");

        return true;
    }
}
?>