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
use Quid\Test;

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
            'include'=>array(
                'to'=>'[publicJs]/include.js',
                'from'=>array(
                    0=>'[vendorLemur]/js/include')),
            'component'=>array(
                'to'=>'[publicJs]/component.js',
                'from'=>array(
                    0=>'[vendorLemur]/js/component'))],
        
        'compileJsOption'=>array(
            'concatenator'=>array(
                'start'=>"\"use strict\";\n\n(function() {\n\n",
                'end'=>"\n\n})();")),
    
        '@dev'=>[
            'compileJs'=>[
                'test'=>[
                    'to'=>'[publicJs]/test.js',
                    'from'=>array(0=>'[vendorLemur]/js/test')]]],
                    
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
                'cms'=>array(
                    'to'=>'[publicCss]/cms.css',
                    'from'=>array(
                        0=>'[vendorLemur]/css/include',
                        1=>'[vendorLemur]/css/component',
                        2=>'[vendorLemur]/css/import',
                        10=>'[vendorLemur]/css/cms')),
                'icon'=>array(
                    'to'=>'[publicCss]/icon.css',
                    'from'=>array(
                        0=>'[vendorLemur]/css/include',
                        1=>'[vendorLemur]/css/icon')),
                'tinymce'=>array(
                    'to'=>'[publicCss]/tinymce.css',
                    'from'=>array(
                        0=>'[vendorLemur]/css/include',
                        1=>'[vendorLemur]/css/tinymce'))],
                        
            'compileJs'=>array(
                'cms'=>array(
                    'to'=>'[publicJs]/cms.js',
                    'from'=>array(
                        0=>'[vendorLemur]/js/cms')))]
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