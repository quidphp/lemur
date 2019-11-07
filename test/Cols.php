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

// cols
// class for testing Quid\Lemur\Cols
class Cols extends Base\Test
{
    // trigger
    final public static function trigger(array $data):bool
    {
        // prepare
        $db = Lemur\Boot::inst()->db();
        $table = 'ormCols';
        $tb = $db[$table];
        $cols = $tb->cols();

        // formComplex

        // formComplexWrap

        // cols
        assert(strlen($cols->formComplex()['date']) === 260);
        assert($cols->formComplexWrap('table')['userAdd'] === "<table><tr><td><label>Added by</label></td><td><div class='empty-placeholder'>NULL</div></td></tr></table>");

        return true;
    }
}
?>