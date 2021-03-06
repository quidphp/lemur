<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base;

// _modal
// trait that provides some initial configuration for modal routes
trait _modal
{
    // config
    protected static array $configModal = [
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
        $title = ($value === null)? $this->title():$value;
        $attr = Base\Attr::append($attr,['data'=>['modal'=>static::name(true)]]);
        return $this->a($title,$attr);
    }
}
?>