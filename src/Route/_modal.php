<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Route;
use Quid\Base;

// _modal
// trait that provides some initial configuration for modal routes
trait _modal
{
    // config
    public static $configModal = [
        'match'=>[
            'ajax'=>true],
        'group'=>'modal',
        'sitemap'=>false,
        'history'=>false
    ];


    // aDialog
    // retourne le lien dialog
    final public function aDialog($value=null,$attr=null):string
    {
        return $this->a(($value === null)? $this->title():$value,Base\Attr::append($attr,['data'=>['modal'=>static::name(true)]]));
    }
}
?>