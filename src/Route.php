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
            'jsInit'=>'$(document).ready(function() { quid.core.document.call(this); });',
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
                    'sessionInfo'=>true,
                    'sessionPopup'=>true,
                    'sessionFakeRole'=>false,
                    'logout'=>true,
                    'footerLink'=>true,
                    'footerLinkType'=>true,
                    'footerLinkTypeCms'=>false,
                    'footerLang'=>true,
                    'footerModule'=>true,
                    'footerCli'=>true,
                    'footerAuthor'=>true,
                    'bootPopup'=>true,
                    'about'=>true,
                    'homeInfo'=>true,
                    'homePopup'=>true,
                    'homeSearch'=>true],
                'nobody'=>['access'=>false],
                'shared'=>['access'=>false],
                'user'=>['access'=>false],
                'subAdmin'=>['popup'=>true],
                'admin'=>['popup'=>true,'sessionFakeRole'=>true]
            ]]
    ];
}

// init
Route::__init();
?>