
$(document).ready(function(){
    initializeUI(this);
});

function initializeUI(context){
    $(context).find(".checkboxInAppearanceOnly").on('click',function(){return false;});

    $(context).find(".smartPlugSwitch").on('change',function(){
        var name = this.id;
        var direction = $(this).val();
        $.ajax({
            url: '/home/trigger-event',
            type: 'POST',
            data: {
                event: "trigger-edimax-switch",
                args: {
                    name: name,
                    direction: direction
                }
            }
        });
    });

    $(context).find(".wemoSwitch").on('change',function(){
        var name = this.id;
        var direction = $(this).val();
        $.ajax({
            url: '/home/trigger-event',
            type: 'POST',
            data: {
                event: "trigger-wemo",
                args: {
                    device: name,
                    value: direction
                }
            }
        });
    });

    $(context).find(".casetaDimmer").on('change',function(){
        var name = this.id;
        var direction = $(this).val();
        $.ajax({
            url: '/home/trigger-event',
            type: 'POST',
            data: {
                event: "trigger-lutron",
                args: {
                    light: name,
                    direction: direction
                }
            }
        });
    });

    $(context).find(".hueSwitch").on('change',function(){
        var name = this.id;
        var direction = $(this).val();
        $.ajax({
            url: '/home/trigger-event',
            type: 'POST',
            data: {
                event: "trigger-hue-lights",
                args: {
                    lightID: name,
                    direction: direction
                }
            }
        });
    });

    $(context).find( ".hueBri" ).slider({
      stop: function( event, ui ) {
        var name = this.id.split("-");
        name = name[1];
        var bri = $(this).val();
        $.ajax({
            url: '/home/trigger-event',
            type: 'POST',
            data: {
                event: "trigger-hue-lights",
                args: {
                    lightID: name,
                    bri: bri
                }
            }
        });
      }
    });

    $(context).find( ".casetaBrightness" ).slider({
      stop: function( event, ui ) {
        var name = this.id.split("-");
        name = name[1];
        var bri = $(this).val();
        $.ajax({
            url: '/home/trigger-event',
            type: 'POST',
            data: {
                event: "trigger-lutron",
                args: {
                    light: name,
                    brightness: bri
                }
            }
        });
      }
    });


    $(context).find(".hueColor").spectrum({
        change: function(color){
            var name = this.id.split("-");
            name = name[1];
            $.ajax({
                url: '/home/trigger-event',
                type: 'POST',
                data: {
                    event: "trigger-hue-lights",
                    args: {
                        lightID: name,
                        rgb: color.toRgb()
                    }
                }
            });
        },
        replacerClassName: 'colorPicker'
    });

    $(context).find(".hueColorButton").on('click', function(){
        var components = this.id.split("-");
        var name = components[0];
        var preset = components[1];
        $(this).parents(".hueColorBlock").find(".ui-btn-active").removeClass('ui-btn-active');
        $(this).addClass('ui-btn-active');
        $.ajax({
            url: '/home/trigger-event',
            type: 'POST',
            data: {
                event: "trigger-hue-lights",
                args: {
                    lightID: name,
                    colorPreset: preset
                }
            }
        });    
    }); 
}
    