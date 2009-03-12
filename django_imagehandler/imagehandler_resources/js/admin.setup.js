function isInteger (s)
   {
      var i;

      if (isEmpty(s))
      if (isInteger.arguments.length == 1) return 0;
      else return (isInteger.arguments[1] == true);

      for (i = 0; i < s.length; i++)
      {
         var c = s.charAt(i);

         if (!isDigit(c)) return false;
      }

      return true;
   }

   function isEmpty(s)
   {
      return ((s == null) || (s.length == 0))
   }

   function isDigit (c)
   {
      return ((c >= "0") && (c <= "9"))
   }
   

/*
**
*/

var input_start = '#id_imagecropper-crop-content_type-object_id-';

var callback = function(elem, x, y) {
    elem = $(elem);
    elem.css({
        'background-position': '-'+x+'px -'+y+'px'
    })

    position = elem.position();
    $(input_start+elem.attr('instance_id')+'-x').val(position.left);
    $(input_start+elem.attr('instance_id')+'-y').val(position.top);
    $(input_start+elem.attr('instance_id')+'-width').val(elem.width());
    $(input_start+elem.attr('instance_id')+'-height').val(elem.height());
    
    setSizeLabels(elem.attr('instance_id'), position.left, position.top, elem.width(), elem.height());

}

function setFrame(elem, x, y, width, height) {
    elem.css({
        top: y,
        left: x,
        width: width,
        height: height,
        'background-position': '-'+x+'px -'+y+'px'
    });
    
    setSizeLabels(elem.attr('instance_id'), x, y, width, height);
}

function setSize(id, width, height) {

    var cropperSelector = $('div.cropperSelector[instance_id='+id+']');
    var cropperSize = $('div.cropperSize[instance_id='+id+']');
    var position = cropperSelector.position();

    if(width) {
        cropperSelector.css('width', width+'px');
        moveSizeLabels(cropperSize, position.left, position.top, width, cropperSelector.height());
        callback(cropperSelector, position.left, position.top);
    }
        
    if(height) {
        cropperSelector.css('height', height+'px');
        moveSizeLabels(cropperSize, position.left, position.top, cropperSelector.width(), height);
        callback(cropperSelector, position.left, position.top);
    }
}

function setSizeLabels(id, left, top, width, height) {
    var cropperSize = $('div.cropperSize[instance_id='+id+']');
    $('input.width', cropperSize).val(width);
    $('input.height', cropperSize).val(height);
    
    moveSizeLabels(cropperSize, left, top, width, height);
}

function moveSizeLabels(elem, left, top, width, height) {
    elem.css({
        top: (parseInt(top) + parseInt(height) + 10)+'px',
        left: (parseInt(left) + parseInt(width) + 10)+'px'
    });
}


$(document).ready(function(){
    var crops = $('div.crop_part');
    
    crops.each(function(i){
    
        var fields = {
            original: $(input_start+i+'-original'),
            caption: $(input_start+i+'-caption'),
            identifier: $(input_start+i+'-identifier'),
            origin: {
                x: $(input_start+i+'-x').val(),
                y: $(input_start+i+'-y').val()
            },
            size: {
                width: $(input_start+i+'-width').val(),
                height: $(input_start+i+'-height').val()
            }
        }
        
        // custom field
        var cropper = $('div.cropperWrap', this);
        var selector = $('div.cropperSelector', this);
        
        selector.dragWithBounds({ dragCallback:callback });
        selector.resizeable({
            circle: '/admin-media/imagecropper/gfx/circle.png',
            circle_focus: '/admin-media/imagecropper/gfx/circle_foc.png',
            line: '/admin-media/imagecropper/gfx/line.gif',
            dragCallback:callback
        });
        
        var original_parent = fields.original.parent();
        var new_parent = $('<div>'+original_parent.html()+'</div>');
        original_parent.html('');
        
        $('select', new_parent).change(function() {
            url = $(':selected', this).text();
            selector.css('background-image', 'url('+escape(url)+')');
            img = $('img.img-'+i);
            if(img.length == 0)
                cropper.append($('<img />').addClass('img-'+i).attr('src', url).fadeTo(0, 0.5));
            else
                img.attr('src', url);
        });
        
        /*
        $('option', new_parent).each(function() {
            if($(this).val() != '') {
                split = $(this).text().split('/');
                last = split[split.length-1];
                $(this).text(last.substring(9));
            }
        });
        */

        /*
            # TODO: Fix these...
        */
        var original_caption = fields.caption.parent();
        var new_caption = $('<div>'+original_caption.html()+'</div>');
        original_caption.html('');

        var original_identifier = fields.identifier.parent();
        var new_identifier = $('<div>'+original_identifier.html()+'</div>');
        original_identifier.html('');
        
        $('div.fields', this).prepend(new_identifier);
        $('div.fields', this).prepend(new_caption);
        $('div.fields', this).prepend(new_parent);
        
        // set up start position for selector
        if(fields.original.val() != '') {
            var src = $(':selected', fields.original).text();
            selector.css('background-image', 'url('+escape(src)+')');
            cropper.append($('<img />').addClass('img-'+i).attr('src', src).fadeTo(0, 0.5));
            setFrame(
                selector,
                parseInt(fields.origin.x),
                parseInt(fields.origin.y),
                parseInt(fields.size.width),
                parseInt(fields.size.height)
            );
        } else {
            setFrame(selector, 20, 20, 50, 50);
        }

        $('input.width', this).keyup(function() {
            var width = $(this).val();
            if(isInteger(width))
                setSize(i, width, false);
        });
        $('input.height', this).keyup(function() {
            var height = $(this).val();
            if(isInteger(height))
                setSize(i, false, height);
        });
        
    });



});