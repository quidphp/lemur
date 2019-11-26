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

// table
// class for testing Quid\Lemur\Table
class Table extends Base\Test
{
    // trigger
    final public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Db::inst();
        $table = 'ormTable';
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name_en','dateAdd','userAdd','dateModify','userModify','name_fr','email','date'],[1,1,'james',10,11,12,13,'james_fr','james@james.com',123312213],[2,2,'james2',20,21,22,23,'james_fr','james@james.com',123312213]) === [1,2]);
        $tables = $db->tables();
        $tb = $db[$table];

        // hasPanel
        assert($tb->hasPanel());

        // core
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

        // cleanup
        assert($db->truncate($table) instanceof \PDOStatement);

        return true;
    }
}
?>