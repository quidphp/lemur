/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// lemur
// script of common behaviours for all pages of the CMS

// ready
$(document).ready(function() {
	
    // alias
    var d = console.log;
    var dd = console.dir;
    var debug = quid.event.debug;
    var assert = console.assert;
    var setFunc = quid.event.setFunc;
    var ael = quid.event.addEventListener;
    var aelOnce = quid.event.addEventListenerOnce;
    var triggerEvent = quid.event.triggerEvent;
    var triggerFunc = quid.event.triggerFunc;
    var triggerCustom = quid.event.triggerCustom;
    var triggerSetup = quid.event.triggerSetup;
    debug(true);
    
    
    // initial mount
    // comportements bindés une seule fois au tout début
    ael(this,'document:mountInitial', function(event,body) {
        var modal = body.find("> .modal").first();
        
        // modal
        triggerSetup(quid.component.modal.call(modal));
    });
    
    
    // document:mountCommon
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    ael(this,'document:mountCommon', function(event,node) {
        
        /*
        // input
        var input = node.find(quid.selector.input());
        quid.component.input.call(input);
        
        // select
        var select = node.find("select");
        triggerSetup(quid.component.fakeSelect.call(select));
        
        // form
        var form = node.find("form");
        quid.component.form.call(form);
        triggerCustom(form,'form:setup');
        
        // autre
        var popupTrigger = node.find(".popup-trigger.with-popup:not(.with-ajax)");
        var popupTriggerAjax = node.find(".popup-trigger.with-popup.with-ajax");
        var anchorCorner = node.find("[data-anchor-corner='1']");
        var absolutePlaceholder = node.find("[data-absolute-placeholder='1']");
        var aConfirm = node.find("a[data-confirm]");
        
		// aConfirm
		quid.component.confirm.call(aConfirm,'click');
		
        // popupTrigger
        quid.component.clickOpenWithTrigger.call(popupTrigger,".popup-title");
        
        // popupTriggerAjax
        quid.component.clickOpenAnchorAjax.call(popupTriggerAjax,".popup-title");
        
        // anchorCorner
        quid.component.anchorCorner.call(anchorCorner);
        
        // absolutePlaceholder
        quid.component.absolutePlaceholder.call(absolutePlaceholder);
        */
	});
    
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	ael(this,'document:mount', function(event,routeWrap) {
		var html = triggerFunc(this,'document:getHtml');
		var burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
		var com = routeWrap.find("main > .inner > .com");
        var subMenu = routeWrap.find(".with-submenu");
        var carousel = routeWrap.find(".with-carousel");
        var mainSearch = routeWrap.find("header .top form");
        
        // carousel
        quid.component.carousel.call(carousel);
        
        // subMenu
        quid.component.clickOpenWithTrigger.call(subMenu,".trigger");
        setFunc(subMenu,'clickOpen:getBackgroundFrom', function(event) {
            return 'submenu';
        });
        
        // com
		triggerSetup(quid.component.com.call(com));
        
        // burger
        triggerSetup(quid.component.burger.call(burger));

        // mainSearch
        triggerSetup(quid.component.mainSearch.call(mainSearch));
	});
    
    
    // document unmount
    ael(this,'document:unmount', function(event,routeWrap) {
        var burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
        
        // burger
        triggerCustom(burger,'component:teardown');
    });
    
    
    // document ajax progress
    ael(this,'document:ajaxProgress', function(event,percent,progressEvent) {
        var body = $(this).find("body");
        var progress = body.find(".loading-progress");
        var html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
        progress.html(html);
    });
    
    
    // login
    // comportement pour la page login
	ael(this,'route:login', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	ael(this,'route:resetPassword', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// register
    // comportement pour la page enregistrement
	ael(this,'route:register', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
    // changePassword
    // comportement pour le popup changer mon mot de passe
	ael(this,'modal:accountChangePassword', function(event,modal) {
		var form = modal.find("form");
        triggerCustom(form,'form:focusFirst');
	});
    
    
    // home
    // comportement pour la page d'accueil du CMS une fois connecté
	ael(this,'route:home', function(event,routeWrap) {
		var feed = routeWrap.find("main .home-feed");
        var feedTogglers = feed.find(".block-head .feed-togglers > a");
        var feedBody = feed.find(".block-body");
        quid.component.appendContainer.call(feedBody);
        triggerCustom(quid.component.appendContainer,'feed:bind');
        
        quid.component.ajaxBlock.call(feedTogglers);
        
        setFunc(feedTogglers,'ajaxBlock:getStatusNode', function(event) {
            return feedBody;
        });
        
        ael(feedTogglers,'ajax:before', function(event) {
            feedTogglers.removeClass('selected');
            $(this).addClass('selected');
        })
        
        ael(feedTogglers,'ajax:success', function(event,data,textStatus,jqXHR) {
            triggerCustom(feedBody,'feed:overwrite',data);
        })
        
        ael(feedTogglers,'ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
            feedBody.html(parsedError);
        });
	});
    
    
    // general
    // comportement pour la page de navigation
	ael(this,'route:general', function(event,routeWrap) {
		
        var main = routeWrap.find("main");
        var scroller = main.find(".scroller");
		var search = main.find(".left > .search");
        var formTruncate = main.find(".truncate form");
		var pageLimit = main.find("input[name='limit'],input[name='page']");
        var table = scroller.find("table").first();
        var filter = table.find("th.filterable .filter-outer");
		var colsSorter = table.find("th.action");
		var filesSlider = table.find("td[data-group='media'] .slider");
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        var highlight = table.find("tr.highlight");
        
        // dragScroll
        triggerSetup(quid.component.scrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}));
        
        // page + limit
        quid.component.inputNumeric.call(pageLimit.get());
        
        // rowsChecker
        triggerSetup(quid.component.rowsChecker.call(main));
        
		// colsSorter
        quid.component.colsSorter.call(colsSorter);
		triggerCustom(colsSorter,'component:setup');
        
        // filter
		triggerSetup(quid.component.filter.call(filter));
        
		// search
		if(search.length)
		{
			var searchInput = search.find(".form input[type='text']");
			var searchSlide = search.find(".in");
			triggerSetup(quid.component.inputSearch.call(searchInput));
            quid.component.focusSlide.call(searchInput,searchSlide);
		}
		
		// formTruncate
		if(formTruncate.length)
		{
            quid.component.block.call(formTruncate,'submit');
            quid.component.confirm.call(formTruncate,'submit');
			
            ael(formTruncate,'confirmed', function() {
				triggerCustom(this,'block');
			});
		}
        
        // filesSlider
        quid.component.slider.call(filesSlider,null,null,'.slider-element',false);
        
        // quickEdit
        triggerSetup(quid.component.quickEdit.call(quickEdit));
        
        // highlight 
        ael(highlight,'mouseover', function(event) {
            $(this).removeClass('highlight');
        });
	});
    
    
    // unmount
    ael(this,'route:general:unmount', function(event,routeWrap) {
        var table = routeWrap.find("main .scroller table").first();
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        
        // quickEdit
        triggerCustom(quickEdit,'quickEdit:revert');
    });
    
    
    // specificForm mount
    // permet de faire tous les bindings des champs (simples et complexes)
    ael(this,'specificForm:mount', function(event,node) {
        triggerCustom(this,'specificForm:bindMount',node);
        triggerCustom(this,'specificForm:bindView',node);
    });
    
    
    // bindView
    // permet de faire les bindings de champs
    // ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
    ael(this,'specificForm:bindView', function(event,node) {
        var date = node.find("[data-group='date'] .specific-component");
        var enumSet = node.find("[data-tag='search'] .specific-component");
        var checkboxSortable = node.find("[data-group='relation'][data-sortable='1'] .specific-component");
        var files = node.find("[data-group='media'] .specific-component");
        var addRemove = node.find("[data-tag='add-remove'] .specific-component");
        var textarea = node.find("[data-tag='textarea'] .specific-component");
        var anchorCorner = node.find("[data-anchor-corner]");
        
        // date
        triggerSetup(quid.component.calendarInput.call(date));
        
        // enumSet
        quid.component.enumSet.call(enumSet);
        
        // checkboxSortable
        quid.component.verticalSorter.call(checkboxSortable,".choice",'.choice-in');
        
        // files
        triggerSetup(quid.component.inputFiles.call(files));
        
        // addRemove
        triggerSetup(quid.component.addRemove.call(addRemove));
        
        // textarea
        triggerSetup(quid.component.textareaExtra.call(textarea));
        
        // anchorCorner
        triggerCustom(anchorCorner,'anchorCorner:refresh');
    });
    
    
    // specificForm unmount
    // permet démonter les champs du formulaire
    ael(this,'specificForm:unmount', function(event,node) {
        var textarea = node.find("[data-tag='textarea'] .specific-component");
        triggerCustom(textarea,'component:teardown');
    });
    
    
	// specific
    // comportement communs pour les pages spécifiques
	ael(this,'group:specific', function(event,routeWrap) {
        var form = routeWrap.find("main .inner > form.specific-form");
        var panel = form.find("> .form-inner > .panel");
        var submitConfirm = form.find("button[type='submit'][data-confirm]");
        
		// submitConfirm
        quid.component.confirm.call(submitConfirm,'click');
		
        // champs simples
        triggerCustom(this,'specificForm:bindMount',form);
        
        // avec panel
        if(panel.length > 1)
        quid.component.specificPanel.call(form);
        
        else
        triggerCustom(this,'specificForm:bindView',form);
	});
	
    
    // unmount
    // comportements communs pour démonter la page spécifique
    ael(this,'group:specific:unmount', function(event,routeWrap) {
        var form = routeWrap.find("main .inner > form.specific-form");
        triggerCustom(this,'specificForm:unmount',form);
    });
    
    
    // specificMulti
    // comportement pour la page de modification multiple
	ael(this,'route:specificMulti', function(event) {
        var form = $(this).find("main .inner > form.specific-form");
        var formElement = form.find(".form-element");
        
        setFunc(formElement,'specificMulti:isActive', function(event) {
            return triggerFunc(this,'specificMulti:getCheckbox').is(':checked');
        });
        
        setFunc(formElement,'specificMulti:getCheckbox',function(event) {
            return $(this).find(".disabler input[type='checkbox']");
        });
        
        setFunc(formElement,'specificMulti:getInputs', function(event) {
            return $(this).find("> .right").find(quid.selector.input());
        });
        
        ael(formElement,'specificMulti:refresh', function(event) {
            var isActive = triggerFunc(this,'specificMulti:isActive');
            var inputs = triggerFunc(this,'specificMulti:getInputs');
            $(this).attr('data-disabled',(isActive === true)? 0:1);
            triggerCustom(inputs,(isActive === true)? 'input:enable':'input:disable');
        });
        
        aelOnce(formElement,'specificMulti:setup', function(event) {
            var $this = $(this);
            var checkbox = triggerFunc(this,'specificMulti:getCheckbox');
            
            ael(checkbox,'change', function(event) {
                triggerCustom($this,'specificMulti:refresh');
            });
            
            triggerCustom(this,'specificMulti:refresh');
        });
        
        triggerCustom(formElement,'specificMulti:setup');
        
        triggerCustom(form,'form:prepare');
	});
    
    
    // nobodyCommon
    var nobodyCommon = function() {
        var browscap = $(this).find("main .browscap");
		var form = $(this).find("main form");
        
		triggerCustom(form,'form:focusFirst');
		
		if(!quid.browser.allowsCookie())
		browscap.find(".cookie-disabled").show();
        
        if(quid.browser.isUnsupported())
		browscap.find(".unsupported-browser").show();
    };
});