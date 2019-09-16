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
use Quid\TestSuite;

// table
// class for testing table
class Table extends Base\Test
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
        assert(is_array($tb->permission('colPopup')));

        // col
        $table = 'ormCol';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name','password','email','dateAdd','userAdd','dateModify','userModify'],[1,1,'james','james','james@gmail.com',10,11,12,13],[2,2,'james2','james2','james2@gmail.com',20,21,22,23]) === [1,2]);
        $tb = $db[$table];
        $date = $tb['date'];
        $email = $tb['email'];
        assert(strlen($date->formComplex()) === 260);
        assert(strlen($date->formComplex('08-08-1984')) === 278);
        assert(strlen($date->formComplex(mktime(0,0,0,8,8,1984))) === 278);
        assert($email->generalExcerptMin() === null);

        // cols
        $table = 'ormCols';
        $tb = $db[$table];
        $cols = $tb->cols();
        assert(strlen($cols->formComplex()['date']) === 260);
        assert($cols->formComplexWrap('table')['userAdd'] === "<table><tr><td><label>Added by</label></td><td><div class='nothing'>Nothing</div></td></tr></table>");

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
        assert(strlen($cells->formComplex()['active']) === 175);
        assert(strlen($cells->formComplexWrap()['active']) === 196);
        assert($row->unlink());
        assert($db->truncate($table) instanceof \PDOStatement);

        // row
        $table = 'ormRow';
        $tb = $db[$table];
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name_en','dateAdd','userAdd','dateModify','userModify'],[1,1,'james',1521762409,2,12,2],[2,2,'james2',20,2,22,2]) === [1,2]);
        $row2 = $tb->row(2);
        assert($row2->routeAttr('contact') === TestSuite\Assert\Contact::class);
        assert($row2->routeSafe() instanceof Core\Route);
        assert($row2->route() instanceof Core\Route);
        assert($row2->route() !== $row2->route());
        assert($row2->route('contact')->uriRelative() === '/en/contact');
        assert($row2->routeClass('contact') === TestSuite\Assert\Contact::class);
        assert($row2->unlink());
        assert($db->truncate($table) instanceof \PDOStatement);

        return true;
    }
}
?>