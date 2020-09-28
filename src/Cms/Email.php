<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// email
// class for the modal route to confirm the mailto link
class Email extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_modal;


    // config
    protected static array $config = [
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
        $data = ['mailto'=>1];
        $lang = static::lang();
        $anchor = Html::a($email,$lang->text('email/send'),['with-icon','email','data'=>$data]);

        $r .= Html::h1(static::label());
        $r .= Html::h2($email);
        $r .= Html::div($anchor,'action');

        return $r;
    }
}

// init
Email::__init();
?>