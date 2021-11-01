;(function($, document, document, undefined) {
    var $win = $(window);
    var $doc = $(document); 

    //var max_chars = 5;
    //$('#zip').keydown( function(e){
    //    if ($(this).val().length >= max_chars) { 
    //        $(this).val($(this).val().substr(0, max_chars));
    //    }
    //});
//
    //$('#zip').keyup( function(e){
    //    if ($(this).val().length >= max_chars) { 
    //        $(this).val($(this).val().substr(0, max_chars));
    //    }
    //});

    $('input').keyup( function(e){
        if ($(this).hasClass('error')) { 
            $(this).toggleClass('error');
        }
    });
    
    window.js_functions = {
        debug :0,
        init : function () {
            var _this = window.js_functions;
            
            $('#leadform').unbind();
            $("#leadform").submit(function(event){
                event.preventDefault();
                var _this = window.js_functions;
               _this.post_form_data();
                
            });

        },
        
        post_form_data : function () {
            var _this = window.js_functions;
            
            _this.debug = 0;
           
            var html = '<img src="' + $('#process_src').val() + '" class="process_icon" />';
            
            $('#submit_btn').html('Submitting...').attr("disabled", true);
            var form_data = new FormData();              
            form_data.append('first_name', $('#first_name').val());
            form_data.append('last_name', $('#last_name').val());
            form_data.append('zip', $('#zip').val());
            form_data.append('phone_1', $('#phone_1').val());
            form_data.append('email', $('#email').val());
            form_data.append('campaign_name', $('#campaign_name').val());
            form_data.append('lead_type_thom', $('#lead_type_thom').val());
            form_data.append('utm_source', $('#utm_source').val());
            form_data.append('utm_content', $('#utm_content').val());
            form_data.append('utm_medium', $('#utm_medium').val());
            form_data.append('xxTrustedFormCertUrl', $('#xxTrustedFormCertUrl_0').val());
            form_data.append('cert', $('xxTrustedFormCertUrl'));
      
            $.ajax({
                url: $('#ajax_url').val(), // point to server-side PHP script 
                dataType: 'text',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,                         
                type: 'post',
                
                success: function(php_script_response){
                    var _this = window.js_functions;
                    if ($('#debug_pre').length > 0) {
                        $('#debug_pre').remove();
                    }
                    if (_this.debug) {
                        
                        $('#debug_wrap').append(`<pre id="debug_pre">${php_script_response}</pre>`);
                    }
                    _this.process_results(php_script_response);
                },
                error:function(x, t, e) {
                    var _this = window.js_functions;
                     if ($('#debug_pre').length > 0) {
                        $('#debug_pre').remove();
                    }
                    if (_this.debug) {
                        $('#debug_wrap').append(`<pre id="debug_pre">${x.responseText}</pre>`);
                    }
                    _this.process_results(x.responseText);
                }
             });
        },
        process_results : function(response) {
            $('#submit_btn').html('Submit');
            var _this = window.js_functions;
            console.log("response:" + response);
            if (response.length < 2) return false;
            var first_index = response.indexOf('({')  + 1;
            var last_index = response.lastIndexOf('})') + 1;
            var json_str = response.substring(first_index,last_index);
            if (json_str.length < 2) {
                    var first_index = response.indexOf('{');
                    var last_index = response.lastIndexOf('}')+1 ;
                    var json_str = response.substring(first_index,last_index);
                } 
            if (json_str.length > 1) {
                _this.data = JSON.parse(json_str);
            }
            //console.log("json_str:" + json_str);
            //console.log("_this.data: " + _this.data);
            if (typeof _this.data == "undefined") return false;
            
            $('#response').html(_this.data.message);
    
            if (_this.data.email_status != "valid" || "unknown" || "accept_all") {
                $('#email').addClass('error');
                $('#submit_btn').attr("disabled", false);
            }
            if (_this.data.status != "valid" || "unknown" || "accept_all") {
                $('#submit_btn').attr("disabled", false);
            }
            if (_this.data.status == "success") {
                var url = window.location.href;
                var mid_id = url.split('?mid=').pop();
                if (mid_id == '') {
                    window.location.href = "thanks";
                } else {
                    window.location.href = "thanks?mid=" + mid_id;
                }
                var urlParams = new URLSearchParams(window.location.search); //get all parameters
  var has_mid = urlParams.get('mid'); //extract the foo parameter - this will return NULL if foo isn't a parameter
  if(has_mid) { //check if foo parameter is set to anything
    window.location.href = "thanks?mid=" + has_mid;
  } else {
    window.location.href = "thanks";
  }
            }
        },
        
    }
    
    $doc.ready(function() {
            window.js_functions.init();
    });
    

})(jQuery, window, document);