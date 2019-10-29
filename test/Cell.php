<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Lemur;

// cell
// class for testing Quid\Lemur\Cell
class Cell extends Base\Test
{
    // trigger
    public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Boot::inst()->db();
        $table = 'ormCell';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','date','name','dateAdd','userAdd','dateModify','userModify','integer','enum','set','user_ids'],[1,time(),'james',10,2,12,13,12,5,'2,3',[2,1]],[2,time(),'james2',10,11,12,13,12,5,'2,4','2,3']) === [1,2]);
        $tb = $db[$table];
        $row = $tb[1];
        $date = $row->cell('date');
        $cell = $row->cell('name');

        // cell
        assert(strlen($date->formComplex()) === 279);
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($cell->description() === 'Name to represent the element');
        assert($cell->description('%:') === 'Name to represent the element:');
        assert($cell->getDataAttr([]) === []);
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

        return true;
    }
}
?>