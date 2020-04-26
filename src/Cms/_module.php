<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;

// _module
// trait that provides some initial configuration for a CMS module route
trait _module
{
    // trait
    use _page;


    // config
    public static array $configModule = [
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