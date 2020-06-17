<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Lemur;

// cells
// class for testing Quid\Lemur\Cells
class Cells extends Base\Test
{
    // trigger
    final public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Boot::inst()->db();
        $table = 'ormCells';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name_en','date','dateAdd','userAdd','dateModify','userModify'],[1,0,'james',time(),10,11,12,13],[2,2,'james2',time(),20,21,22,23]) === [1,2]);
        $tb = $db[$table];
        $row = $tb[1];
        $cells = $row->cells();

        // formComplex
        assert(strlen($cells->formComplex()['active']) === 204);

        // formComplexWrap
        assert(strlen($cells->formComplexWrap()['active']) === 225);

        // specificComponentWrap
        assert(strlen($cells->specificComponentWrap()['active']) === 263);

        // cells
        assert($cells->pair('description')['id'] === 'Primary and unique key. Required');
        assert($cells->pair('description','%:')['id'] === 'Primary and unique key. Required:');
        assert($row->unlink());
        assert($db->truncate($table) instanceof \PDOStatement);

        return true;
    }
}
?>