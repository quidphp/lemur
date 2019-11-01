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
use Quid\Test\Suite;

// row
// class for testing Quid\Lemur\Row
class Row extends Base\Test
{
    // trigger
    public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Boot::inst()->db();
        $table = 'ormRow';
        $tb = $db[$table];
        assert($db->truncate($table) instanceof \PDOStatement);
        assert($db->inserts($table,['id','active','name_en','dateAdd','userAdd','dateModify','userModify'],[1,1,'james',1521762409,2,12,2],[2,2,'james2',20,2,22,2]) === [1,2]);
        $row2 = $tb->row(2);

        // row
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