<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Test\Suite {
use Quid\Lemur;
use Quid\Test;

// prepare
if(!class_exists(Test\Suite\BootAlias::class,false))
class_alias(Lemur\Boot::class,Test\Suite\BootAlias::class);
require dirname(__FILE__,4).'/core/test/Suite/BootCore.php';


// bootLemur
// class for booting the Quid\Lemur testsuite
class BootLemur extends Test\Suite\BootCore
{
    // config
    public static $config = [
        'typeAs'=>['assert'=>'cms'],
        'routeNamespace'=>['assert'=>[Lemur\Cms::class,Test\Suite\Assert::class]],
        'assert'=>[
            'namespaces'=>[
                Lemur::class=>Test\Lemur::class],
            'frontEnd'=>['front'=>'[vendorFront]','lemur'=>'[vendorLemur]'],
            'assertJs'=>true],
        'compile'=>true,
        'compileCss'=>false,
        'compileJsOption'=>['compress'=>false],
        'compileJs'=>[
            'test'=>[
                'to'=>'[publicJs]/test.js',
                'from'=>[
                    0=>'[vendorFront]/js/import',
                    1=>'[vendorFront]/js/test']]]
    ];
}
}


// ASSERT
namespace Quid\Test\Suite\Assert {
use Quid\Base;
use Quid\Base\Html;
use Quid\Lemur;

\Quid\Main\Autoload::setClosure("Quid\Test\Suite\Assert",'Home',function() {

// home
class Home extends Lemur\Cms\Home
{
    // config
    public static $config = [
        'selectedUri'=>false,
        'jsInit'=>'document.addEventListener("DOMContentLoaded", function() {
            const attr = [["data-success-color","data-success"],["data-failure-color","data-failure"]];
            const jsDiv = Lemur.Doc.scopedQuery(this,"#javascript");
            if(jsDiv != null)
            {
                const span = Lemur.Ele.scopedQuery(jsDiv,"span:last-child");
                const index = (Lemur.TestSuite() === true)? 0:1;
                const color = Lemur.Ele.getAttr(jsDiv,attr[index][0]);
                const text = Lemur.Ele.getAttr(jsDiv,attr[index][1]);
                Lemur.Ele.setHtml(span,text);
                Lemur.Ele.setCss(span,"color",color);
            }
        });',
        'docOpen'=>[
            'head'=>[
                'css'=>false,
                'js'=>[
                    'test'=>'js/test.js',
                    'type'=>null]]]
    ];

    // trigger
    final public function trigger()
    {
        $return = '';
        $isCli = Base\Cli::is();
        $boot = static::boot();
        $assertJs = $boot->getAttr('assert/assertJs');

        if($isCli === false)
        {
            $return .= $this->docOpen();

            if($assertJs === true)
            {
                $data = ['success'=>'Success','success-color'=>'green','failure'=>'Failure','failure-color'=>'red'];
                $return .= Html::divOp(['#javascript','data'=>$data,'style'=>['padding'=>'5px 0','border-bottom'=>'2px solid black']]);
                $return .= Html::span('JavaScript: ');
                $return .= Html::span('Idle');
                $return .= Html::divCl();
            }
        }

        $return .= $boot->outputSuite();

        if($isCli === false)
        $return .= $this->docClose();

        return $return;
    }
}
});
}
namespace Quid\Test\Suite\Assert {
use Quid\Lemur;

\Quid\Main\Autoload::setClosure("Quid\Test\Suite\Assert",'ActivatePassword',function() {

// activatePassword
class ActivatePassword extends Lemur\Cms\ActivatePassword
{
    // config
    public static $config = [
        'path'=>[
            'en'=>'activate/password/[primary]/[hash]',
            'fr'=>'activer/mot-de-passe/[primary]/[hash]']
    ];
}
});
}
namespace Quid\Test\Suite\Assert {
use Quid\Lemur;

\Quid\Main\Autoload::setClosure("Quid\Test\Suite\Assert",'Error',function() {

// error
class Error extends Lemur\Cms\Error
{
    // config
    public static $config = [];
}
});
}
namespace Quid\Test\Suite\Assert {
use Quid\Lemur;

\Quid\Main\Autoload::setClosure("Quid\Test\Suite\Assert",'Sitemap',function() {

// sitemap
class Sitemap extends Lemur\Cms\Sitemap
{
    // config
    public static $config = [];
}
});
}


// CMS
namespace Quid\Test\Suite\Cms {
use Quid\Core;

\Quid\Main\Autoload::setClosure("Quid\Test\Suite\Cms",'System',function() {

// system
class System extends Core\Route
{
    // config
    public static $config = [
        'type'=>'cms',
        'user'=>'extended',
        'group'=>'module'
    ];


    // trigger
    public function trigger():string
    {
        return '';
    }
}
});
}
namespace Quid\Test\Suite\Row {
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;
use Quid\Test\Suite;

\Quid\Main\Autoload::setClosure("Quid\Test\Suite\Row",'OrmCol',function() {

// ormCol
class OrmCol extends Lemur\Row
{
    // config
    public static $config = [
        'cols'=>[
            'wysiwyg'=>['class'=>Lemur\Col\TinyMce::class],
            'other'=>['relation'=>[2,3,4]],
            'password'=>['class'=>Core\Col\UserPassword::class],
            'myRelation'=>['relation'=>['test',3,4,9=>'ok']],
            'relationRange'=>['relation'=>['min'=>0,'max'=>20,'inc'=>2],'editable'=>false],
            'relationStr'=>['relation'=>[0=>'test','what'=>'james','lol'=>'ok']],
            'relationLang'=>['complex'=>'radio','relation'=>'test'],
            'relationCall'=>['relation'=>[self::class,'testCall']],
            'rangeInt'=>['relation'=>8],
            'multi'=>['complex'=>'multiselect','set'=>true,'relation'=>'test'],
            'check'=>['set'=>true,'relation'=>['min'=>0,'max'=>20,'inc'=>2]],
            'user_ids'=>['class'=>Suite\Col\UserIds::class],
            'json'=>['class'=>Lemur\Col\JsonArray::class,'required'=>true],
            'medias'=>['media'=>6],
            'media'=>['version'=>[
                'small'=>[50,'jpg','crop',300,200],
                'large'=>[70,'jpg','ratio_y',500,400]]],
            'email'=>['description'=>'Ma description']]
    ];


    // testCall
    final public static function testCall(Orm\ColRelation $relation):array
    {
        return ['test','test2','test3'];
    }
}
});
}
namespace Quid\Test\Suite\Row {
use Quid\Lemur;
use Quid\Test\Suite;

\Quid\Main\Autoload::setClosure("Quid\Test\Suite\Row",'User',function() {

// user
class User extends Lemur\Row\UserAlias
{
    // config
    public static $config = [
        'emailModel'=>[
            'resetPassword'=>'resetPassword',
            'registerConfirm'=>'registerConfirm'],
        'crypt'=>[
            'passwordHash'=>['options'=>['cost'=>4]]],
        'permission'=>[
            '*'=>['assertLogin'=>false],
            'user'=>['assertLogin'=>true],
            'editor'=>['assertLogin'=>true],
            'admin'=>['assertLogin'=>true]]
    ];


    // activatePasswordRoute
    public function activatePasswordRoute():string
    {
        return Suite\Assert\ActivatePassword::class;
    }
}
});
}

// init
namespace Quid\Test\Suite {
return [BootLemur::class,'start'];
}
?>