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

// boot
// extended abstract class for the object that bootstraps the cms
abstract class Boot extends Core\Boot
{
    // config
    public static $config = [
        'types'=>['cms'], // ajout cms comme type
        'finderShortcut'=>[ // shortcut pour finder
            'vendorLemur'=>'[vendor]/quidphp/lemur'],
        'symlink'=>[
            '[vendorLemur]/vendor'=>'[publicJs]/vendor'],
        'roles'=>[
            'editor'=>[60]],

        'compileJs'=>[
            'include'=>[
                'to'=>'[publicJs]/include.js',
                'from'=>[
                    0=>'[vendorLemur]/js/include']],
            'component'=>[
                'to'=>'[publicJs]/component.js',
                'from'=>[
                    0=>'[vendorLemur]/js/import',
                    1=>'[vendorLemur]/js/component']]],

        'compileJsOption'=>[
            'concatenator'=>[
                'start'=>"\"use strict\";\n\n(function() {\n\n",
                'end'=>"\n\n})();"]],

        '@dev'=>[
            'compileJs'=>[
                'test'=>[
                    'to'=>'[publicJs]/test.js',
                    'from'=>[
                        0=>'[vendorLemur]/js/import',
                        1=>'[vendorLemur]/js/test']]]],

        '@cms'=>[
            'service'=>[
                'polyfill'=>Service\Polyfill::class,
                'jQuery'=>Service\JQuery::class,
                'jQueryUi'=>Service\JQueryUi::class,
                'react'=>Service\React::class,
                'tinymce'=>Service\TinyMce::class],
            'option'=>[
                'versionQuid'=>true,
                'background'=>null,
                'logo'=>null],

            'compileCss'=>[
                'cms'=>[
                    'to'=>'[publicCss]/cms.css',
                    'from'=>[
                        0=>'[vendorLemur]/css/include',
                        1=>'[vendorLemur]/css/component',
                        2=>'[vendorLemur]/css/cms-mixin',
                        8=>'[vendorLemur]/css/cms']],
                'icon'=>[
                    'to'=>'[publicCss]/cms-icon.css',
                    'from'=>[
                        0=>'[vendorLemur]/css/include',
                        1=>'[vendorLemur]/css/cms-icon']],
                'tinymce'=>[
                    'to'=>'[publicCss]/cms-tinymce.css',
                    'from'=>[
                        0=>'[vendorLemur]/css/include',
                        2=>'[vendorLemur]/css/cms-tinymce']]],

            'compileJs'=>[
                'cms'=>[
                    'to'=>'[publicJs]/cms.js',
                    'from'=>[
                        0=>'[vendorLemur]/js/import',
                        1=>'[vendorLemur]/js/cms']]]]
    ];


    // isCms
    // retourne vrai si la clé de l'application roulant présentement est cms
    final public function isCms():bool
    {
        return ($this->type() === 'cms')? true:false;
    }
}

// init
Boot::__init();
?>