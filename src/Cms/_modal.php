<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use quid\Base;

// _modal
// trait that provides some initial configuration for CMS modal routes
trait _modal
{
    // config
    public static $configModal = [
        'match'=>array(
            'ajax'=>true),
        'group'=>'modal',
        'sitemap'=>false,
        'history'=>false
    ];


    // aDialog
    // retourne le lien dialog
    final public function aDialog($value=null,?array $attr=null):string
    {
        return $this->a(($value === null)? $this->title():$value,Base\Attr::append($attr,['data'=>['modal'=>static::name()]]));
    }
}
?>