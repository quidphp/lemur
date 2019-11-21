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

// db
// class for testing Quid\Lemur\Db
class Db extends Base\Test
{
    // trigger
    final public static function trigger(array $data):bool
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

        return true;
    }
}
?>