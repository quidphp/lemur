<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base\Html;

// _browscap
// trait with a method to generate text related to browser capabilities
trait _browscap
{
    // browscap
    // génère le html pour les capacités du browser (noscript, cookie et unsupported)
    final protected function browscap():string
    {
        $r = '';
        $lang = static::lang();
        $r .= Html::noscript($lang->text('browscap/noscript'));
        $r .= Html::div($lang->text('browscap/cookie'),'cookie-disabled');
        $r .= Html::div($lang->text('browscap/unsupported'),'unsupported-browser');

        return $r;
    }
}
?>