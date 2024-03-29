<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// boot
// extended abstract class for the object that bootstraps the cms
abstract class Boot extends Core\Boot
{
    // config
    protected static array $config = [
        'types'=>['cms'], // ajout cms comme type
        'finderShortcut'=>[ // shortcut pour finder
            'vendorJavascript'=>'[vendor]/quidphp/javascript',
            'vendorBrowser'=>'[vendor]/quidphp/browser',
            'vendorNavigation'=>'[vendor]/quidphp/navigation',
            'vendorFront'=>'[vendor]/quidphp/front',
            'vendorInclude'=>'[vendor]/quidphp/include',
            'vendorLemur'=>'[vendor]/quidphp/lemur'],
        'roles'=>[
            'editor'=>[60]],

        'compileJs'=>[
            'component'=>[
                'to'=>'[publicJs]/component.js',
                'from'=>[
                    0=>'[vendorFront]/init.js',
                    1=>'[vendorFront]/src',
                    2=>'[vendorLemur]/js/component']]],

        'compileJsOption'=>[
            'concatenator'=>[
                'start'=>"\"use strict\";\n\n(function() {\n\n",
                'end'=>"\n\n})();"]],

        '@cms'=>[
            'service'=>[
                'polyfill'=>Service\Polyfill::class,
                'navigation'=>Service\Navigation::class,
                'sortable'=>Service\Sortable::class,
                'tinymce'=>Service\TinyMce::class],
            'option'=>[
                'versionQuid'=>true,
                'background'=>null,
                'logo'=>null],

            'compileCss'=>[
                'cms'=>[
                    'to'=>'[publicCss]/cms.css',
                    'from'=>[
                        0=>'[vendorNavigation]/css',
                        1=>'[vendorFront]/css',
                        2=>'[vendorLemur]/css/cms-component',
                        8=>'[vendorLemur]/css/cms']],
                'icon'=>[
                    'to'=>'[publicCss]/cms-icon.css',
                    'from'=>[
                        0=>'[vendorNavigation]/css',
                        1=>'[vendorLemur]/css/cms-icon']],
                'tinymce'=>[
                    'to'=>'[publicCss]/cms-tinymce.css',
                    'from'=>[
                        0=>'[vendorNavigation]/css',
                        1=>'[vendorLemur]/css/cms-component',
                        3=>'[vendorLemur]/css/cms-tinymce']]],

            'compileJs'=>[
                'cms'=>[
                    'to'=>'[publicJs]/cms.js',
                    'from'=>[
                        0=>'[vendorFront]/init.js',
                        1=>'[vendorLemur]/js/cms']]]]
    ];


    // isCms
    // retourne vrai si la clé de boot est cms
    final public function isCms():bool
    {
        return $this->type() === 'cms';
    }
}
?>