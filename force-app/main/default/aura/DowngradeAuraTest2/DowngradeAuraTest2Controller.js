({
    doInit : function(component, event, helper) {
        
        console.log('Entered into doInit of AuraComponent DowngradeAuraTest2');
    },
    
    setupJQuery : function(component, event, helper) {
        console.log('Entered into setupJQuery of DowngradeAuraTest2');
        
		$("document").ready(function(){


            setInterval(() => {

                console.log('Set interval executed')

                $(".access-test-class").unbind().click(function(){
                    console.log('Element .access-test-class was clicked');
                });
        
                $("#access-test-id").unbind().click(function(){
                    console.log('Element #access-test-id was clicked');
                });
                
                $("#child-1 + #child-2").unbind().click(function(){
                    console.log('Element #child-2 was clicked *******');
                }); 
                
                $("input").unbind().click(function(){
                    console.log('Element input was clicked');
                });

            }, 1500);

        });

    },

    refreshConsole : function(component, event, helper) {
        
        $("#input-emdev").click(function(){
            alert('Element input EMDEV was clicked');
        });

    }
})