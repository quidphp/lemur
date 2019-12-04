<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
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
            'jsInit'=>'$(document).ready(function() { Lemur.Evt.triggerSetup(Lemur.Component.Doc.call(this)); });',
            'docOpen'=>[
                'head'=>[
                    'css'=>[
                        'type'=>'css/%type%.css',
                        'icon'=>'css/icon.css'],
                    'js'=>[
                        'include'=>'js/include.js',
                        'component'=>'js/component.js',
                        'type'=>'js/%type%.js']]],
            'permission'=>[
                '*'=>[
                    'register'=>false,
                    'resetPassword'=>false,
                    'userWelcome'=>false,
                    'popup'=>false,
                    'account'=>true,
                    'contact'=>true,
                    'search'=>true,
                    'accountChangePassword'=>true,
                    'sessionInfo'=>true,
                    'sessionPopup'=>true,
                    'sessionFakeRole'=>false,
                    'logout'=>true,
                    'link'=>true,
                    'linkType'=>true,
                    'linkTypeCms'=>false,
                    'lang'=>true,
                    'module'=>true,
                    'cli'=>true,
                    'bootPopup'=>true,
                    'about'=>true,
                    'homeInfo'=>true,
                    'homePopup'=>true,
                    'homeFeed'=>true,
                    'homeOverview'=>true],
                'nobody'=>['search'=>false,'logout'=>false,'contact'=>false,'register'=>true,'resetPassword'=>true],
                'shared'=>['access'=>false],
                'user'=>['access'=>false],
                'subAdmin'=>['popup'=>true,'sessionFakeRole'=>true,'userWelcome'=>true],
                'admin'=>['popup'=>true,'sessionFakeRole'=>true,'userWelcome'=>true]],
        '@dev'=>[
            'docOpen'=>[
                'head'=>[
                    'js'=>[
                        'test'=>'js/test.js']]],
        ]]
    ];
}

// init
Route::__init();
?>