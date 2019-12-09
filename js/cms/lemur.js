/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// lemur
// script of common behaviours for all pages of the CMS

// ready
$(document).ready(function() {
	
    // initial mount
    // comportements bindés une seule fois au tout début
    ael(this,'doc:mountInitial',function(event,body) {
        const background = qs(body,"> .background");
        const modal = qs(body,"> .modal");
        
        triggerSetup(Component.Background.call(background));
        triggerSetup(Component.Modal.call(modal));
    });
    
    
    // doc:mountCommon
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    ael(this,'doc:mountCommon',function(event,node) {
        
        // input
        const input = qsa(node,Selector.input());
        Component.Input.call(input);

        // form
        const form = qsa(node,"form");
        triggerEvent(Component.Form.call(form),'component:setup');

        // autre
        const anchorCorner = qsa(node,"[data-anchor-corner='1']");
        const absolutePlaceholder = qsa(node,"[data-absolute-placeholder='1']");
        const aConfirm = qsa(node,"a[data-confirm]");
        const popupTrigger = qsa(node,".popup-trigger.with-popup:not(.with-ajax)");
        const popupTriggerAjax = qsa(node,".popup-trigger.with-popup.with-ajax");
        
        // anchorCorner
        triggerSetup(Component.AnchorCorner.call(anchorCorner));
        
        // absolutePlaceholder
        triggerSetup(Component.AbsolutePlaceholder.call(absolutePlaceholder));
        
        // aConfirm
		Component.Confirm.call(aConfirm,'click');
        
        // popupTrigger
        triggerSetup(Component.ClickOpenTrigger.call(popupTrigger,{trigger: ".popup-title", target: ".popup"}));
        
        // popupTriggerAjax
        triggerSetup(Component.ClickOpenAjaxAnchor.call(popupTriggerAjax,{trigger: ".popup-title", target: ".popup"}));
        
        /*
        // select
        const select = qsa(node,"select");
        triggerSetup(Component.fakeSelect.call(select));
        */
	});
    
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	ael(this,'doc:mount',function(event,routeWrap) {
		const burger = qsa(routeWrap,"header .burger-menu, .nav-fixed .nav-close");
		const com = qs(routeWrap,"main > .inner > .com");
        const subMenu = qsa(routeWrap,".with-submenu");
        const carousel = qsa(routeWrap,".with-carousel");
        const mainSearch = qs(routeWrap,"header .top form");
        
        // burger
        triggerSetup(Component.Burger.call(burger));
        
        // com
		triggerSetup(Component.Com.call(com));
        
        // carousel
        triggerSetup(Component.Carousel.call(carousel,{trigger: ".trigger", target: ".target"}));
        
        // subMenu
        triggerSetup(Component.ClickOpenTrigger.call(subMenu,{trigger: ".trigger", target: ".popup"}));
        setFunc(subMenu,'clickOpen:getBackgroundFrom',function(event) {
            return 'submenu';
        });
        
        // mainSearch
        triggerSetup(Component.SearchAutoInfo.call(mainSearch,{target: ".popup"}));
	});
    
    
    // document unmount
    ael(this,'doc:unmount',function(event,routeWrap) {
        const burger = qsa(routeWrap,"header .burger-menu, .nav-fixed .nav-close");
        
        // burger
        triggerEvent(burger,'component:teardown');
    });
    
    
    // document ajax progress
    ael(this,'doc:ajaxProgress',function(event,percent,progressEvent) {
        /*
        const body = qs(this,"body");
        const progress = qs(body,".loading-progress");
        const html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
        progress.html(html);
        */
    });
    
    
    // login
    // comportement pour la page login
	ael(this,'route:login',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	ael(this,'route:resetPassword',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// register
    // comportement pour la page enregistrement
	ael(this,'route:register',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
    // changePassword
    // comportement pour le popup changer mon mot de passe
	ael(this,'modal:accountChangePassword',function(event,modal) {
		const form = qs(modal,"form");
        triggerFunc(form,'form:focusFirst');
	});
    
    
    // home
    // comportement pour la page d'accueil du CMS une fois connecté
	ael(this,'route:home',function(event,routeWrap) {
        
        const feed = qs(routeWrap,"main .home-feed");
        const feedTogglers = qsa(feed,".block-head .feed-togglers > a");
        const feedBody = qs(feed,".block-body");
        
        // feedBody
        triggerSetup(Component.Feed.call(feedBody));
        
        // feedTogglers
        Component.AjaxBlock.call(feedTogglers);
        
        setFunc(feedTogglers,'ajaxBlock:getStatusNode',function(event) {
            return feedBody;
        });
        
        ael(feedTogglers,'ajaxBlock:before',function(event) {
            $(feedTogglers).removeClass('selected');
            $(this).addClass('selected');
        });
        
        ael(feedTogglers,'ajaxBlock:success',function(event) {
            triggerEvent(feedBody,'feed:bind');
        });
	});
    
    
    // general
    // comportement pour la page de navigation
	ael(this,'route:general',function(event,routeWrap) {
		
        const main = qsa(routeWrap,"main");
        const scroller = qs(main,".scroller");
		const search = qs(main,".left > .search");
		const pageLimit = qsa(main,"input[name='limit'],input[name='page']");
        const table = qs(scroller,"table");
        const filter = qsa(table,"th.filterable .filter-outer");
		const colsSorter = qs(table,"th.action");
		const filesSlider = qsa(table,"td[data-group='media'] .slider");
        const quickEdit = qsa(table,"td[data-quick-edit='1'] a.quick-edit");
        const highlight = qsa(table,"tr.highlight");
        
        // page + limit
        Component.InputNumeric.call(pageLimit);
        
        // search
		triggerSetup(Component.SearchSlide.call(search,{inputTarget: "> .form input[type='text']", infoTarget: "> .in"}));
        
        /*
        // dragScroll
        triggerSetup(Component.scrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}));
        
        // rowsChecker
        triggerSetup(Component.rowsChecker.call(main));
        
		// colsSorter
        Component.colsSorter.call(colsSorter);
		triggerEvent(colsSorter,'component:setup');
        
        // filter
		triggerSetup(Component.filter.call(filter));
        
        // filesSlider
        Component.slider.call(filesSlider,null,null,'.slider-element',false);
        
        // quickEdit
        triggerSetup(Component.quickEdit.call(quickEdit));
        
        // highlight 
        ael(highlight,'mouseover',function(event) {
            $(this).removeClass('highlight');
        });
        */
	});
    
    
    // unmount
    ael(this,'route:general:unmount',function(event,routeWrap) {
        /*
        const table = qs(routeWrap,"main .scroller table");
        const quickEdit = qsa(table,"td[data-quick-edit='1'] a.quick-edit");
        
        // quickEdit
        triggerEvent(quickEdit,'quickEdit:revert');
        */
    });
    
    
    // specificForm mount
    // permet de faire tous les bindings des champs (simples et complexes)
    ael(this,'specificForm:mount',function(event,node) {
        triggerEvent(this,'specificForm:bindMount',node);
        triggerEvent(this,'specificForm:bindView',node);
    });
    
    
    // bindView
    // permet de faire les bindings de champs
    // ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
    ael(this,'specificForm:bindView',function(event,node) {
        /*
        const date = qsa(node,"[data-group='date'] .specific-component");
        const enumSet = qsa(node,"[data-tag='search'] .specific-component");
        const checkboxSortable = qsa(node,"[data-group='relation'][data-sortable='1'] .specific-component");
        const files = qsa(node,"[data-group='media'] .specific-component");
        const addRemove = qsa(node,"[data-tag='add-remove'] .specific-component");
        const textarea = qsa(node,"[data-tag='textarea'] .specific-component");
        const anchorCorner = qsa(node,"[data-anchor-corner]");
        
        // date
        triggerSetup(Component.calendarInput.call(date));
        
        // enumSet
        Component.enumSet.call(enumSet);
        
        // checkboxSortable
        Component.verticalSorter.call(checkboxSortable,".choice",'.choice-in');
        
        // files
        triggerSetup(Component.inputFiles.call(files));
        
        // addRemove
        triggerSetup(Component.addRemove.call(addRemove));
        
        // textarea
        triggerSetup(Component.textareaExtra.call(textarea));
        
        // anchorCorner
        triggerFunc(anchorCorner,'anchorCorner:refresh');
        */
    });
    
    
    // specificForm unmount
    // permet démonter les champs du formulaire
    ael(this,'specificForm:unmount',function(event,node) {
        /*
        const textarea = qsa(node,"[data-tag='textarea'] .specific-component");
        triggerEvent(textarea,'component:teardown');
        */
    });
    
    
	// specific
    // comportement communs pour les pages spécifiques
	ael(this,'group:specific',function(event,routeWrap) {
        /*
        const form = qs(routeWrap,"main .inner > form.specific-form");
        const panel = qsa(form,"> .form-inner > .panel");
        const submitConfirm = qsa(form,"button[type='submit'][data-confirm]");
        
		// submitConfirm
        Component.confirm.call(submitConfirm,'click');
		
        // champs simples
        triggerEvent(this,'specificForm:bindMount',form);
        
        // avec panel
        if(panel.length > 1)
        Component.specificPanel.call(form);
        
        else
        triggerEvent(this,'specificForm:bindView',form);
        */
	});
	
    
    // unmount
    // comportements communs pour démonter la page spécifique
    ael(this,'group:specific:unmount',function(event,routeWrap) {
        /*
        const form = qs(routeWrap,"main .inner > form.specific-form");
        triggerEvent(this,'specificForm:unmount',form);
        */
    });
    
    
    // specificMulti
    // comportement pour la page de modification multiple
	ael(this,'route:specificMulti',function(event) {
        /*
        const form = qs(this,"main .inner > form.specific-form");
        const formElement = qsa(form,".form-element");
        
        setFunc(formElement,'specificMulti:isActive',function(event) {
            const checkbox = triggerFunc(this,'specificMulti:getCheckbox');
            return $(checkbox).is(':checked');
        });
        
        setFunc(formElement,'specificMulti:getCheckbox',function(event) {
            return qs(this,".disabler input[type='checkbox']");
        });
        
        setFunc(formElement,'specificMulti:getInputs',function(event) {
            const right = qs(this,"> .right");
            return qsa(right,Selector.input());
        });
        
        ael(formElement,'specificMulti:refresh',function(event) {
            const isActive = triggerFunc(this,'specificMulti:isActive');
            const inputs = triggerFunc(this,'specificMulti:getInputs');
            $(this).attr('data-disabled',(isActive === true)? 0:1);
            triggerEvent(inputs,(isActive === true)? 'input:enable':'input:disable');
        });
        
        aelOnce(formElement,'specificMulti:setup',function(event) {
            const $this = $(this);
            const checkbox = triggerFunc(this,'specificMulti:getCheckbox');
            
            ael(checkbox,'change',function(event) {
                triggerEvent($this,'specificMulti:refresh');
            });
            
            triggerEvent(this,'specificMulti:refresh');
        });
        
        triggerEvent(formElement,'specificMulti:setup');
        
        triggerEvent(form,'form:prepare');
        */
	});
    
    
    // nobodyCommon
    const nobodyCommon = function() {
        const browscap = qs(this,"main .browscap");
		const form = qs(this,"main form");
        const cookieDisabled = qs(browscap,".cookie-disabled");
        const unsupportedBrowser = qs(browscap,".unsupported-browser");
        
		triggerFunc(form,'form:focusFirst');
		
		if(!Browser.allowsCookie())
		$(cookieDisabled).show();
        
        if(Browser.isUnsupported())
		$(unsupportedBrowser).show();
    };
});