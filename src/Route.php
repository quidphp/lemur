<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// route
// extended abstract class for a route, adds cms logic
abstract class Route extends Core\Route
{
    // config
    public static $config = [
        '@cms'=>[
            'metaTitle'=>['typeLabel'=>true],
            'jsInit'=>'$(document).ready(function() { $(this).navigation(); });',
            'docOpen'=>[
                'head'=>[
                    'css'=>[
                        'type'=>'css/%type%.css'],
                    'js'=>[
                        'include'=>'js/include.js',
                        'type'=>'js/%type%.js']]],
            'permission'=>[
                '*'=>[
                    'popup'=>false,
                    'account'=>true,
                    'accountChangePassword'=>true,
                    'userPopup'=>true,
                    'logout'=>true,
                    'footerTypes'=>true,
                    'footerTypesCms'=>false,
                    'footerModules'=>true,
                    'bootPopup'=>true,
                    'about'=>true,
                    'homeInfo'=>true,
                    'homeInfoPopup'=>true,
                    'homeSearch'=>true],
                'subAdmin'=>['popup'=>true],
                'admin'=>['popup'=>true]
            ]]
    ];
}

// init
Route::__init();
?>