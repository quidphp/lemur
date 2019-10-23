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

// db
// class for testing db
class Db extends Base\Test
{
    // trigger
    public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Boot::inst()->db();

        // table
        $table = 'ormTable';
        $tb = $db[$table];
        assert($tb->routeAttr() === [Lemur\Cms\Specific::class,'general'=>Lemur\Cms\General::class,'cms'=>Lemur\Cms\Specific::class]);
        assert($tb->routeAttr(0) === Lemur\Cms\Specific::class);
        assert($tb->routeAttr('general') === Lemur\Cms\General::class);
        assert($tb->hasPermission('lemurUpdate'));
        assert(!$tb->hasPermission('insert','update','duplicate'));
        $array = ['test'=>Base\Str::loremIpsum(30)];
        $sql = Lemur\Row\LogSql::log('insert',$array);
        assert(!$sql['json']->isInvalidValue());
        $array = ['test'=>Base\Str::loremIpsum(3000)];
        $tooLong = Lemur\Row\LogSql::log('insert',$array);
        assert($tooLong['json']->isInvalidValue());
        
        // col
        $table = 'ormCol';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name','password','email','dateAdd','userAdd','dateModify','userModify'],[1,1,'james','james','james@gmail.com',10,11,12,13],[2,2,'james2','james2','james2@gmail.com',20,21,22,23]) === [1,2]);
        $tb = $db[$table];
        $date = $tb['date'];
        $email = $tb['email'];
        $slug = $tb['slug_fr'];
        $jsonArray = $tb['json'];
        $phone = $tb['phone'];
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

        // cell
        $table = 'ormCell';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','date','name','dateAdd','userAdd','dateModify','userModify','integer','enum','set','user_ids'],[1,time(),'james',10,2,12,13,12,5,'2,3',[2,1]],[2,time(),'james2',10,11,12,13,12,5,'2,4','2,3']) === [1,2]);
        $tb = $db[$table];
        $row = $tb[1];
        $date = $row->cell('date');
        $cell = $row->cell('name');
        assert(strlen($date->formComplex()) === 279);
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($cell->description() === 'Name to represent the element');
        assert($cell->description('%:') === 'Name to represent the element:');
        assert($row->unlink());
        assert($db->truncate($table) instanceof \PDOStatement);

        // cells
        $table = 'ormCells';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name_en','date','dateAdd','userAdd','dateModify','userModify'],[1,0,'james',time(),10,11,12,13],[2,2,'james2',time(),20,21,22,23]) === [1,2]);
        $tb = $db[$table];
        $row = $tb[1];
        $cells = $row->cells();
        assert($cells->description()['id'] === 'Primary and unique key. Required');
        assert($cells->description('%:')['id'] === 'Primary and unique key. Required:');
        assert(strlen($cells->formComplex()['active']) === 204);
        assert(strlen($cells->formComplexWrap()['active']) === 225);
        assert($row->unlink());
        assert($db->truncate($table) instanceof \PDOStatement);

        // row
        $table = 'ormRow';
        $tb = $db[$table];
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name_en','dateAdd','userAdd','dateModify','userModify'],[1,1,'james',1521762409,2,12,2],[2,2,'james2',20,2,22,2]) === [1,2]);
        $row2 = $tb->row(2);
        assert($row2->routeAttr('contact') === Suite\Assert\Contact::class);
        assert($row2->routeSafe() instanceof Core\Route);
        assert($row2->route() instanceof Core\Route);
        assert($row2->route() !== $row2->route());
        assert($row2->route('contact')->uriRelative() === '/en/contact');
        assert($row2->routeClass('contact') === Suite\Assert\Contact::class);
        assert($row2->unlink());
        assert($db->truncate($table) instanceof \PDOStatement);

        return true;
    }
}
?>