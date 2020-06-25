<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;

// _module
// trait that provides some initial configuration for a CMS module route
trait _module
{
    // trait
    use _page;


    // config
    protected static array $configModule = [
        'match'=>[
            'role'=>['>='=>'admin']],
        'response'=>[
            'timeLimit'=>30],
        'group'=>'module',
        'sitemap'=>false,
        'navigation'=>false,
        'ignore'=>false
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('module');
    }
}
?>