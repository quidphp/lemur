<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base\Html;

// _browscap
// trait that provides a method for generating text for the browser capabilities 
trait _browscap
{
    // browscap
    // génère le html pour les capacités du browser (noscript et cookie)
    final protected function browscap():string
    {
        $r = '';
        $r .= Html::noscript(static::langText('browscap/noscript'));
        $r .= Html::div(static::langText('browscap/cookie'),'cookie-disabled');
        $r .= Html::div(static::langText('browscap/unsupported'),'unsupported-browser');
        
        return $r;
    }
}
?>