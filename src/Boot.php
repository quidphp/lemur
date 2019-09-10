<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
            '[vendorLemur]/js/jquery'=>'[publicJs]/jquery'],
        'concatenatePhp'=>[ // ajoute le namespace pour le concatenator php
            'quid'=>[
                'option'=>[
                    'namespace'=>[
                        __NAMESPACE__=>['closure'=>true],
                        Test::class=>['closure'=>false]]]]],
        '@cms'=>[
            'service'=>[
                'jQuery'=>Service\JQuery::class,
                'jQueryUi'=>Service\JQueryUi::class],
            'option'=>[
                'background'=>null,
                'logo'=>null],
            'config'=>[
                Core\Route::class=>[
                    'metaTitle'=>['typeLabel'=>true],
                    'jsInit'=>'$(document).ready(function() { $(this).navigation(); });',
                    'docOpen'=>[
                        'head'=>[
                            'css'=>[
                                'type'=>'css/%type%.css'],
                            'js'=>[
                                'include'=>'js/include.js',
                                'type'=>'js/%type%.js']],
                        'wrapper'=>['#wrapper']]],
                Core\Col::class=>[
                    'generalExcerptMin'=>100]],
            'compileScss'=>[
                '[publicCss]/cms.css'=>[
                    0=>'[vendorLemur]/scss/normalize/normalize.css',
                    1=>'[vendorLemur]/scss/include/include.scss',
                    2=>'[vendorLemur]/scss/include/component.scss',
                    3=>'[vendorLemur]/scss/cms/include.scss',
                    4=>'[scss]/cms/include.scss',
                    20=>'[vendorLemur]/scss/cms/cms.scss',
                    50=>'[scss]/cms/cms.scss']],
            'concatenateJs'=>[
                '[publicJs]/include.js'=>[
                    0=>'[vendorLemur]/js/include'],
                '[publicJs]/cms.js'=>[
                    0=>'[vendorLemur]/js/cms',
                    10=>'[js]/cms']]]
    ];


    // isCms
    // retourne vrai si la clé de l'application roulant présentement est cms
    public function isCms():bool
    {
        return ($this->type() === 'cms')? true:false;
    }
}

// config
Boot::__config();
?>