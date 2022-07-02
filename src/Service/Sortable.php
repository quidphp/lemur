<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Service;
use Quid\Main;
use Quid\Routing;

// sortable
// class to integrate the sortable javascript library
class Sortable extends Main\Service
{
    // trait
    use Routing\_service;


    // config
    protected static array $config = [
        'github'=>'https://github.com/SortableJS/sortablejs',
        'paths'=>[
            'basename'=>'sortable.js',
            'serverFrom'=>'[vendorInclude]/src/%basename%',
            'serverTo'=>'[publicJs]/%basename%',
            'public'=>'js/%basename%']
    ];


    // docOpenJs
    // retourne le javascript à lier en début de document
    final public function docOpenJs()
    {
        return $this->getPublicPath() ?? null;
    }
}

// init
Sortable::__init();
?>