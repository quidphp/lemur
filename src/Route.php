<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// route
// extended abstract class for a route, adds cms logic
abstract class Route extends Core\Route
{
    // config
    protected static array $config = [
        '@cms'=>[
            'metaTitle'=>['typeLabel'=>true],
            'jsInit'=>'Quid.InitDoc();',
            'docOpen'=>[
                'head'=>[
                    'css'=>[
                        'type'=>'css/%type%.css',
                        'icon'=>'css/cms-icon.css'],
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
                    'comSpecific'=>true,
                    'accountChangePassword'=>true,
                    'sessionInfo'=>true,
                    'sessionPopup'=>true,
                    'sessionFakeRole'=>false,
                    'logout'=>true,
                    'backToTop'=>true,
                    'link'=>true,
                    'linkType'=>true,
                    'linkTypeCms'=>false,
                    'lang'=>true,
                    'module'=>true,
                    'cli'=>true,
                    'bootPopup'=>true,
                    'about'=>true,
                    'home'=>true,
                    'homeInfo'=>true,
                    'homePopup'=>true,
                    'homeFeed'=>true,
                    'homeFeedUser'=>true,
                    'homeOverview'=>true],
                'nobody'=>['search'=>false,'logout'=>false,'contact'=>false,'register'=>true,'resetPassword'=>true,'home'=>false],
                'shared'=>['access'=>false],
                'user'=>['access'=>false],
                'subAdmin'=>['popup'=>true,'sessionFakeRole'=>true,'userWelcome'=>true],
                'admin'=>['popup'=>true,'sessionFakeRole'=>true,'userWelcome'=>true],
                'cli'=>['cli'=>true]],
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