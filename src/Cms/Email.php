<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// email
// modal route to confirm the mailto link
class Email extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_modal;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'courriel',
            'en'=>'email'],
        'match'=>[
            'query'=>['v'=>'email']]
    ];


    // email
    // retourne le email
    final protected function email():string
    {
        return $this->request()->getQuery('v');
    }


    // trigger
    // html pour la page email
    final public function trigger()
    {
        return $this->output();
    }


    // output
    // génère le output du modal
    final protected function output():string
    {
        $r = '';
        $email = $this->email();

        $r .= Html::h1(static::label());
        $r .= Html::h2($email);

        $r .= Html::divOp('action');
        $data = ['mailto'=>1];
        $r .= Html::a($email,static::langText('email/send'),['with-icon','email','data'=>$data]);
        $r .= Html::divCl();

        return $r;
    }
}

// init
Email::__init();
?>