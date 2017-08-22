;(function($){

    function addCommas(str)
    {
        str += '';
        x = str.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    $('.js-input-number').on('keyup', function(){
        var val = $(this).val().replace(/\D/g,'');
        $(this).val(addCommas(val));
    });

    $('form').on('keyup', 'input, textarea', function(){
        var $input = $(this),
        field = this.id,
        $error = $('.error_' + field);

        var val = $input.val();
        var val_trimmed = val.replace(/^\s+/, "");

        if (val !== val_trimmed) {
            var diff = val.length - val_trimmed.length;
            var s = $input[0].selectionStart - diff,
                e = $input[0].selectionEnd - diff;
            $input.val(val_trimmed);
            $input[0].selectionStart = s;
            $input[0].selectionEnd = e;
        }
        checkXhr(field);
        $input.removeClass('is-valid is-invalid');
        $error.addClass('is-hidden');
    });

    $('form').on('change blur', 'input, textarea, select', process);

    var xhr = {};

    function process(e)
    {
        var $input = $(this),
            field = $input.attr('data-id') || this.id;

        if (!field) {
            return;
        }

        // Trim the value because users...
        $input.val($.trim($input.val()));

        var data = $input.add($('input[name=form_name]')).add($('input[name=step]')).serialize();

        validate(field, data);
    }

    function checkXhr(field)
    {
        if (xhr.hasOwnProperty(field) && xhr[field]) {
            xhr[field].abort();
        }
    }

    function validate(id, data)
    {
        sendRequest(id, data, updateFields);   
    }

    function updateFields(fields)
    {
        $.each(fields, updateField);
    }

    function updateField(field, status)
    {
        $('.field-' + field).removeClass('is-valid is-invalid').addClass(status.valid ? 'is-valid' : 'is-invalid');
        var $error = $('.error_' + field);
        $error.addClass('is-hidden');
        if (!status.valid) {
            $error.removeClass('is-hidden');
            $error.html( $error.attr('data-format').replace(':key', field).replace(':message', status.errors[0]) );
        }
    }

    function sendRequest(id, data, cb)
    {
        checkXhr(id);

        var url = '/api/lms/validate/form';
        xhr[id] = $.post(url, data).done(function(body){
            delete xhr[id];
            cb(body);
        });
    }

})(jQuery);
